const deepClone = obj => {
	if (!obj || typeof obj !== 'object') {
		return obj;
	}
	let newObj = {};
	if (Array.isArray(obj)) {
		newObj = obj.map(item => deepClone(item));
	} else {
		Object.keys(obj).forEach((key) => {
			return newObj[key] = deepClone(obj[key]);
		})
	}
	return newObj;
}
export default deepClone;
