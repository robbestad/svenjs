const updateUI = exports.updateUI = (loading)=> {
    if (!loading) Svenjs.saveState();
    document.querySelector('#ui').innerHTML = Svenjs.render(state);
};