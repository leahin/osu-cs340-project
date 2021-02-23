var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_(your osu user name)',
  password        : '(the last 4 digits of your student onid)',
  database        : 'cs340_(your osu user name)'
});
module.exports.pool = pool;
