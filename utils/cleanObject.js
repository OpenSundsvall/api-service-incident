async function cleanObject(obj) {
	for (var propName in obj) {
		if (obj[propName] === null || obj[propName] === undefined) {
		  delete obj[propName];
		}
	}
	return obj
}

module.exports.cleanObject = cleanObject;