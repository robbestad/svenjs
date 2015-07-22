import {updateUI} from './update-ui';
//let _rootNode;
exports.render = (spec, rootNode)=> {
  //if(rootNode) _rootNode=rootNode;
  //console.log(spec._svenjs);
  //spec._svenjs.rootNode=_rootNode;
  spec._svenjs.rootNode=rootNode;
  updateUI(spec);

};