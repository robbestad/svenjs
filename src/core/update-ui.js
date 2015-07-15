exports.updateUI = (html, time, spec)=> {
  let rootNode = spec._svenjs.rootNode;
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