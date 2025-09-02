import { RequestData } from "../types";
import { addRequestToBasket } from "./db_service"; // Use import instead of require

console.log(1 + 2);
  
test('adds a request to the appropriate databases', async () => {   const myRequest: RequestData | null = await addRequestToBasket('1', new Date(), 'GET', 'some headers', 'some body');
  console.log(myRequest);
  expect(myRequest?.headers).toBe('some headers');
    });