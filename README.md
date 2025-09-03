Running The App In the Dev Environment

1. Set up the PostgreSQL database
  a. Create a database with a name of your choice.
  b. Navigate to the database and run the code in `/server/db_setup.sql`. This will set up the database schema and insert some seed data.
2. Set up the Mongo database
  a. Make sure `mongod` is installed and currently running
3. Create the file `/server/.env` and include the following data:
    DB_USER='$my_postgresql_user'
    DB_PASSWORD='$my_postgresql_password'
    DB_HOST='$my_postgresql_address'
    DB_PORT='$my_postgresql_port'
    DB_NAME='$my_postgresql_database_name'
    MONGODB_URI='$my_mongodb_uri'
4. From the root directory, run `npm install`
5. From `/server`, execute `npm run dev`
6. From `/client`, execute `npm run dev`
7. Access the frontend on `localhost:5173` in your browser. It should automatically coordinate with the backend running on `localhost:3000`. You can also send requests to backend routes directly using an API tool or REST client.