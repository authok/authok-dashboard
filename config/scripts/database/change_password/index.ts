const mongodb = `module.exports = function changePassword({ id, username, email, phone_number }, newPassword, callback) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient('mongodb://user:pass@localhost');

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('db-name');
    const users = db.collection('users');

    bcrypt.hash(newPassword, 10, function (err, hash) {
      if (err) {
        client.close();
        return callback(err);
      }

      users.update({ username, }, { $set: { password: hash } }, function (err, count) {
        client.close();
        if (err) return callback(err);
        callback(null, count > 0);
      });
    });
  });
}`;

const mysql = `module.exports = function changePassword({ id, username, email, phone_number }, newPassword, callback) {
  const mysql = require('mysql2');
  const bcrypt = require('bcrypt');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'mydb'
  });

  connection.connect();

  const query = 'UPDATE users SET password = ? WHERE username = ?';

  bcrypt.hash(newPassword, 10, function(err, hash) {
    if (err) return callback(err);

    connection.query(query, [ hash, username ], function(err, results) {
      if (err) return callback(err);
      callback(null, results.length > 0);
    });
  });
}`;

const postgre = `module.exports = function changePassword ({ id, username, email, phone_number }, newPassword, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  const bcrypt = require('bcrypt');
  const postgres = require('pg');

  const conString = 'postgres://user:pass@localhost/mydb';
  postgres.connect(conString, function (err, client, done) {
    if (err) return callback(err);

    bcrypt.hash(newPassword, 10, function (err, hash) {
      if (err) return callback(err);

      const query = 'UPDATE users SET password = $1 WHERE username = $2';
      client.query(query, [hash, username], function (err, result) {
        // NOTE: always call \`done()\` here to close
        // the connection to the database
        done();

        return callback(err, result && result.rowCount > 0);
      });
    });
  });
}`;

const sqlserver = `module.exports = function changePassword ({ id, username, email, phone_number }, newPassword, callback) {
  //this example uses the "tedious" library
  //more info here: http://tediousjs.github.io/tedious/
  const bcrypt = require('bcrypt');
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

  const query = 'UPDATE dbo.Users SET Password = @NewPassword WHERE ' Username = @Username';

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

    bcrypt.hash(newPassword, 10, function (err, hash) {
      if (err) return callback(err);
      request.addParameter('NewPassword', TYPES.VarChar, hash);
      request.addParameter('Username', TYPES.VarChar, username);
      connection.execSql(request);
    });
  });
}`;

const basic_auth = `module.exports = function changePassword({ id, username, email, phone_number }, newPassword, callback) {
  const request = require('request');

  request.put({
    url: 'https://localhost/users',
    { password: newPassword, username },
    //for more options check:
    //https://github.com/mikeal/request#requestoptions-callback
  }, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode === 401) return callback();
    callback(null, body);
  });
}`;

const mvc3 = `module.exports = function changePassword({ id, username, email, phone_number }, newPassword, callback) {
  const crypto = require('crypto');
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
      // encrypt: true for Windows Azure enable this
    }
  });

  /**
   * hashPassword
   *
   * This function creates a hashed version of the password to store in the database.
   *
   * @password  {[string]}      the password entered by the user
   * @return    {[string]}      the hashed password
   */
  function hashPassword(password, salt) {
    // the default implementation uses HMACSHA256 and since Key length is 64
    // and default salt is 16 bytes, Membership will fill the buffer repeating the salt
    const key = Buffer.concat([salt, salt, salt, salt]);
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(Buffer.from(password, 'ucs2'));

    return hmac.digest('base64');
  }

  connection.on('debug', function(text) {
    // if you have connection issues, uncomment this to get more detailed info
    //console.log(text);
  }).on('errorMessage', function(text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function(err) {
    if (err) return callback(err);

    updateMembershipUser(username, newPassword, function(err, wasUpdated) {
      if (err) return callback(err); // this will return a 500

      callback(null, wasUpdated);
    });
  });

  function updateMembershipUser(username, newPassword, callback) {
    const salt = crypto.randomBytes(16);
    const hashedPassword = hashPassword(newPassword, salt);
    const updateMembership =
      'UPDATE Memberships ' +
      'SET Password=@NewPassword, PasswordSalt=@NewSalt, LastPasswordChangedDate=GETDATE() ' +
      'WHERE Username =@Username';

    const updateMembershipQuery = new Request(updateMembership, function(membershipErr, membershipCount) {
      if (membershipErr) return callback(membershipErr);

      callback(null, membershipCount > 0);
    });

    updateMembershipQuery.addParameter('NewPassword', TYPES.VarChar, hashedPassword);
    updateMembershipQuery.addParameter('NewSalt', TYPES.VarChar, salt);
    updateMembershipQuery.addParameter('Username', TYPES.VarChar, username);

    connection.execSql(updateMembershipQuery);
  }
}`;

const mvc4 = `module.exports = function changePassword({ id, username, email, phone_number }, newPassword, callback) {
  const crypto = require('crypto');
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
      // encrypt: true for Windows Azure enable this
    }
  });

  /**
   * hashPassword
   *
   * This function hashes a password using HMAC SHA256 algorythm.
   *
   * @password    {[string]}    password to be hased
   * @salt        {[string]}    salt to be used in the hashing process
   * @callback    {[function]}  callback to be called after hashing the password
   */
  function hashPassword(password, salt, callback) {
    const iterations = 1000;
    const passwordHashLength = 32;

    crypto.pbkdf2(password, salt, iterations, passwordHashLength, 'sha1', function (err, hashed) {
      if (err) return callback(err);

      const result = Buffer.concat([Buffer.from([0], 1), salt, Buffer.from(hashed, 'binary')]);
      const resultBase64 = result.toString('base64');

      callback(null, resultBase64);
    });
  }

  connection.on('debug', function (text) {
    // if you have connection issues, uncomment this to get more detailed info
    //console.log(text);
  }).on('errorMessage', function (text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);

    updateMembershipUser(username, newPassword, function (err, wasUpdated) {
      if (err) return callback(err); // this will return a 500

      callback(null, wasUpdated);
    });
  });

  function findUserId(username, callback) {
    const findUserIdFromIdentifier =
      'SELECT UserProfile.UserId FROM ' +
      'UserProfile INNER JOIN webpages_Membership ' +
      'ON UserProfile.UserId=webpages_Membership.UserId ' +
      'WHERE Username=@Username';

    const findUserIdFromUsernameQuery = new Request(findUserIdFromUsername, function (err, rowCount, rows) {
      if (err || rowCount < 1) return callback(err);

      const userId = rows[0][0].value;

      callback(null, userId);
    });

    findUserIdFromUsernameQuery.addParameter('Username', TYPES.VarChar, username);

    connection.execSql(findUserIdFromUsernameQuery);
  }

  function updateMembershipUser(username, newPassword, callback) {
    findUserId(username, function (err, userId) {
      if (err || !userId) return callback(err);

      const salt = crypto.randomBytes(16);

      const updateMembership =
        'UPDATE webpages_Membership ' +
        'SET Password=@NewPassword, PasswordChangedDate=GETDATE() ' +
        'WHERE UserId=@UserId';

      const updateMembershipQuery = new Request(updateMembership, function (err, rowCount) {
        callback(err, rowCount > 0);
      });

      hashPassword(newPassword, salt, function (err, hashedPassword) {
        if (err) return callback(err);

        updateMembershipQuery.addParameter('NewPassword', TYPES.VarChar, hashedPassword);
        updateMembershipQuery.addParameter('UserId', TYPES.VarChar, userId);

        connection.execSql(updateMembershipQuery);
      });
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
}