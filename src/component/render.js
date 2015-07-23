import {updateUI} from './update-ui';

exports.render = (spec, rootNode)=> {
  spec._svenjs.rootNode=rootNode;
  updateUI(spec);
};

/*
import {updateUI} from './update-ui';
let _spec, _rootNode;
exports.render = (spec, rootNode, html)=> {
console.log('render start');
console.log(spec);
console.log(rootNode);
console.log('render done');
  spec = spec || _spec; _spec = spec;
  rootNode = rootNode || _rootNode; if(!_rootNode) _rootNode=rootNode;
  spec._svenjs.rootNode = rootNode;
  if(html) return updateUI(spec,html); else return updateUI(spec);

};
*/