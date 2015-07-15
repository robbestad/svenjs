exports.lifeCycle = (spec)=> {
	if(spec.isMounted){
		spec.componentDidUpdate.apply(spec);
	}

   //console.log(spec._rootNode);
   //console.log(spec._svenjs.rootNode);
};