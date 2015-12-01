import {setState} from '../web/set-state';
exports.create = (spec,props)=> {
  spec._svenjs={rootNode:false};
  spec.props={};
  if(props){
    spec.props=props;
    delete spec.props.sjxid;
  }
  if(!spec.isBound){
    spec.isBound=true;
    spec.setState=function(state){
      return setState(state,this);
    };
  }
  if(!spec.isMounted){
    spec.time={history: [], pos: -1}
    spec.isMounted=true;
    if(undefined !== spec.initialState){
      spec.state = spec.initialState;
    }
    if("function" === typeof spec._didMount){
      spec._didMount.apply(spec);
    }

  }
  return spec;
};
