const { Client } = require('pg')
require('dotenv').config({path: '../.env'})

async function connect() {
  try {
    const client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    })

    await client.connect()
    return client;

  } catch (err) {
    console.error(err);
  }
}

async function selectAllRequests(basketId) {
  let client;
  try {
    client = await connect()
    const selectQuery = "SELECT received, method, headers, body_id FROM requests WHERE basket_id = $1"
    const result = await client.query(selectQuery, [basketId]);
    return result.rows;
  } catch (err) {
    console.error(err)
  } finally {
    if (client) {
      await client.end()
    }
  }
}

module.exports = { selectAllRequests }


