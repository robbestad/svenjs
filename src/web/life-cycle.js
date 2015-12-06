import {render} from "../core/render";

exports.lifeCycle = (spec)=> {
 let rootNode;
  if(spec._svenjs.rootNode){
    rootNode=spec._svenjs.rootNode;
  };
  if(!rootNode) rootNode=document.querySelector("[sjxid='"+spec._sjxid+"']");

  if(spec.isMounted && rootNode){
    render(spec, rootNode);
    if(spec.hasOwnProperty('_didUpdate')) spec._didUpdate.apply(spec);
  }	
};
