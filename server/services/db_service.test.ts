import { RequestData, RequestDB, BasketData, UserData } from "../types";
import { selectRequest, selectAllRequests, createBasket, addRequestToBasket, deleteBasket, RequestBody, selectBasket, selectAllBaskets, selectUser, createUser } from "./db_service";
import { Client } from 'pg';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false)

test('gets correct user id based on token', async () => {
  const myRequest: number | null = await selectUser('zyxwvut')
  expect(myRequest).toBe(1);
});

test('adds a request to the appropriate databases', async () => {
  const myRequest: RequestData | null = await addRequestToBasket('1', new Date(), 'GET', 'some headers', 'some body');
  expect(myRequest?.headers).toBe('some headers');
});

test('adds a new user', async () => {
  const client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME
    });

  await client.connect();

  const selectQuery = "SELECT token FROM users";
  const selectResult = await client.query<Pick<UserData, 'token'>>(selectQuery);
  const oldUserCount = selectResult.rowCount;
  const oldUserTokens = selectResult.rows.map(row => row.token)

  const myRequest: UserData | null = await createUser();

  const newSelectResult = await client.query<Pick<UserData, 'token'>>(selectQuery);
  const newUserCount = newSelectResult.rowCount;

  expect(newUserCount).toBe((oldUserCount ?? 0) + 1);
  expect(oldUserTokens).not.toContain(myRequest?.token)
  await client.end()
})

test('gets an individual basket', async () => {
  const myRequest: BasketData | null = await selectBasket(1);
  expect(myRequest?.basket_path).toBe('abcdefg');
});

test('gets all baskets', async () => {
  const myRequest: BasketData[] | null = await selectAllBaskets(1);

  const client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME
    });

  await client.connect();

  const selectQuery = "SELECT id FROM baskets WHERE user_id = $1";
  const selectResult = await client.query<RequestDB>(selectQuery, [1]);

  expect(myRequest?.length).toBe(selectResult.rowCount);
  await client.end()
});

test('gets body data from Mongo during select', async () => {
  const myRequest: RequestData | null = await selectRequest('6');
  expect(myRequest?.body).toBe('some body');
});

test('gets body data from Mongo during selectAll', async () => {
  const myRequest: RequestData[] | null = await selectAllRequests('1');
  expect(myRequest?.map(request => request.body)).toContain('some body');
});

test('deleting a basket deletes its requests and mongo bodies', async() => {
  const newBasket = await createBasket(1);

  if (!newBasket) return;

  const basketId = String(newBasket.id)

  await addRequestToBasket(basketId, new Date(), 'GET', 'delete test headers', `delete test body for ${basketId}`);

  const queryResults = await selectAllRequests(basketId);
  expect(queryResults?.map(request => request.body)).toContain(`delete test body for ${basketId}`);

  await deleteBasket(basketId);

  const client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME
    });

  await client.connect();

  const selectBasketQuery = "SELECT id FROM baskets WHERE id = $1";
  const selectBasketResult = await client.query<RequestDB>(selectBasketQuery, [basketId]);
  expect(selectBasketResult.rowCount).toBe(0)

  const selectRequestsQuery = "SELECT id FROM requests WHERE basket_id = $1";
  const selectRequestsResult = await client.query<RequestDB>(selectRequestsQuery, [basketId]);
  expect(selectRequestsResult.rowCount).toBe(0)

  await client.end();


  await mongoose.connect(process.env.MONGODB_URI as string)

  const mongoBodyResult = await RequestBody.find({body: `delete test body for ${basketId}`})
    .exec()
  expect(mongoBodyResult.length).toBe(0)

  await mongoose.connection.close();
})