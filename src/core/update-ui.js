exports.updateUI = (spec,html,time)=> {
  let rootNode = spec._svenjs.rootNode;
  console.log(rootNode);
  time = time || spec.time;
  html = html || spec.render(spec.state)
  if (JSON.stringify(rootNode.innerHTML) === JSON.stringify(html)) {
    return;
  }
  rootNode.innerHTML = "";
  if (typeof html === "string") {
    rootNode.appendChild(
      document.createRange().createContextualFragment(html)
    );
  } else {
    rootNode.appendChild(html);
  }
};