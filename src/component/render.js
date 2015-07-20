import {updateUI} from './update-ui';
exports.render = (spec, rootNode)=> {
  spec._svenjs.rootNode=rootNode;
  updateUI(spec);
};