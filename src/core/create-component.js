function bindAutoBindMethods(component) {
  for (var autoBindKey in component.__reactAutoBindMap) {
    if (component.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
      var method = component.__reactAutoBindMap[autoBindKey];
      component[autoBindKey] = bindAutoBindMethod(
        component,
        ReactErrorUtils.guard(
          method,
          component.constructor.displayName + '.' + autoBindKey
        )
      );
    }
  }
}

exports.createComponent = (spec)=> {
    console.log(spec.displayName);

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