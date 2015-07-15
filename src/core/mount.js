import {updateUI} from './update-ui';
exports.mount = (spec, rootNode)=> {
  spec._svenjs={rootNode:rootNode};

  rootNode.innerHTML = "";
  if (typeof spec.render() === "string") {
    rootNode.appendChild(
      document.createRange().createContextualFragment(spec.render())
    );
  } else {
    rootNode.appendChild(spec.render());
  }
  updateUI(spec.render(spec.state), spec.time, spec);

};