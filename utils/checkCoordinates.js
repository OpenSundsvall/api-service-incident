async function checkCoordinates(coordinates) {
	let isCoordinates;
	isCoordinates = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(coordinates);
	return isCoordinates;
}

module.exports.checkCoordinates = checkCoordinates;