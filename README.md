ClickBalance ABC Test
=====================
This project shows how to use a Express and Marionette in a simple web application. The project is focused on a single Client resource, it allow us to create, read, update and delete resources through a Backbone.Marionette User Interface.

This is an example implementation of the project [ES6 Marionette Express Project](https://github.com/abiee/es6-marionette-express).

What's inside
----------------
Batteries included:
 - Gulp
 - Webpack
 - Babel Loader
 - Bootstrap
 - jQuery
 - Backbone
 - Marionette
 - Lodash instead Underscore
 - Handlebars
 - Less
 - Livereload
 - Karma
 - Mocha-Chai-Sinon
 - MongoDB
 - Express

Includes Marionette shim for Marionette.Radio instead Wreqr. See: [Deprecation notes](http://marionettejs.com/docs/v2.3.1/marionette.application.html#the-application-channel) and [Backbone.Radio documentation](https://github.com/marionettejs/backbone.radio#using-with-marionette).

Setup
-----
Clone the repository and install the dependencies.

    $ git clone https://github.com/abiee/clickbalance-abc.git
    $ cd clickbalance-abc
    $ npm install
    $ bower install
    $ gulp run

Do not forget to install globally gulp if not installed yet. Note: this project was tested with node v0.12.x.

Databases
---------
The application supports two types of databases:
 - Memory. Memory database does not need to install anything but you will lost all the information when server restarts, useful for testing propourses.
 - MongoDB. If you want a more traditional approach you can choose to use a MongoDB.

To configure your favorite database please edit the `config/default.js` file as show below.

    // memory example
    {
      "database": {
        "client": "memory"
      }
    }

    // mongodb example
    {
      "database": {
        "client": "mongodb",
        "url": "mongodb://localhost:27017/dbname"
      }
    }

By default memory database is selected. You can configure your production environment by creating a file on `config/production.js` and run your project in production mode.

    $ gulp build
    $ editor dist/config/production.json
    $ cd dist
    $ NODE_ENV=production node app

Also you can build your own database driver for this application by implementing the Databse interface, teke a look at `server/database/InMemoryDatabase.js` to see which method you will need to implement.

Build
-----
If you want to build the project run.

    $ gulp build

This process creates a dist path in the root directory, inside you can run.

    $ node app

To run the application on production mode.

Testing
-------
Hey this application comes with tests too, you can run all test with.

    $ npm test

Maybe you will need to test a CHOME_BIN environent variable to point at your Google Chrome binary. For example, on ArchLinux.

    $ export CHOME_BIN=google-chrome-stable

Known Issues
------------
 - If browser opens before backend server start, it will crash, this is due connect proxy
 - There is not a frontend pagination component implemented yet, however server has support of skip and limit
 - Client list shows a limit of 10 clients due no pagination component
 - If tdd:server is run, it can fail some tests in MongoDB due connection limit reached, just restart the gulp process
 - If the process turns slow you will need to clean all cached files with `gulp clean`

Contribution
---------------
If you have ideas or find an error feel free to submit a PR.

Licence
-------
Licensed under the MIT license.
