//grab our client with destructuring from the export in index.js
const { client, getAllUsers } = require('./index');


//this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping the tables...");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error; 
  }
}


//this function should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log("Starting to build the tables!");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);

    console.log("Finished building the tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error; 
  }
}


async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
  } catch (error) {
    console.log(error);
  } 
}


async function testDB() {
  try {
    console.log("Starting to test the database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error testing database!");
    throw error;
  }
}



rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());




