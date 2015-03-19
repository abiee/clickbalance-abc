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

Contribution
---------------
If you have ideas or find an error feel free to submit a PR.

Licence
-------
Licensed under the MIT license.
