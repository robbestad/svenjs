/**
 * @module core/create
 * @see module:svenjs
 * @author Sven A Robbestad <sven@robbestad.com>
 */
'use strict';
import {version} from './version';
import {setState} from '../web/set-state';
exports.create = (spec,props)=> {
  spec._svenjs={rootNode:false};
  spec.props={};
  if(props){
    spec._jsxid=spec.props.sjxid;
    spec.props=props;
    delete spec.props.sjxid;
  }
  if(!spec.isBound){
    spec.version=version;
    spec.isBound=true;
    spec.setState=function(state){
      return setState(state,this);
    };
    if("function" === typeof spec._beforeMount){
      spec._beforeMount.apply(spec);
    }
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
