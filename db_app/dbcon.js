var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_domingte',
  password        : '6580',
  database        : 'cs340_domingte'
});
module.exports.pool = pool;
