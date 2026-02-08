const { Client } = require('pg');

async function createDatabase() {
  const config = {
    host: 'localhost',
    port: 5432,
    user: 'alaabedr',
    password: '',
    database: 'postgres', // Connect to default 'postgres' db first
  };

  const client = new Client(config);

  try {
    await client.connect();
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'catering_db'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE catering_db');
      console.log('Database "catering_db" created successfully.');
    } else {
      console.log('Database "catering_db" already exists.');
    }
  } catch (err) {
    if (err.code === '3D000') { // invalid_catalog_name (postgres db might not exist)
        console.log("Could not connect to 'postgres' db, trying 'template1'...");
        await client.end();
        await createDatabaseTemplate1();
        return;
    }
    console.error('Error creating database:', err);
  } finally {
    // Only end if connected (check internal state or just try/catch)
    try { await client.end(); } catch (e) {}
  }
}

async function createDatabaseTemplate1() {
   const config = {
    host: 'localhost',
    port: 5432,
    user: 'alaabedr',
    password: '',
    database: 'template1', 
  };
  
  const client = new Client(config);
  try {
      await client.connect();
      const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'catering_db'");
      if (res.rowCount === 0) {
        await client.query('CREATE DATABASE catering_db');
        console.log('Database "catering_db" created successfully using template1.');
      } else {
        console.log('Database "catering_db" already exists.');
      }
  } catch (err) {
      console.error('Error creating database with template1:', err);
  } finally {
      await client.end();
  }
}

createDatabase();
