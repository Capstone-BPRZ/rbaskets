const { Client } = require('pg')
const generatePath = require('path_generator')

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

async function createBasket(userId) {
  let client;
  try {
    client = await connect()
    await client.query('BEGIN')
    const getPathsStatement = "SELECT basket_path FROM baskets"
    let allPaths = await client.query(getPathsStatement)

    allPaths = allPaths.rows.map(el => el.basket_path);



    // get list of existing basket paths to guarantee uniqueness
    // generate random value and check that it isn't an existing path

    // const insertStatement = "INSERT INTO baskets (user_id, basket_path) VALUES ($1, $2)"
    // const returnA = await client.query(insertStatement, [userId, basketPath]);
    // const returnB = await client.query('COMMIT')
    // console.log('return value of insert: ', returnA)
    // console.log('return value of commit: ', returnB)
    // need to return id of the created basket and potentially other data about it
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
  } finally {
    if (client) {
      await client.end()
    }
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

createBasket(1).then(console.log)

module.exports = { selectAllRequests, createBasket }


