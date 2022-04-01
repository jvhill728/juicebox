//grab our client with destructuring from the export in index.js
const { client, getAllUsers, createUser, updateUser } = require("./index");

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
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);

    console.log("Finished building the tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users!");

    await createUser({ username: 'albert', password: 'bertie99', 
        name: 'albert', location: 'canada' });
    await createUser({ username: 'sandra', password: '2sandy4me', 
        name: 'sandra', location: 'mexico' });
    await createUser({ username: 'glamgal', password: 'soglam', 
        name: 'becky', location: 'california' });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.log(error);
  }
}

async function testDB() {
  try {
    console.log("Starting to test the database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);
    console.log("Result", users);

    console.log("Calling updateUser on users[0]")
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result", updateUserResult);

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
