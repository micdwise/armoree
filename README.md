# Armoree

Used to keep an inventory of your firearm collection and ammunition.  It can be extended to manage other items in the future. The current plans are to be able to display data from the database and add items and call it v0.1.

Thoughts are:

* run both the client and server in OCI containers
* add the ability to set variables such as database host, database and user name at first run
* capture more details about ammo and firearms
* whatever else comes to mind

## Architecture

The project is divided into three parts.  The client, server api's, and a postgresql database.

### Postgresql Database

Postgresql can be installed locally or on a separate server.  To setup the data base run the database script found in the server folder.

```psql
psql -h [database host] -d postgres < [project directory]/server/database.sql
```

Copy the `.env.sample` to `.env` and replace the placeholders with you database information

### API Server

#### `npm start:dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
