const mysql = `module.exports = function create(user, callback) {
  const mysql = require('mysql2');
  const bcrypt = require('bcrypt');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'mydb'
  });

  connection.connect();

  const query = 'INSERT INTO users SET ?';

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) return callback(err);

    const insert = {
      password: hash,
      username: user.username
    };

    connection.query(query, insert, function(err, results) {
      if (err) return callback(err);
      if (results.length === 0) return callback();
      callback(null);
    });
  });
}`;

const mongodb = `module.exports = function create(user, callback) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient('mongodb://user:pass@localhost');

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('db-name');
    const users = db.collection('users');

    users.findOne({ username: user.username }, function (err, withSameUsername) {
      if (err || withSameUsername) {
        client.close();
        return callback(err || new Error('the user already exists'));
      }

      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
          client.close();
          return callback(err);
        }

        user.password = hash;
        users.insert(user, function (err, inserted) {
          client.close();

          if (err) return callback(err);
          callback(null);
        });
      });
    });
  });
}`;

const postgre = `module.exports = function create(user, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  const bcrypt = require('bcrypt');
  const postgres = require('pg');

  const conString = 'postgres://user:pass@localhost/mydb';
  postgres.connect(conString, function (err, client, done) {
    if (err) return callback(err);

    bcrypt.hash(user.password, 10, function (err, hashedPassword) {
      if (err) return callback(err);

      const query = 'INSERT INTO users(username, password) VALUES ($1, $2)';
      client.query(query, [user.username, hashedPassword], function (err, result) {
        // NOTE: always call \`done()\` here to close
        // the connection to the database
        done();

        return callback(err);
      });
    });
  });
}`;

const sqlserver = `module.exports = function create(user, callback) {
  //this example uses the "tedious" library
  //more info here: http://pekim.github.io/tedious/index.html
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

  const query = 'INSERT INTO dbo.Users SET Username = @Username, Password = @Password';

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
      callback(null);
    });

    bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) return callback(err);
      request.addParameter('Username', TYPES.VarChar, user.username);
      request.addParameter('Password', TYPES.VarChar, hash);
      connection.execSql(request);
    });
  });
}`;

const basic_auth = `module.exports = function create(user, callback) {
  const request = require('request');

  request.post({
    url: 'https://localhost/users',
    json: user
    //for more options check:
    //https://github.com/mikeal/request#requestoptions-callback
  }, function(err, response, body) {
    if (err) return callback(err);

    callback(null);
  });
}`;

