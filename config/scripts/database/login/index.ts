const mongodb = `module.exports = function login({ id, username, phone_number, email, password }, callback) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb').MongoClient;
  const client = new MongoClient('mongodb://user:pass@localhost');

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('db-name');
    const users = db.collection('users');

    users.findOne({ username }, function (err, user) {
      if (err || !user) {
        client.close();
        return callback(err || new WrongUsernameOrPasswordError(username));
      }

      bcrypt.compare(password, user.password, function (err, isValid) {
        client.close();

        if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(username));

        return callback(null, {
            user_id: user._id.toString(),
            nickname: user.nickname,
            username: user.username,
          });
      });
    });
  });
}`;

const mysql = `module.exports = function({ id, username, phone_number, email, password }, callback) {
  const mysql = require('mysql2');
  const bcrypt = require('bcrypt');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'mydb'
  });

  connection.connect();

  const query = 'SELECT id, nickname, username, password FROM users WHERE username = ?';
  
  connection.query(query, [ username ], function(err, results) {
    if (err) return callback(err);
    if (results.length === 0) return callback(new WrongUsernameOrPasswordError(username));
    const user = results[0];
  
    bcrypt.compare(password, user.password, function(err, isValid) {
      if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(username));
  
      callback(null, {
        user_id: user.id.toString(),
        nickname: user.nickname,
        username: user.username
      });
    });
  });
}`;

const postgre = `module.exports = function login({ id, username, phone_number, email, password }, callback) {
  //本示例使用 "pg" 库
  //more info here: https://github.com/brianc/node-postgres

  const bcrypt = require('bcrypt');
  const postgres = require('pg');

  const conString = 'postgres://user:pass@localhost/mydb';
  postgres.connect(conString, function (err, client, done) {
    if (err) return callback(err);

    const query = 'SELECT id, nickname, username, password FROM users WHERE username = $1';
    client.query(query, [username], function (err, result) {
      // NOTE: 一定要调用 \`done()\` 来关闭数据库连接
      done();

      if (err || result.rows.length === 0) return callback(err || new WrongUsernameOrPasswordError(username));

      const user = result.rows[0];

      bcrypt.compare(password, user.password, function (err, isValid) {
        if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(username));

        return callback(null, {
          user_id: user.id,
          nickname: user.nickname,
          username: user.username
        });
      });
    });
  });
}`;

const basic_auth = `module.exports = function login({ id, username, phone_number, email, password }, callback) {
  const request = require('request');

  request.get({
    url: 'https://localhost/profile',
    auth: {
      username: username,
      password: password
    }
    //更多选项请查看:
    //https://github.com/mikeal/request#requestoptions-callback
  }, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode === 401) return callback();
    const user = JSON.parse(body);

    callback(null, {
      user_id: user.user_id.toString(),
      nickname: user.nickname,
      username: user.username
    });
  });
}`;

const sqlserver = `module.exports = function login({ id, username, phone_number, email, password }, callback) {
  //该示例使用 "tedious" 库
  //更多信息请参考: http://pekim.github.io/tedious/index.html
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

  const query = 'SELECT Id, Nickname, Username, Password FROM dbo.Users WHERE Username = @Username';

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
      if (err || rowCount < 1) return callback(err || new WrongUsernameOrPasswordError(username));

      bcrypt.compare(password, rows[0][3].value, function (err, isValid) {
        if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(username));

        callback(null, {
          user_id: rows[0][0].value,
          nickname: rows[0][1].value,
          username: rows[0][2].value
        });
      });
    });

    request.addParameter('Username', TYPES.VarChar, username);
    connection.execSql(request);
  });
}`;

