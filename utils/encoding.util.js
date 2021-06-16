const toHex = (ascii) => {
	return Buffer.from(ascii, 'utf8').toString('hex');
}

const fromHex = (hex) => {
	return Buffer.from(hex, 'hex').toString('utf8');
}

const decodeStrings = ([ ...strings ]) => {
	let decodedStrings = strings.map(string =>
		Buffer.from(string, 'hex').toString('utf8')
	);
	
	return decodedStrings;
}

module.exports = {
	toHex,
	fromHex,
	decodeStrings
};
