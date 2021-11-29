const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const sandbox = require('../sandbox/sandbox');

var PRODUCTION = false;
if (process.env.PRODUCTION.toLowerCase() === 'true') {
	PRODUCTION = true;
};

async function sendBadboj(req, errandId, category) {
	console.log("Anropar sendBadboj");

	if (PRODUCTION == true) {
		let cat = "Livboj";
		let phoneNr = "";
		let email = "";
		let contactMethod = "";
		let coordinateX;
		let coordinateY;

		if (category != 15) {
			cat = "Livbåt";
		}

		if (req.body.phoneNumber != undefined) {
			phoneNr = req.body.phoneNumber;
		} 	

		if (req.body.email != undefined) {
			email = req.body.email;
		}

		if (req.body.contactMethod != undefined) {
			contactMethod = req.body.contactMethod;
		}

		coordinateX = parseFloat(req.body.mapCoordinates.split(",")[0]);
		coordinateY = parseFloat(req.body.mapCoordinates.split(",")[1]);
		
		let ISYCaseObj = {
			"source":{
				"type":"Property",
				"value":errandId
			},
			"personalnumber":{
				"type":"Property",
				"value":123
			},
			"name":{
				"type":"Property",
				"value":"Errand Sundsvall"
			},
			"address":{
				"type":"Property",
				"value":"Errand Sundsvall"
			},
			"phonenumber":{
				"type":"Property",
				"value":phoneNr
			},
			"contactmethod":{
				"type":"Property",
				"value":contactMethod
			},
			"email":{
				"type":"Property",
				"value":email
			},
			"category":{
				"type":"Property",
				"value":cat
			},
			"description":{
				"type":"Property",
				"value":req.body.description
			},
			"location":{
				"type":"GeoProperty",
				"value":{
					"type":"Point",
					"coordinates":[
						coordinateX,
						coordinateY
					]
				}
			}
		}

		console.log(ISYCaseObj);

		let resMsg = "error";

		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		var urlencoded = new URLSearchParams();
		urlencoded.append("apiKey", process.env.ISYCASE_API_KEY);
		urlencoded.append("errandJsonString", JSON.stringify(ISYCaseObj));

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
			redirect: 'follow'
		};

		let response = await fetch(process.env.ISYCASE_URL, requestOptions)
		if (response.ok)
		{
			resMsg = await response.json();
		} else {
			let errorMsg = await response.text();
			console.error(errorMsg);
		}
		
		return resMsg;

	} else {
		let resMsg = await sandbox.sandboxBadboj();
		return resMsg;
	}
}

module.exports.sendBadboj = sendBadboj;