const mvc3 = `module.exports = function login({ id, username, phone_number, email, password }, callback) {
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
      encrypt: true // for Windows Azure
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

    getMembershipUser(email, function(err, user) {
      if (err || !user || !user.profile || !user.password) return callback(err || new WrongUsernameOrPasswordError(email));

      const salt = Buffer.from(user.password.salt, 'base64');

      if (hashPassword(password, salt).toString('base64') !== user.password.password) {
        return callback(new WrongUsernameOrPasswordError(email));
      }

      callback(null, user.profile);
    });
  });


  // Membership Provider implementation used on Microsoft.AspNet.Providers NuGet

  /**
   * getMembershipUser
   *
   * This function gets a username or email and returns a the user membership provider
   * info, password hashes and salt
   *
   * @usernameOrEmail  {[string]}       the username or email, the method will do a
   *                                    query on both with an OR
   *
   * @callback         {[Function]}     first argument will be the Error if any,
   *                                    and second argument will be a user object
   */
  function getMembershipUser(usernameOrEmail, done) {
    var user = null;
    const query =
      'SELECT Memberships.UserId, Email, Users.UserName, Password ' +
      'FROM Memberships INNER JOIN Users ' +
      'ON Users.UserId = Memberships.UserId ' +
      'WHERE Memberships.Email = @Username OR Users.UserName = @Username';

    const getMembershipQuery = new Request(query, function(err, rowCount) {
      if (err || rowCount < 1) return done(err);

      done(err, user);
    });

    getMembershipQuery.addParameter('Username', TYPES.VarChar, usernameOrEmail);

    getMembershipQuery.on('row', function(fields) {
      user = {
        profile: {
          user_id: fields.UserId.value,
          nickname: fields.UserName.value,
          email: fields.Email.value,
        },
        password: {
          password: fields.Password.value,
          salt: fields.PasswordSalt.value
        }
      };
    });

    connection.execSql(getMembershipQuery);
  }
}`;

const mvc4 = `module.exports = function login({ id, username, phone_number, email, password }, callback) {
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
      encrypt: true // for Windows Azure
    }
  });

  function fixedTimeComparison(a, b) {
    var mismatch = (a.length === b.length ? 0 : 1);
    if (mismatch) {
      b = a;
    }

    for (var i = 0, il = a.length; i < il; ++i) {
      const ac = a.charCodeAt(i);
      const bc = b.charCodeAt(i);
      mismatch += (ac === bc ? 0 : 1);
    }

    return (mismatch === 0);
  }


  /**
   * validatePassword
   *
   * This function gets the password entered by the user, and the original password
   * hash and salt from database and performs an HMAC SHA256 hash.
   *
   * @password      {[string]}      the password entered by the user
   * @originalHash  {[string]}      the original password hashed from the database
   *                                (including the salt).
   * @return        {[bool]}        true if password validates
   */
  function validatePassword(password, originalHash, callback) {
    const iterations = 1000;
    const hashBytes = Buffer.from(originalHash, 'base64');
    const salt = hashBytes.slice(1, 17);
    const hash = hashBytes.slice(17, 49);
    crypto.pbkdf2(password, salt, iterations, hash.length, 'sha1', function(err, hashed) {
      if (err) return callback(err);

      const hashedBase64 = Buffer.from(hashed, 'binary').toString('base64');
      const isValid = fixedTimeComparison(hash.toString('base64'), hashedBase64);

      return callback(null, isValid);
    });
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
    getMembershipUser(email, function(err, user) {
      if (err || !user || !user.profile) return callback(err || new WrongUsernameOrPasswordError(email));

      validatePassword(password, user.password, function(err, isValid) {
        if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(email));

        callback(null, user.profile);
      });
    });
  });


  // Membership Provider implementation used on Microsoft.AspNet.Providers NuGet

  /**
   * getMembershipUser
   *
   * This function gets a username or email and returns a user info, password hashes and salt
   *
   * @usernameOrEamil   {[string]}    the username or email, the method will do a query
   *                                  on both with an OR
   * @callback          {[Function]}  first argument will be the Error if any, and second
   *                                  argument will be a user object
   */
  function getMembershipUser(usernameOrEmail, done) {
    var user = null;
    const query =
      'SELECT webpages_Membership.UserId, UserName, UserProfile.UserName, Password from webpages_Membership ' +
      'INNER JOIN UserProfile ON UserProfile.UserId = webpages_Membership.UserId ' +
      'WHERE UserProfile.UserName = @Username';

    const getMembershipQuery = new Request(query, function(err, rowCount) {
      if (err || rowCount < 1) return done(err);

      done(err, user);
    });

    getMembershipQuery.addParameter('Username', TYPES.VarChar, usernameOrEmail);

    getMembershipQuery.on('row', function(fields) {
      user = {
        profile: {
          user_id: fields.UserId.value,
          nickname: fields.UserName.value,
          email: fields.UserName.value,
        },
        password: fields.Password.value
      };
    });

    connection.execSql(getMembershipQuery);
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