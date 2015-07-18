exports.createComponent = (spec)=> {
	spec._svenjs={rootNode:{}};

	if(!spec.isMounted){
		spec.time={history: [], pos: -1}
		spec.isMounted=true;
		if(undefined !== spec.initialState){
			spec.state = spec.initialState;
		}
		spec.componentDidMount.apply(spec);

	}
	return spec;
};