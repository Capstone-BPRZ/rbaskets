import { Client } from 'pg';
import generatePath from './path_generator';
import type { user_id, RequestDB, RequestData, BasketData, RDSCredentials } from "../types.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

dotenv.config({ path: `${__dirname}/../.env` });

mongoose.set('strictQuery', false);

const requestBodySchema = new mongoose.Schema({
  body: String,
});

const RequestBody = mongoose.model('RequestBody', requestBodySchema)

async function getRDSSecrets() {
  const psqlSecretName = "w3d3/psql";

  const client = new SecretsManagerClient({
    region: "us-east-1",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: psqlSecretName,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
     throw error;
  }

  if (!response.SecretString) {
    throw new Error("Database credentials not found");
  }

  return JSON.parse(response.SecretString) as RDSCredentials;
}

async function connectSQL() {
  try {
    const rdsSecrets = await getRDSSecrets();

    const client = new Client({
      user: rdsSecrets.username,
      password: rdsSecrets.password,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME
    });

    await client.connect();
    return client;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createBasket(userId: user_id): Promise<BasketData | null> {
  let client;
  try {
    client = await connectSQL();
    await client.query('BEGIN');

    const getPathsStatement = "SELECT basket_path FROM baskets";
    const allPathsResult = await client.query<{ basket_path: string }>(getPathsStatement);
    const allPaths: string[] = allPathsResult.rows.map(el => el.basket_path);
    const basketPath: string = generatePath(allPaths);

    const insertStatement = "INSERT INTO baskets (user_id, basket_path) VALUES ($1, $2)";
    await client.query(insertStatement, [userId, basketPath]);
    await client.query('COMMIT');

    const getNewBasketStatement = "SELECT * FROM baskets WHERE basket_path = $1";
    const newBasketResult = await client.query<BasketData>(getNewBasketStatement, [basketPath]);

    return newBasketResult.rows[0] || null;
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error(err);
    return null;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

async function selectAllBaskets(userId: user_id): Promise<BasketData[] | null> {
  let client;
  try {
    client = await connectSQL();
    const selectQuery = "SELECT id, user_id, basket_path FROM baskets WHERE user_id = $1";
    const queryResult = await client.query<BasketData>(selectQuery, [userId]);
    return queryResult.rows;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

async function selectBasket(basketPath: string): Promise<BasketData | null> {
  let client;
  try {
    client = await connectSQL();
    const selectQuery = "SELECT id, user_id, basket_path FROM baskets WHERE basket_path = $1";
    const queryResult = await client.query<BasketData>(selectQuery, [basketPath]);
    return queryResult.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

async function selectRequest(requestId: string): Promise<RequestData | null> {
  let client;
  try {
    client = await connectSQL();
    const selectQuery = "SELECT id, received, method, headers, body_id, basket_id FROM requests WHERE id = $1";
    const queryResult = await client.query<RequestDB>(selectQuery, [requestId]);
    const pgRequest = queryResult.rows[0];

    await mongoose.connect(process.env.MONGODB_URI as string);

    const mongoResult = await RequestBody.findById(pgRequest.body_id);
    const mongoBody = mongoResult?.body || "";

    const fullRequest: RequestData = {
      id: pgRequest.id,
      basket_id: pgRequest.basket_id,
      received: pgRequest.received,
      method: pgRequest.method,
      headers: pgRequest.headers,
      body: mongoBody,
    };

    return fullRequest;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    if (client) {
      await client.end();
    }
    await mongoose.connection.close();
  }
}

async function selectAllRequests(basketPath: string): Promise<RequestData[] | null> {
  let client;
  try {
    client = await connectSQL();
    const selectQuery = "SELECT requests.id, received, method, headers, body_id, basket_id " +
                        "FROM requests " +
                        "JOIN baskets ON requests.basket_id = baskets.id " +
                        "WHERE basket_path = $1";
    const result = await client.query<RequestDB>(selectQuery, [basketPath]);
    const pgRequests = result.rows;

    await mongoose.connect(process.env.MONGODB_URI as string);

    const mongoBodies = await Promise.allSettled(pgRequests.map(async pgRequest => {
      return await RequestBody.findById(pgRequest.body_id);
    }));

    const resultBodies = mongoBodies.map(result => {
      return (result.status === "fulfilled") ? result.value?.body : "";
    });

    const fullRequestList = pgRequests.map((pgRequest, idx) => {
      const fullRequest: RequestData = {
        id: pgRequest.id,
        basket_id: pgRequest.basket_id,
        received: pgRequest.received,
        method: pgRequest.method,
        headers: pgRequest.headers,
        body: resultBodies[idx] ?? "",
      };

      return fullRequest;
    });

    return fullRequestList;

  } catch (err) {
    console.error(err);
    return null;
  } finally {
    if (client) {
      await client.end();
    }
    await mongoose.connection.close();
  }
}

async function basketIdFromPath(basketPath: string) {
  let pgClient;
  try {
    pgClient = await connectSQL();
    const getBasketIdStatement = "SELECT id FROM baskets WHERE basket_path = $1"
    const basketIdResult = await pgClient.query(getBasketIdStatement, [basketPath])
    return basketIdResult.rows[0]?.id
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    if (pgClient) {
      await pgClient.end();
    }
  }
}

async function addRequestToBasket(basketPath: string, timestamp: Date, method: string, headers: string, body: string): Promise<RequestData | null> {
  let pgClient;
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)

    const reqBody = new RequestBody({
      body: body || "",
    })

    const mongoResult = await reqBody.save()
    const mongoBody = String(mongoResult.body)
    const mongoId = String(mongoResult.id);

    pgClient = await connectSQL();

    const basketId = await basketIdFromPath(basketPath);

    await pgClient.query('BEGIN');

    const insertStatement = "INSERT INTO requests (basket_id, received, method, headers, body_id) VALUES ($1, $2, $3, $4, $5)";
    await pgClient.query(insertStatement, [basketId, timestamp, method, headers, mongoId]);
    await pgClient.query('COMMIT');

    const getNewRequestStatement = "SELECT * FROM requests WHERE body_id = $1";
    const newRequestResult = await pgClient.query<RequestDB>(getNewRequestStatement, [mongoId]);
    const pgRequest = newRequestResult.rows[0];

    const fullRequest: RequestData = {
      id: pgRequest.id,
      basket_id: pgRequest.basket_id,
      received: pgRequest.received,
      method: pgRequest.method,
      headers: pgRequest.headers,
      body: mongoBody,
    };

    return fullRequest;
  } catch (err) {
    if (pgClient) {
      await pgClient.query('ROLLBACK');
    }
    console.error(err);
    return null;
  } finally {
    if (pgClient) {
      await pgClient.end();
    }
    mongoose.connection.close();
  }
}

async function deleteBasket(basketPath: string): Promise<number | null> {
  let client;
  try {
    client = await connectSQL();

    const basketId = await basketIdFromPath(basketPath);

    const selectQuery = "SELECT body_id FROM requests WHERE basket_id = $1";
    const result = await client.query<RequestDB>(selectQuery, [basketId]);
    const bodyIds = result.rows.map(row => row.body_id);

    const deleteQuery = "DELETE FROM baskets WHERE id = $1";
    await client.query<RequestDB>(deleteQuery, [basketId]);
    await client.query('COMMIT');

    await mongoose.connect(process.env.MONGODB_URI as string)
    await Promise.allSettled(bodyIds.map(async bodyId => await RequestBody.findByIdAndDelete(bodyId)))

    return basketId;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    if (client) {
      await client.end();
    }
    await mongoose.connection.close();
  }
}

export { selectRequest, selectAllRequests,
         selectBasket, selectAllBaskets,
         createBasket, addRequestToBasket, deleteBasket,
         RequestBody };
