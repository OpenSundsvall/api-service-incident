const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

async function sandboxBadboj() {
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var date = [year, month, day].join('');

    let resMsg = "SP_" + date + "_" + crypto.randomBytes(2).toString('hex');

    return resMsg;
}

async function sandboxCheckCategory(cat) {
    if ([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].includes(cat)) {
        responseMsg = true;
    }
    else {
        responseMsg = false;
    }
    return responseMsg;
}

async function sandboxValidstatuses() {
    return [{"statusdId":1,"statusDescription":"open"},{"statudsId":2,"statusDescription":"resolved"},{"statudsId":3,"statusDescription":"rejected"}];
}

async function sandboxValidcategories() {
    return [{"categoryId":1,"categoryDescription":"Belysning"},{"categoryId":2,"categoryDescription":"Bro\/Tunnel\/Konstruktion"},{"categoryId":3,"categoryDescription":"Felparkeratochövergivetfordon"},{"categoryId":4,"categoryDescription":"Gång-ochcykelväg"},{"categoryId":5,"categoryDescription":"Klotter"},{"categoryId":6,"categoryDescription":"Park,skog,bad-ochlekplats"},{"categoryId":7,"categoryDescription":"Parkering"},{"categoryId":8,"categoryDescription":"Renhållning"},{"categoryId":9,"categoryDescription":"Skyltochvägmärke"},{"categoryId":10,"categoryDescription":"Trafiksignal"},{"categoryId":11,"categoryDescription":"Väg\/gata"},{"categoryId":12,"categoryDescription":"Vägmarkering"},{"categoryId":13,"categoryDescription":"Övrigt"},{"categoryId":15,"categoryDescription":"Livboj"},{"categoryId":16,"categoryDescription":"Livbåt"}];
}

async function sandboxValidcategoriesOEP() {
    return [{"key":1,"value":"Belysning"},{"key":2,"value":"Bro\/Tunnel\/Konstruktion"},{"key":3,"value":"Felparkeratochövergivetfordon"},{"key":4,"value":"Gång-ochcykelväg"},{"key":5,"value":"Klotter"},{"key":6,"value":"Park,skog,bad-ochlekplats"},{"key":7,"value":"Parkering"},{"key":8,"value":"Renhållning"},{"key":9,"value":"Skyltochvägmärke"},{"key":10,"value":"Trafiksignal"},{"key":11,"value":"Väg\/gata"},{"key":12,"value":"Vägmarkering"},{"key":13,"value":"Övrigt"},{"key":15,"value":"Livboj"},{"key":16,"value":"Livbåt"}];
}

async function sandboxSendincident(catID) {
    let incidentId;
	
    if (catID == 15 || catID == 16) {
        let incidentId = await sandboxBadboj();
        resErrandMsg = {"status":"OK", "incidentId":incidentId};
    } else {
        incidentId = uuidv4();
        resErrandMsg = {"status":"OK", "incidentId":incidentId};
    }

    return resErrandMsg;
}

async function sandboxListincidents() {
    return [{"incidentId":"d4f4d48b-c658-48c0-b27e-5682a5e01896","status":1,"externalCaseId":"SP_20210617_b446"},{"incidentId":"61922068-4dac-4aa7-bcb3-6428c4232ced","status":2,"externalCaseId":"12345"},{"incidentId":"c9663bca-0ba0-48ee-b0d0-9900ca065cc3","status":1},{"incidentId":"38bdd817-ef44-4d93-86ca-bc1f4e97257f","status":3},{"incidentId":"2f5ca4c7-d631-4e87-99f6-c30467829a01","status":1}];
}

async function sandboxGetincident(incidentID, attachments) {
    let sendAttachments = false;
    if (["d4f4d48b-c658-48c0-b27e-5682a5e01896","43f6910a-e946-4b40-b925-8967d4d42002","c9663bca-0ba0-48ee-b0d0-9900ca065cc3","38bdd817-ef44-4d93-86ca-bc1f4e97257f","2f5ca4c7-d631-4e87-99f6-c30467829a01"].includes(incidentID)) {
        if (attachments != undefined) {
            if (attachments.toLowerCase() == 'true') {
                sendAttachments = true;
            }
        }
        if (sendAttachments) {
            return {"incidentID":incidentID,"personID":"80dade2b-dc25-4fa5-afc3-e2208c093c8c","created":"2020-12-10T22:33:07.000Z","phoneNumber":"070123456789","email":"test@test.se","contactMethod":"email","updated":null,"category":6,"description":"Någon har kastat tugummi i en park","mapCoordinates":"62.23162,17.27403","attachments":[{"category":"Bild","extension":"png","mimetype":"image/png","note":"Bifogadbild","file":"data:image/jpeg;base64,kjhfdkjshfsdkjhfdkjshfdkjshfdkjshfdkjs789489534hj435","IncidentId":req.params.id,"name":"987dc019dd3aaa766b9f5f29aa0c69d7bc98","created":"2020-12-10T22:33:07.000Z"}]};
        } else {
            return {"incidentID":incidentID,"personID":"80dade2b-dc25-4fa5-afc3-e2208c093c8c","created":"2020-12-10T22:33:07.000Z","phoneNumber":"070123456789","email":"test@test.se","contactMethod":"email","updated":null,"category":6,"description":"Någon har kastat tugummi i en park","mapCoordinates":"62.23162,17.27403"};
        }
    } else {
        return {"status":"error","message":"Ärendenummer finns inte"};
    }
}

async function sandboxOEPstatus(incidentID) {
    if (incidentID == "61922068-4dac-4aa7-bcb3-6428c4232ced" || incidentID == "12345") {
        return {"incidentId":"61922068-4dac-4aa7-bcb3-6428c4232ced","externalCaseId":"12345","statusId":1,"statusTxt":"open"};
    } else {
        return {"status":"error","message":"Ärendenummer finns inte"};
    }
}

module.exports.sandboxBadboj = sandboxBadboj
module.exports.sandboxCheckCategory = sandboxCheckCategory;
module.exports.sandboxValidstatuses = sandboxValidstatuses;
module.exports.sandboxValidcategories = sandboxValidcategories;
module.exports.sandboxValidcategoriesOEP = sandboxValidcategoriesOEP;
module.exports.sandboxSendincident = sandboxSendincident;
module.exports.sandboxListincidents = sandboxListincidents;
module.exports.sandboxGetincident = sandboxGetincident;
module.exports.sandboxOEPstatus = sandboxOEPstatus;