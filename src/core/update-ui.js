const updateUI = exports.updateUI = (loading, html, time)=> {
  if (!loading) Svenjs.saveState(time);
  let oldHtml = document.querySelector('#ui').innerHTML;
  //console.log(oldHtml === html);
  //console.log(JSON.stringify(oldHtml));
  //console.log(JSON.stringify(html));
  if (JSON.stringify(oldHtml) === JSON.stringify(html)) {
    return;
  }
  document.querySelector('#ui').innerHTML = "";
  if (typeof html === "string") {
    document.querySelector('#ui').appendChild(
      document.createRange().createContextualFragment(Svenjs.render(html))
    );
  } else {
    document.querySelector('#ui').appendChild(Svenjs.render(html));
  }
};