const mvc3 = `module.exports = function create(user, callback) {
  const crypto = require('crypto');
  const sqlserver = require('tedious@1.11.0');

  const Connection = sqlserver.Connection;
  const Request = sqlserver.Request;
  const TYPES = sqlserver.TYPES;

  const connection = new Connection({
    userName: 'username',
    password: 'password',
    server: 'server',
    options: {
      database: 'the db name',
      encrypt: true,
      // Required to retrieve userId needed for Membership entity creation
      rowCollectionOnRequestCompletion: true
    }
  });

  const applicationId = 'your-application-id-goes-here';

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
    // console.log(text);
  }).on('errorMessage', function(text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function(err) {
    if (err) {
      return callback(err);
    }
    createMembershipUser(user, function(err, user) {
      if (err) return callback(err); // this will return a 500
      if (!user) return callback(); // this will return a 401

      callback(null, user);
    });
  });

  function createMembershipUser(user, callback) {
    const userData = {
      UserName: user.username,
      ApplicationId: applicationId
    };
    const createUser =
      'INSERT INTO Users (UserName, LastActivityDate, ApplicationId, UserId, IsAnonymous) ' +
      'OUTPUT Inserted.UserId ' +
      'VALUES (@UserName, GETDATE(), @ApplicationId, NEWID(), \'false\')';

    const createUserQuery = new Request(createUser, function(err, rowCount, rows) {
      if (err) return callback(err);

      // No records added
      if (rowCount === 0) return callback(null);

      const userId = rows[0][0].value;
      const salt = crypto.randomBytes(16);
      const membershipData = {
        ApplicationId: applicationId,
        Username: user.username,
        Password: hashPassword(user.password, salt),
        PasswordSalt: salt.toString('base64'),
        UserId: userId
      };

      const createMembership =
        'INSERT INTO Memberships (ApplicationId, UserId, Password, PasswordFormat, ' +
        'PasswordSalt, Username, isApproved, isLockedOut, CreateDate, LastLoginDate, ' +
        'LastPasswordChangedDate, LastLockoutDate, FailedPasswordAttemptCount, ' +
        'FailedPasswordAttemptWindowStart, FailedPasswordAnswerAttemptCount, ' +
        'FailedPasswordAnswerAttemptWindowsStart) ' +
        'VALUES ' +
        '(@ApplicationId, @UserId, @Password, 1, @PasswordSalt, ' +
        '@Username, \'false\', \'false\', GETDATE(), GETDATE(), GETDATE(), GETDATE(), 0, 0, 0, 0)';

      const createMembershipQuery = new Request(createMembership, function(err, rowCount) {
        if (err) return callback(err);

        if (rowCount === 0) return callback(null);

        callback(null, rowCount > 0);
      });

      createMembershipQuery.addParameter('ApplicationId', TYPES.VarChar, membershipData.ApplicationId);
      createMembershipQuery.addParameter('Username', TYPES.VarChar, membershipData.Username);
      createMembershipQuery.addParameter('Password', TYPES.VarChar, membershipData.Password);
      createMembershipQuery.addParameter('PasswordSalt', TYPES.VarChar, membershipData.PasswordSalt);
      createMembershipQuery.addParameter('UserId', TYPES.VarChar, membershipData.UserId);

      connection.execSql(createMembershipQuery);
    });

    createUserQuery.addParameter('UserName', TYPES.VarChar, userData.UserName);
    createUserQuery.addParameter('ApplicationId', TYPES.VarChar, userData.ApplicationId);

    connection.execSql(createUserQuery);
  }
}`;

const mvc4 = `module.exports = function create(user, callback) {
  const crypto = require('crypto');
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
    // console.log(text);
  }).on('errorMessage', function (text) {
    // this will show any errors when connecting to the SQL database or with the SQL statements
    console.log(JSON.stringify(text));
  });

  connection.on('connect', function (err) {
    if (err) return callback(err);

    const createUser =
      'INSERT INTO UserProfile (UserName) ' +
      'OUTPUT Inserted.UserId ' +
      'VALUES (@UserName)';

    const createUserQuery = new Request(createUser, function (err, rowCount, rows) {
      if (err || rowCount === 0) return callback(err);

      const userId = rows[0][0].value;
      const salt = crypto.randomBytes(16);

      const createMembership =
        'INSERT INTO webpages_Membership ' +
        '(UserId, CreateDate, IsConfirmed, PasswordFailuresSinceLastSuccess, Password, PasswordSalt) ' +
        'VALUES ' +
        '(@UserId, GETDATE(), \'false\', 0, @Password, \'\')';

      const createMembershipQuery = new Request(createMembership, function (err, rowCount) {
        if (err || rowCount === 0) return callback(err);

        callback(null, rowCount > 0);
      });

      hashPassword(user.password, salt, function (err, hashedPassword) {
        if (err) return callback(err);
        createMembershipQuery.addParameter('Password', TYPES.VarChar, hashedPassword);
        createMembershipQuery.addParameter('PasswordSalt', TYPES.VarChar, salt.toString('base64'));
        createMembershipQuery.addParameter('UserId', TYPES.VarChar, userId);

        connection.execSql(createMembershipQuery);
      });
    });

    createUserQuery.addParameter('UserName', TYPES.VarChar, user.username);

    connection.execSql(createUserQuery);
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