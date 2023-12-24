const mongodb = `module.exports = function getUser({ id, username, phone_number, email }, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient('mongodb://user:pass@localhost');

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('db-name');
    const users = db.collection('users');

    users.findOne({ username: username }, function (err, user) {
      client.close();

      if (err) return callback(err);
      if (!user) return callback(null, null);

      return callback(null, {
        user_id: user._id.toString(),
        nickname: user.nickname,
        username: user.username
      });
    });
  });
}`;

const mysql = `module.exports = function getUser({ id, username, phone_number, email }, callback) {
  const mysql = require('mysql2');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'mydb'
  });

  connection.connect();

  const query = 'SELECT id, nickname, username FROM users WHERE username = ?';

  connection.query(query, [ username ], function(err, results) {
    if (err || results.length === 0) return callback(err || null);

    const user = results[0];
    callback(null, {
      user_id: user.id.toString(),
      nickname: user.nickname,
      username: user.username
    });
  });
}`;

const postgre = `module.exports = function getUser({ id, username, phone_number, email }, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  const postgres = require('pg');

  const conString = 'postgres://user:pass@localhost/mydb';
  postgres.connect(conString, function (err, client, done) {
    if (err) return callback(err);

    const query = 'SELECT id, nickname, username FROM users WHERE username = $1';
    client.query(query, [username], function (err, result) {
      // NOTE: always call \`done()\` here to close
      // the connection to the database
      done();

      if (err || result.rows.length === 0) return callback(err);

      const user = result.rows[0];

      return callback(null, {
        user_id: user.id,
        nickname: user.nickname,
        username: user.username
      });
    });
  });
}`;

const sqlserver = `module.exports = function getUser({ id, username, phone_number, email }, callback) {
  //this example uses the "tedious" library
  //more info here: http://pekim.github.io/tedious/index.html
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

  const query = 'SELECT Id, Nickname, Username FROM dbo.Users WHERE Username = @Username';

  connection.on('debug', function (text) {
    console.log(text);
  }).on('errorMessage', function (text) {
    console.log(JSON.stringify(text, null, 2));
  }).on('infoMessage', function (text) {
    console.log(JSON.stringify(text, null, 2));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);

    const request = new Request(query, function (err, rowCount, rows) {
      if (err) return callback(err);

      callback(null, {
        user_id: rows[0][0].value,
        nickname: rows[0][1].value,
        username: rows[0][2].value
      });
    });

    request.addParameter('Username', TYPES.VarChar, username);
    connection.execSql(request);
  });
}`;

const basic_auth = `module.exports = function getUser({ id, username, phone_number, email }, callback) {
  const request = require('request');

  request.get({
    url: 'https://localhost/users-by-username/' + username
    //for more options check:
    //https://github.com/mikeal/request#requestoptions-callback
  }, function(err, response, body) {
    if (err) return callback(err);

    const user = JSON.parse(body);

    callback(null, {
      user_id: user.user_id.toString(),
      nickname: user.nickname,
      username: user.username
    });
  });
}`;

const mvc3 = `module.exports = function getUser({ id, username, phone_number, email }, callback) {
  const sqlserver = require('tedious@1.11.0');

  const Connection = sqlserver.Connection;
  const Request = sqlserver.Request;
  const TYPES = sqlserver.TYPES;

  const connection = new Connection({
    userName: 'username',
    password: 'password',
    server: 'server',
    options: {
      database: 'db name',
      encrypt: true // for Windows Azure
    }
  });

  connection.on('debug', function(text) {
    // if you have connection issues, uncomment this to get more detailed info
    //console.log(text);
  }).on('errorMessage', function(text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function(err) {
    if (err) return callback(err);

    var user = {};
    const query =
      'SELECT Memberships.UserId, Username, Users.UserName ' +
      'FROM Memberships INNER JOIN Users ' +
      'ON Users.UserId = Memberships.UserId ' +
      'WHERE Memberships.Username = @Username OR Users.UserName = @Username';

    const getMembershipQuery = new Request(query, function(err, rowCount) {
      if (err) return callback(err);
      if (rowCount < 1) return callback();

      callback(null, user);
    });

    getMembershipQuery.addParameter('Username', TYPES.VarChar, username);

    getMembershipQuery.on('row', function(fields) {
      user = {
        user_id: fields.UserId.value,
        nickname: fields.UserName.value,
        username: fields.Username.value
      };
    });

    connection.execSql(getMembershipQuery);
  });
}`;

const mvc4 = `module.exports = function getUser({ id, username, phone_number, email }, callback) {
  const sqlserver = require('tedious@1.11.0');

  const Connection = sqlserver.Connection;
  const Request = sqlserver.Request;
  const TYPES = sqlserver.TYPES;

  const connection = new Connection({
    userName: 'username',
    password: 'password',
    server: 'server',
    options: {
      database: 'db name',
      encrypt: true // for Windows Azure
    }
  });

  connection.on('debug', function(text) {
    // if you have connection issues, uncomment this to get more detailed info
    //console.log(text);
  }).on('errorMessage', function(text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function(err) {
    if (err) return callback(err);

    var user = {};
    const query =
      'SELECT webpages_Membership.UserId, UserName, UserProfile.UserName from webpages_Membership ' +
      'INNER JOIN UserProfile ON UserProfile.UserId = webpages_Membership.UserId ' +
      'WHERE UserProfile.UserName = @Username';

    const getMembershipQuery = new Request(query, function (err, rowCount) {
      if (err) return callback(err);
      if (rowCount < 1) return callback();

      callback(null, user);
    });

    getMembershipQuery.addParameter('Username', TYPES.VarChar, username);

    getMembershipQuery.on('row', function (fields) {
      user = {
        user_id: fields.UserId.value,
        nickname: fields.UserName.value,
        username: fields.UserName.value
      };
    });

    connection.execSql(getMembershipQuery);
  });
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