exports.render = (html, selector="#ui")=> {
  document.querySelector(selector).innerHTML = "";
  if (typeof html === "string") {
    document.querySelector(selector).appendChild(
      document.createRange().createContextualFragment(html)
    );
  } else {
    document.querySelector(selector).appendChild(html);
  }
};