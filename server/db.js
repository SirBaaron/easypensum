var mysql = require('mysql');
const environment = require("./environment.js");


var pool  = mysql.createPool({
	connectionLimit : 20,
	host: environment.mysql_host,
	user: environment.mysql_user,
	password: environment.mysql_password,
	database: environment.mysql_db,
	dateStrings: true
});

module.exports = {
	query: (query, values = []) => {
		return new Promise((resolve, reject) => {
			pool.query(query, values, (err, res) => {
				if(err) {
					reject(err);
				}
				else {
					resolve(res);
				}
			});
		});
	}
}