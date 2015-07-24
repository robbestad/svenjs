import {updateUI} from './update-ui';
//import {jsx} from './jsx';

let jsx = (parts) =>{
	console.log(parts);
	return parts;
}

exports.render = (spec, rootNode)=> {
  console.log('render start');
  console.log(spec.render());

  spec._svenjs.rootNode=rootNode;
  //console.log(jsx(spec.render));
  updateUI(spec);
  console.log('render done');
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