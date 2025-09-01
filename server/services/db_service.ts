import { Client } from 'pg';
import generatePath from './path_generator';
import type { user_id, RequestData, BasketData, } from "../types.js";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });




async function connect() {
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
    client = await connect();
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

async function selectAllRequests(basketId: string): Promise<RequestData[] | null> {
  let client;
  try {
    client = await connect();
    const selectQuery = "SELECT id, received, method, headers, body FROM requests WHERE basket_id = $1";
    const result = await client.query<RequestData>(selectQuery, [basketId]);
    return result.rows;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

 createBasket(1).then(console.log); 

export { selectAllRequests, createBasket };


