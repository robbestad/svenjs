import {saveState} from './save-state';
exports.updateUI = (loading, html, time)=> {
  if (!loading) saveState(time);
  if (JSON.stringify(document.querySelector('#ui').innerHTML) === JSON.stringify(html)) {
    return;
  }

  document.querySelector('#ui').innerHTML = "";
  if (typeof html === "string") {
    document.querySelector('#ui').appendChild(
      document.createRange().createContextualFragment(html)
    );
  } else {
    document.querySelector('#ui').appendChild(html);
  }
};