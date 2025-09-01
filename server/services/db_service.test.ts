const { addRequestToBasket } = require("./db_service");

console.log(1 + 2);

test('adds a request to the appropriate databases', async () => {
  const myRequest = await addRequestToBasket('1', new Date(), 'GET', 'some headers', 'some body')

  console.log(myRequest)

  expect(myRequest?.headers).toBe('some headers')
})