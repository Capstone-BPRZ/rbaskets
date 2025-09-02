import { RequestData } from "../types";
import { selectAllRequests, selectRequest, addRequestToBasket } from "./db_service"; // Use import instead of require


test('adds a request to the appropriate databases', async () => {
  const myRequest: RequestData | null = await addRequestToBasket('1', new Date(), 'GET', 'some headers', 'some body');
  expect(myRequest?.headers).toBe('some headers');
});

test('gets body data from Mongo during select', async () => {
  const myRequest: RequestData | null = await selectRequest('6');
  console.log(myRequest);
  expect(myRequest?.body).toBe('some body');
});

test('gets body data from Mongo during selectAll', async () => {
  const myRequest: RequestData[] | null = await selectAllRequests('1');
  expect(myRequest?.map(request => request.body)).toContain('some body');
});