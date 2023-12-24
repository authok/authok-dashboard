const mongodb = `module.exports = function verify ({ id, username, phone_number, email }, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient('mongodb://user:pass@localhost');

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('db-name');
    const users = db.collection('users');
    let query;
    let data;
    if (email) {
      query = { email: email, email_verified: false };
      data = { $set: { email_verified: true }};
    } else if (phone_number) {
      query = { phone_number: phone_number, phone_number_verified: false };
      data = { $set: { phone_number_verified: true }};
    }

    users.update(query, data, function (err, count) {
      client.close();

      if (err) return callback(err);
      callback(null, count > 0);
    });
  });
}`;

const mysql = `module.exports = function verify({ id, username, phone_number, email }, callback) {
  const mysql = require('mysql2');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'mydb'
  });

  connection.connect();

  let query;
  let data;
  if (email) {
    query = 'UPDATE users SET email_verified = true WHERE email_verified = false AND email = ?';
    data = [ email ];
  } else if (phone_number) {
    query = 'UPDATE users SET phone_number_verified = true WHERE phone_number_verified = false AND phone_number = ?';  
    data = [ phone_number ];
  }

  connection.query(query, data, function(err, results) {
    if (err) return callback(err);

    callback(null, results.length > 0);
  });
}`;

const postgre = `module.exports = function verify ({ id, username, phone_number, email }, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  const postgres = require('pg');

  const conString = 'postgres://user:pass@localhost/mydb';
  postgres.connect(conString, function (err, client, done) {
    if (err) return callback(err);

    let query;
    let data;
    if (email) {
      query = 'UPDATE users SET email_verified = true WHERE email_verified = false AND email = $1';
      data = [email];
    } else if (phone_number) {
      query = 'UPDATE users SET phone_number_verified = true WHERE phone_number_verified = false AND phone_number = $1';
      data = [phone_number];
    }

    client.query(query, data, function (err, result) {
      // NOTE: always call \`done()\` here to close
      // the connection to the database
      done();

      return callback(err, result && result.rowCount > 0);
    });
  });
}`;

const sqlserver = `module.exports = function verify ({ id, username, phone_number, email }, callback) {
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

  let query;
  if (email) {
    query = 'UPDATE dbo.Users SET Email_Verified = true WHERE Email_Verified = false AND Email = @Email';
  } else if (phone_number) {
    query = 'UPDATE dbo.Users SET PhoneNumber_Verified = true WHERE PhoneNumber_Verified = false AND PhoneNumber = @PhoneNumber';
  }

  connection.on('debug', function(text) {
    console.log(text);
  }).on('errorMessage', function(text) {
    console.log(JSON.stringify(text, null, 2));
  }).on('infoMessage', function(text) {
    console.log(JSON.stringify(text, null, 2));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);

    const request = new Request(query, function (err, rows) {
      if (err) return callback(err);
      // console.log('rows: ' + rows);
      callback(null, rows > 0);
    });

    if (email) {
      request.addParameter('Email', TYPES.VarChar, email);
    } else if (phone_number) {
      request.addParameter('PhoneNumber', TYPES.VarChar, email);
    }

    connection.execSql(request);
  });
}`;

const basic_auth = `module.exports = function verify({ id, username, phone_number, email }, callback) {
  const request = require('request');

  request.put({
    url: 'https://localhost/users',
    json: { username: username }
    //for more options check:
    //https://github.com/mikeal/request#requestoptions-callback
  }, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode === 401) return callback();

    callback(null, body);
  });
}`;

const mvc3 = `module.exports = function verify({ id, username, phone_number, email }, callback) {
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
      encrypt: true,
      // Required to retrieve userId needed for Membership entity creation
      rowCollectionOnRequestCompletion: true
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

    verifyMembershipUser(username, function(err, wasUpdated) {
      if (err) return callback(err); // this will return a 500

      callback(null, wasUpdated);
    });
  });

  function verifyMembershipUser(username, callback) {
    // isApproved field is the username verification flag
    const updateMembership =
      'UPDATE Memberships SET isApproved = \'true\' ' +
      'WHERE isApproved = \'false\' AND Username = @Username';

    const updateMembershipQuery = new Request(updateMembership, function(err, rowCount) {
      if (err) {
        return callback(err);
      }
      callback(null, rowCount > 0);
    });

    updateMembershipQuery.addParameter('Username', TYPES.VarChar, username);

    connection.execSql(updateMembershipQuery);
  }
}`;

const mvc4 = `module.exports = function verify ({ id, username, phone_number, email }, callback) {
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
      encrypt: true,
      // Required to retrieve userId needed for Membership entity creation
      rowCollectionOnRequestCompletion: true
    }
  });

  connection.on('debug', function(text) {
    // if you have connection issues, uncomment this to get more detailed info
    //console.log(text);
  }).on('errorMessage', function(text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);
    verifyMembershipUser(username, function(err, wasUpdated) {
      if (err) return callback(err); // this will return a 500

      callback(null, wasUpdated);
    });
  });

  function findUserId(username, callback) {
    const findUserIdFromUsername =
      'SELECT UserProfile.UserId FROM ' +
      'UserProfile INNER JOIN webpages_Membership ' +
      'ON UserProfile.UserId = webpages_Membership.UserId ' +
      'WHERE UserName = @Username';

    const findUserIdFromUsernameQuery = new Request(findUserIdFromUsername, function (err, rowCount, rows) {
      if (err || rowCount < 1) return callback(err);

      const userId = rows[0][0].value;

      callback(null, userId);
    });

    findUserIdFromUsernameQuery.addParameter('Username', TYPES.VarChar, username);

    connection.execSql(findUserIdFromUsernameQuery);
  }

  function verifyMembershipUser(username, callback) {
    findUserId(username, function (err, userId) {
      if (err || !userId) return callback(err);

      // isConfirmed field is the username verification flag
      const updateMembership =
        'UPDATE webpages_Membership SET isConfirmed = \'true\' ' +
        'WHERE isConfirmed = \'false\' AND UserId = @UserId';

      const updateMembershipQuery = new Request(updateMembership, function (err, rowCount) {
        return callback(err, rowCount > 0);
      });

      updateMembershipQuery.addParameter('UserId', TYPES.VarChar, userId);

      connection.execSql(updateMembershipQuery);
    });
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
};