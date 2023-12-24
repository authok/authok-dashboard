export default `module.exports = function verify({ id, username, email, phone_number }, callback) {
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