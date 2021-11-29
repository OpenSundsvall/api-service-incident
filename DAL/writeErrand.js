const mariadb = require('mariadb');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const postLifeBouy = require('../APIfunctions/postLifeBouy');
const sendEmail = require('../utils/sendEmail');
const checkCord = require('../utils/checkCoordinates');

const pool = mariadb.createPool({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	connectionLimit: 5
});

var SANDBOXDB = '';
if (process.env.DB_SANDBOX.toLowerCase() === 'true') {
	SANDBOXDB = '_Sandbox';
}

var PRODUCTION = false;
if (process.env.PRODUCTION.toLowerCase() === 'true') {
	PRODUCTION = true;
};

async function writeErrandToDB(req) {

	let resErrand;
	let resErrandMsg;
	let conn;
	let incidentId = uuidv4();
	let personId = null;
	let phoneNr = null;
	let email = null;
	let contactMethod = null;
	let mapCoordinates = null;
	let externalCaseId = null;
	var attachmentList = [];

	if (req.body.personId != undefined && req.body.personId != "")
	{
		personId = req.body.personId;
	}

	if (req.body.phoneNumber != undefined && req.body.phoneNumber != "")
	{
		phoneNr = req.body.phoneNumber;
	}

	if (req.body.email != undefined && req.body.email != "")
	{
		email = req.body.email;
	}

	if (req.body.contactMethod != undefined && req.body.contactMethod != "")
	{
		contactMethod = req.body.contactMethod;
	}

	if (req.body.mapCoordinates != undefined && req.body.mapCoordinates != "")
	{
		mapCoordinates = req.body.mapCoordinates;
	}

	if (req.body.externalCaseId != undefined && req.body.externalCaseId != "")
	{
		externalCaseId = req.body.externalCaseId;
	}

	try {
		
		conn = await pool.getConnection();	

		if (req.body.category == 15 || req.body.category == 16) {
			let coordinatesOK = false;
			if (req.body.mapCoordinates != undefined) {
				coordinatesOK = await checkCord.checkCoordinates(req.body.mapCoordinates);
			}	
			if (coordinatesOK) {
				let badBojRes = await postLifeBouy.sendBadboj(req, incidentId, req.body.category);
				if (badBojRes != "error") {
					externalCaseId = badBojRes;
				} else {
					resErrandMsg = {
						"status":"error",
						"type":500,
						"response": {
							"status":"error", 
							"message":"Fel vid anrop till extern tjänst"
						}						
					};
					console.log("Fel vid anrop till ISYCase");
					return resErrandMsg;
				}
			} else {
				resErrandMsg = {
					"status":"error",
					"type":400,
					"response": {
						"status":"error", 
						"message":"Koordinater saknas eller är felaktigt formaterade"
					}
				};
				console.log("Fekaktiga koordinater");
				return resErrandMsg;
			}
			
		}

		if (req.body.attachments != undefined && req.body.attachments != null) {
			req.body.attachments.forEach(async (attachment) => {
				let resMsg;
				let category = null;
				let note = null;
	
				if (attachment.category != undefined && attachment.category != "")
				{
					category = attachment.category;
				}
	
				if (attachment.note != undefined && attachment.note != "")
				{
					note = attachment.note;
				}
	
				var attachmentObj = [
					category,				
					attachment.extension,
					attachment.mimeType,
					note,
					Buffer.from(attachment.file.split("base64,")[1], 'base64'),
					incidentId,
					crypto.randomBytes(18).toString('hex')
				];
	
				var attachmentForEmail = {
					filename: attachmentObj[6] + "." + attachmentObj[1],
					content: attachmentObj[4]
				}
	
				attachmentList.push(attachmentForEmail);
	
				let attachmentQuery = 'INSERT INTO Attachments' + SANDBOXDB + ' (category, extension, mimetype, note, file, IncidentId, name) VALUES (?,?,?,?,?,?,?)';
	
				resMsg = await conn.query(attachmentQuery, attachmentObj);
				if (resMsg.affectedRows < 1) {
					console.log("Error for Attachments" + incidentId);
				}
			})
		}
		
		var errandObj = [
			incidentId,
			personId,
			phoneNr,
			email,
			contactMethod,
			parseInt(req.body.category),
			req.body.description,
			mapCoordinates,
			1,
			externalCaseId
		];

		let errandQuery = 'INSERT INTO Errands' + SANDBOXDB + ' (IncidentId, PersonId, PhoneNumber, Email, ContactMethod, Category, Description, MapCoordinates, Status, externalCaseId) VALUES (?,?,?,?,?,?,?,?,?,?)';

		resErrand = await conn.query(errandQuery, errandObj);
		if (resErrand.affectedRows == 1) {
			resErrandMsg = {
				"status":"OK",
				"type":200,
				"response": {
					"status":"OK", 
					"incidentId":incidentId
				}
				
			};
		}

		if (PRODUCTION == true) {
			sendEmail.sendEmail(errandObj, errandObj[0], attachmentList).catch(console.error);
		}		
		
	} catch (err) {
		console.error(err);
		return {
			"status":"error", 
			"type":500,
			"response": {
				"status":"error",
				"error":err
			}
			
		};
	} finally {
		if (conn) {
			conn.release();
			return resErrandMsg;
		}
	}	
}

async function updateErrand(req) {
	try{
		conn = await pool.getConnection();
		let errandQuery = `SELECT * FROM Errands${SANDBOXDB} WHERE IncidentId=?;`
		let errandResponse = await conn.query(errandQuery, [req.params.id]);
		if (errandResponse.length > 0) {
			let statusQuery = `SELECT * FROM Status WHERE STATUS_ID=?;`
			let statusResponse = await conn.query(statusQuery, [parseInt(req.body.status)]);
			if (statusResponse.length > 0) {
				let alterQuery = `
					UPDATE Errands${SANDBOXDB}
					SET Status = ?, Updated = CURRENT_TIMESTAMP()
					WHERE IncidentId = ?;
				`;
		
				let resErrand = await conn.query(alterQuery, [parseInt(req.body.status), req.params.id]);
				return {"status":"OK", "code":200,"message":"Ärende uppdaterat"};
			}
			else {
				return {"status":"error", "code":400, "message":"Felaktig status"};
			}
		}
		else {
			return {"status":"error", "code":400, "message":"Ärende finns inte"};
		}
	} catch (err) {
		console.error(err);
		return {"status":"error", "code":500, "message":"Ett internt fel uppstod"};
	} finally {
		if (conn) {
			conn.release();
		}
	}
}

async function updateIncidentFeedback(req) {
	try {
		conn = await pool.getConnection();

		let alterQuery = `
			UPDATE Errands${SANDBOXDB}
			SET Feedback = ?, Updated = CURRENT_TIMESTAMP()
			WHERE ERRAND_ID = ?;
		`;

		resErrand = await conn.query(alterQuery, [req.query.feedback, parseInt(req.query.errandid)]);
		return {"status":"OK", "code":200,"message":"Ärende uppdaterat"};
	} catch (err) {
		console.error(err);
		return {"status":"error", "code":500, "message":"Ett internt fel uppstod"};
	} finally {
		if (conn) {
			conn.release();
		}
	}
}

module.exports.writeErrandToDB = writeErrandToDB;
module.exports.updateErrand = updateErrand;
module.exports.updateIncidentFeedback = updateIncidentFeedback;