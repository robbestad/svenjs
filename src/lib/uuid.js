const uuid = () => {
	const s = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	return `${s() + s()}-${s()}`;
}
export default uuid;
