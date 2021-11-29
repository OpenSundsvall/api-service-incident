require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sandbox = require('./sandbox/sandbox');
const { response } = require('express');
const { body, validationResult } = require('express-validator');
const json = require('body-parser/lib/types/json');

const dbReader = require('./DAL/dbReader');
const writeErrand = require('./DAL/writeErrand');
const checkCategory = require('./DAL/checkCategory');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const port = '3002';



var SANDBOX = false;
if (process.env.SANDBOX.toLowerCase() === 'true') {
	SANDBOX = true;
};

var endpointURI = process.env.ENDPOINT_URI;
console.log(endpointURI);



app.get('/', function (req, res) {
	res.sendStatus(200);
});

app.get(endpointURI + '/hello', function (req, res) {
	console.log("Anropar hello");
	res.send('Hello World from incident!');  
});

app.get(endpointURI + '/validstatuses', async (req, res) => {
	console.log("Anropar validstatuses");
	if (SANDBOX == false) {
		let statusRes = await dbReader.getValidStatuses();
		res.send(statusRes);
	} else {
		console.log('sandbox');
		let sandboxRes = await sandbox.sandboxValidstatuses();
		res.send(sandboxRes);
	}	
});

app.get(endpointURI + '/validcategories', async (req, res) => {
	console.log("Anropar validcategories");
	if (SANDBOX == false) {
		let categoryRes = await dbReader.getValidCategories();
		res.send(categoryRes);
	} else {
		console.log('sandbox');
		let sandboxRes = await sandbox.sandboxValidcategories();
		res.send(sandboxRes);
	}	
});

app.get(endpointURI + '/validcategories/oep', async (req, res) => {
	console.log("Anropar validcategories/oep");
	if (SANDBOX == false) {
		let categoryRes = await dbReader.getValidCategoriesOeP();
		res.send(categoryRes); 
	} else {
		console.log('sandbox');
		let sandboxRes = await sandbox.sandboxValidcategoriesOEP();
		res.send(sandboxRes);
	}
	
});

app.post(
	endpointURI + '/sendincident',
	body('category')
		.isInt()
		.withMessage("category måste vara en siffra"),
	async (req, res) => {
		console.log("Anropar sendincident");
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("Felaktig body");
			return res.status(400).send({ "status": "error", "errors": errors.array() });
		}
		
		var categoryOK = await checkCategory.checkCategory(parseInt(req.body.category));
		if (categoryOK){
			if (SANDBOX == false) {
				wtbRes = await writeErrand.writeErrandToDB(req);
				if (wtbRes.status != "error") {
					res.send(wtbRes.response);
				} else {
					console.error(JSON.stringify(wtbRes));
					console.error(JSON.stringify(req.body));
					res.status(wtbRes.type).send(wtbRes.response);
				}
			} else {
				console.log('sandbox');
				let resErrandMsg = await sandbox.sandboxSendincident(req.body.category);
				if (resErrandMsg.status != "error") {
					res.send(resErrandMsg);
				} else {
					res.status(500).send(resErrandMsg);
				}				
			}	
		}
		else {
			res.status(400).send({"status":"error", "message":"Felaktig kategori"});
		}	
});

app.patch(endpointURI + '/:id/status',
	body('status')
		.isInt()
		.withMessage("Status måste anges som en siffra"),
	async (req, res) => {
		console.log("Anropar status");
		if (SANDBOX == false) {
			let response = await writeErrand.updateErrand(req);
			if (response.status == "OK") {
				res.sendStatus(200);
			} else {
				res.status(response.code).send(response);
			}
		} else {
			console.log('sandbox');
			res.sendStatus(200);
		}
	
});

app.get(endpointURI + '/setincidentfeedback', async (req, res) => {
	console.log("Anropar setincidentfeedback");
	if (SANDBOX == false) {
		let updatedErrand = await writeErrand.updateIncidentFeedback(req);
		if (updatedErrand.status == "OK") {
			res.sendStatus(200);
		} else {
			res.status(updatedErrand.code).send(updatedErrand);
		}
	} else {
		console.log('sandbox');
		res.sendStatus(200);
	}
	
})

app.get(endpointURI + '/listincidents', async (req, res) => {
	console.log("Anropar listincidents");
	if (SANDBOX == false) {
		let incidentList = await dbReader.listIncidents(req);
		res.send(incidentList);
	} else {
		console.log('sandbox');
		let sandboxRes = await sandbox.sandboxListincidents();
		res.send(sandboxRes);
	}
	
})

app.get(endpointURI + '/getincident/:id', async (req, res) => {
	console.log("Anropar getincident");
	if (SANDBOX == false) {
		let incident = await dbReader.getIncident(req);
		if (incident.status != "error") {
			res.send(incident);
		} else {
			res.status(404).send(incident);
		}
	} else {
		console.log('sandbox');
		let sandboxRes = await sandbox.sandboxGetincident(req.params.id, req.query.attachments);
		res.send(sandboxRes)
	}
	
})

app.get(endpointURI + '/internal/oep/status/:id', async (req, res) => {
	console.log("Anropar internal status");
	if (SANDBOX == false) {
		let dbStatus = dbReader.getIncidentStatusOeP(req);
		if (dbStatus.status == "error") {
            res.status(404).send(dbStatus);
        } else {
            res.send(dbStatus);
        }	
	} else {
		console.log('sandbox');
		let sandboxRes = await sandbox.sandboxOEPstatus(req.params.id);
		if (sandboxRes.status == "error") {
			res.status(404).send(sandboxRes);
		} else {
			res.send(sandboxRes);
		}
	}
	
});

app.listen(port, function () {
	console.log(`Lyssnar på port ${port}`);
});