exports.lifeCycle = (spec)=> {
	if(spec.isMounted){
		spec.componentDidUpdate.apply(spec);
	}	
};