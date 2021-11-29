const mariadb = require('mariadb');
const sandbox = require('../sandbox/sandbox');

const pool = mariadb.createPool({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	connectionLimit: 5
})

var SANDBOXDB = '';
if (process.env.DB_SANDBOX.toLowerCase() === 'true') {
	SANDBOXDB = '_Sandbox';
}

var SANDBOX = false;
if (process.env.SANDBOX.toLowerCase() === 'true') {
	SANDBOX = true;
};

async function checkCategory(categoryID) {
	if (SANDBOX == false) {
		let conn;
		let responseMsg;
		try {
			conn = await pool.getConnection();

			let query = 'select * from Categories' + SANDBOXDB + ' where CATEGORY_ID=?;';

			let rows = await conn.query(query, [parseInt(categoryID)]);

			if(rows.length > 0) {
				responseMsg = true;
			}
			else {
				responseMsg = false;
			}
		} catch (err) {
			console.error(err);
			responseMsg = false;
			return err;
		} finally {
			if (conn) {
				conn.release();
				return responseMsg;
			} 
		}
	} else {
		responseMsg = await sandbox.sandboxCheckCategory(categoryID);
		return responseMsg;
	}
	
}

module.exports.checkCategory = checkCategory;