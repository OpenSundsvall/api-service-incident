const mariadb = require('mariadb');
const cleanObj = require('../utils/cleanObject');

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

async function getValidStatuses() {
    let conn;
    try {
        conn = await pool.getConnection();
        let query = 'select STATUS_ID as statusId, Status as statusDescription from Status' + SANDBOXDB + ';';
        let rows = await conn.query(query);
        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.release();
    }
};

async function getValidCategories() {
    let conn;
    try {
        conn = await pool.getConnection();
        let query = 'select CATEGORY_ID as categoryId, Category as categoryDescription from Categories' + SANDBOXDB + ';';
        let rows = await conn.query(query);
        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.release();
    }
};

async function getValidCategoriesOeP() {
    let conn;
    try {
        conn = await pool.getConnection();
        let query = 'select cast(CATEGORY_ID as NCHAR) as "key", Category as "value" from Categories' + SANDBOXDB + ';';
        let rows = await conn.query(query);
        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.release();
    }
};

async function listIncidents(req) {
    let conn;
    let query;
    if (req.query.offset == undefined || req.query.offset == "") {

        if (req.query.limit == undefined || req.query.limit == "") {
            query = `select 
                        IncidentId as incidentId, 
                        Status as status,
                        externalCaseId
                    from Errands${SANDBOXDB}
                    order by ID ASC
                    ;`;
            try {
                conn = await pool.getConnection();
        
                let rows = await conn.query(query);
                let returnRows = [];

                for (i=0;i<rows.length;i++)
                {
                    let tempRow = await cleanObj.cleanObject(rows[i]);
                    returnRows.push(tempRow);
                }
        
                return returnRows;
            } catch (err) {
                console.error(err);
            } finally {
                if (conn) conn.release();
            }
        }
        else {
            query = `select 
                        IncidentId as incidentId,  
                        Status as status,
                        externalCaseId
                    from Errands${SANDBOXDB}
                    order by ID ASC
                    limit ?;
                    `;
            try {
                conn = await pool.getConnection();
        
                let rows = await conn.query(query, [parseInt(req.query.limit)]);
                let returnRows = [];

                for (i=0;i<rows.length;i++)
                {
                    let tempRow = await cleanObj.cleanObject(rows[i]);
                    returnRows.push(tempRow);
                }
        
                return returnRows;
            } catch (err) {
                console.error(err);
            } finally {
                if (conn) conn.release();
            }
        }		
    }
    else {	
        if (req.query.limit == undefined || req.query.limit == "") {
            query = `select 
                        IncidentId as incidentId,  
                        Status as status,
                        externalCaseId
                    from Errands${SANDBOXDB}
                    order by ID ASC
                    limit ?,100;
            `;
            try {
                conn = await pool.getConnection();
        
                let rows = await conn.query(query, [parseInt(req.query.offset)]);
                let returnRows = [];

                for (i=0;i<rows.length;i++)
                {
                    let tempRow = await cleanObj.cleanObject(rows[i]);
                    returnRows.push(tempRow);
                }
        
                return returnRows;
            } catch (err) {
                console.error(err);
            } finally {
                if (conn) conn.release();
            }
        }	
        else {
            query = `select 
                        IncidentId as incidentId,  
                        Status as status,
                        externalCaseId
                    from Errands${SANDBOXDB}
                    order by ID ASC
                    limit ?,?;
            `;
            try {
                conn = await pool.getConnection();
        
                let rows = await conn.query(query, [parseInt(req.query.offset), parseInt(req.query.limit)]);
                let returnRows = [];

                for (i=0;i<rows.length;i++)
                {
                    let tempRow = await cleanObj.cleanObject(rows[i]);
                    returnRows.push(tempRow);
                }
        
                return returnRows;
            } catch (err) {
                console.error(err);
            } finally {
                if (conn) conn.release();
            }		
        }
    }
}

async function getIncident(req) {
    let sendAttachments = false;
    if (req.query.attachments != undefined) {
        if (req.query.attachments.toLowerCase() == 'true') {
            sendAttachments = true;
        }
    }
    let conn;
    try {
        conn = await pool.getConnection();

        let dbObj;

        let query = `select * from Errands${SANDBOXDB} where IncidentId = ? or externalCaseId = ?`;

        let rows = await conn.query(query, [req.params.id, req.params.id]);

        if (rows.length > 0) {
            if (sendAttachments) {
                let attachmentQuery = `select * from Attachments${SANDBOXDB} where IncidentId = ?`;
    
                let attachmentRows = await conn.query(attachmentQuery, [req.params.id]);
    
                attachmentRows.forEach(async (attachment) => {
                    attachment.file = "data:" + attachment.mimetype + ";base64," + attachment.file.toString('base64');
                    delete attachment.ID;
                })
    
                dbObj = {
                    "incidentId": rows[0].IncidentId,
                    "externalCaseId": rows[0].externalCaseId,
                    "personId": rows[0].PersonId,
                    "created": rows[0].Created,
                    "updated": rows[0].Updated,
                    "phoneNumber": rows[0].PhoneNumber,
                    "email": rows[0].Email,
                    "contactMethod": rows[0].ContactMethod,
                    "category": rows[0].Category,
                    "description": rows[0].Description,
                    "mapCoordinates": rows[0].MapCoordinates,
                    "attachments": attachmentRows
                }
            } else {
                dbObj = {
                    "incidentId": rows[0].IncidentId,
                    "externalCaseId": rows[0].externalCaseId,
                    "personId": rows[0].PersonId,
                    "created": rows[0].Created,
                    "updated": rows[0].Updated,
                    "phoneNumber": rows[0].PhoneNumber,
                    "email": rows[0].Email,
                    "contactMethod": rows[0].ContactMethod,
                    "category": rows[0].Category,
                    "description": rows[0].Description,
                    "mapCoordinates": rows[0].MapCoordinates
                }
            }
        } else {
            dbObj = {"status": "error","message": "Ärende finns inte"};
        }

        let returnObj = await cleanObj.cleanObject(dbObj);
        return returnObj;
        
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.release();
    }
}

async function getIncidentStatusOeP(req) {
    let conn;
    let resObj;
    try {
        conn = await pool.getConnection();
        let query = 'select * from vOepStatus where externalCaseId = ?;';
        let rows = await conn.query(query, [req.params.id]);

        if (rows.length > 0) {
            resObj = rows[0];
        } else {
            resObj = {
                "status": "error",
                "message": "Ärende finns inte"
            }
        }

        return resObj;
        		
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) conn.release();
    }
}

module.exports.getValidStatuses = getValidStatuses;
module.exports.getValidCategories = getValidCategories;
module.exports.getValidCategoriesOeP = getValidCategoriesOeP;
module.exports.listIncidents = listIncidents;
module.exports.getIncident = getIncident;
module.exports.getIncidentStatusOeP = getIncidentStatusOeP;