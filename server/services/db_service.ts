import { Client } from 'pg';
import generatePath from './path_generator';
import type { user_id, RequestDB, RequestData, BasketData, } from "../types.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `${__dirname}/../.env` });

console.log('db user: ', process.env.DB_USER);
console.log('mongo uri: ', process.env.MONGODB_URI);

mongoose.set('strictQuery', false)

const requestBodySchema = new mongoose.Schema({
  body: String,
});

const RequestBody = mongoose.model('RequestBody', requestBodySchema)

async function connectSQL() {
  try {
    const client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
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

async function selectRequest(requestId: string): Promise<RequestData | null> {
  let client;
  try {
    client = await connectSQL();
    const selectQuery = "SELECT id, received, method, headers, body_id, basket_id FROM requests WHERE id = $1";
    const queryResult = await client.query<RequestDB>(selectQuery, [requestId]);
    const pgRequest = queryResult.rows[0];

    await mongoose.connect(process.env.MONGODB_URI as string)

    const mongoResult = await RequestBody.findById(pgRequest.body_id);
    const mongoBody = mongoResult?.body || ""

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

async function selectAllRequests(basketId: string): Promise<RequestData[] | null> {
  let client;
  try {
    client = await connectSQL();
    const selectQuery = "SELECT id, received, method, headers, body_id, basket_id FROM requests WHERE basket_id = $1";
    const result = await client.query<RequestDB>(selectQuery, [basketId]);
    const pgRequests = result.rows;

    await mongoose.connect(process.env.MONGODB_URI as string)

    const mongoBodies = await Promise.allSettled(pgRequests.map(async pgRequest => {
      return await RequestBody.findById(pgRequest.body_id)
    }))

    const resultBodies = mongoBodies.map(result => {
      return (result.status === "fulfilled") ? result.value?.body : "";
    })

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
    })

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

async function addRequestToBasket(basketId: string, timestamp: Date, method: string, headers: string, body: string): Promise<RequestData | null> {
  let pgClient;
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)

    const reqBody = new RequestBody({
      body: body || "",
    })

    const mongoResult = await reqBody.save()
    const mongoBody = String(mongoResult.body)
    const mongoId = String(mongoResult.id);

    mongoose.connection.close();

    pgClient = await connectSQL();

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
  }
}

export { selectRequest, selectAllRequests, createBasket, addRequestToBasket };


