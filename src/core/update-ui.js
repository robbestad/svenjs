const updateUI = exports.updateUI = (loading, html)=> {
  if (!loading) Svenjs.saveState();
  document.querySelector('#ui').innerHTML = Svenjs.render(html);
};