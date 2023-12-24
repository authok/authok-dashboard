const mongodb = `module.exports = function remove(id, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient('mongodb://user:pass@localhost');

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('db-name');
    const users = db.collection('users');

    users.remove({ _id: id }, function (err) {
      client.close();

      if (err) return callback(err);
      callback(null);
    });
  });
}`;

const mysql = `module.exports = function remove(id, callback) {
  const mysql = require('mysql2');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'mydb'
  });

  connection.connect();

  const query = 'DELETE FROM users WHERE id = ?';

  connection.query(query, [ id ], function(err) {
    if (err) return callback(err);
    callback(null);
  });
}`;

const postgre = `module.exports = function remove(id, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  const postgres = require('pg');

  const conString = 'postgres://user:pass@localhost/mydb';
  postgres.connect(conString, function (err, client, done) {
    if (err) return callback(err);

    const query = 'DELETE FROM users WHERE id = $1';
    client.query(query, [id], function (err) {
      // NOTE: always call \`done()\` here to close
      // the connection to the database
      done();

      return callback(err);
    });
  });
}`;

const sqlserver = `module.exports = function remove(id, callback) {
  // this example uses the "tedious" library
  // more info here: http://pekim.github.io/tedious/index.html
  const sqlserver = require('tedious@1.11.0');

  const Connection = sqlserver.Connection;
  const Request = sqlserver.Request;
  const TYPES = sqlserver.TYPES;

  const connection = new Connection({
    userName:  'test',
    password:  'test',
    server:    'localhost',
    options:  {
      database: 'mydb'
    }
  });

  const query = 'DELETE FROM dbo.Users WHERE id = @UserId';

  connection.on('debug', function (text) {
    console.log(text);
  }).on('errorMessage', function (text) {
    console.log(JSON.stringify(text, null, 2));
  }).on('infoMessage', function (text) {
    console.log(JSON.stringify(text, null, 2));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);

    const request = new Request(query, function (err) {
      if (err) return callback(err);
      callback(null);
    });

    request.addParameter('UserId', TYPES.VarChar, id);

    connection.execSql(request);
  });
}`;

const basic_auth = `module.exports = function remove(id, callback) {
  const request = require('request');

  request.del({
    url: 'https://localhost/users/' + id
    // for more options check:
    // https://github.com/mikeal/request#requestoptions-callback
  }, function(err, response, body) {
    if (err) return callback(err);

    callback(null);
  });
}`;

const mvc3 = `module.expors = function remove(id, callback) {
  const sqlserver = require('tedious@1.11.0');

  const Connection = sqlserver.Connection;
  const Request = sqlserver.Request;
  const TYPES = sqlserver.TYPES;

  const connection = new Connection({
    userName: 'the username',
    password: 'the password',
    server: 'the server',
    options: {
      database: 'the db name',
      encrypt: true,
      // Required to retrieve userId needed for Membership entity creation
      rowCollectionOnRequestCompletion: true
    }
  });

  connection.on('debug', function(text) {
    // if you have connection issues, uncomment this to get more detailed info
    // console.log(text);
  }).on('errorMessage', function(text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function(err) {
    if (err) return callback(err);

    executeDelete(['Memberships', 'Users'], function(err) {
      if (err) return callback(err);

      callback(null);
    });
  });

  function executeDelete(tables, callback) {
    const query = tables.map(function(table) {
      return 'DELETE FROM ' + table + ' WHERE UserId = @UserId';
    }).join(';');
    const request = new Request(query, function(err) {
      if (err) return callback(err);

      callback(null);
    });
    request.addParameter('UserId', TYPES.VarChar, id);
    connection.execSql(request);
  }
}`;

const mvc4 = `module.exports = function remove(id, callback) {
  const sqlserver = require('tedious@1.11.0');

  const Connection = sqlserver.Connection;
  const Request = sqlserver.Request;
  const TYPES = sqlserver.TYPES;

  const connection = new Connection({
    userName: 'the username',
    password: 'the password',
    server: 'the server',
    options: {
      database: 'the db name',
      encrypt: true,
      // Required to retrieve userId needed for Membership entity creation
      rowCollectionOnRequestCompletion: true
    }
  });

  connection.on('debug', function (text) {
    // if you have connection issues, uncomment this to get more detailed info
    // console.log(text);
  }).on('errorMessage', function (text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);
    executeDelete(['webpages_Membership', 'UserProfile'], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  });

  function executeDelete(tables, callback) {
    const query = tables.map(function (table) {
      return 'DELETE FROM ' + table + ' WHERE UserId = @UserId';
    }).join(';');
    const request = new Request(query, function (err) {
      if (err) return callback(err);
      callback(null);
    });
    request.addParameter('UserId', TYPES.VarChar, id);
    connection.execSql(request);
  }
}`;


export default {
  mongodb,
  mysql,
  postgre,
  sqlserver,
  basic_auth,
  mvc3,
  mvc4,
}