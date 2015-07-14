import {deepCopy} from '../utils/deep-copy';
import {saveState} from './save-state';
import {updateUI} from './update-ui';
import {timeTravel} from './time-travel';

exports.setState = (state, time, callback)=> {
  // Removed undefined
  var newArray = new Array();
  for(var i = 0; i<time.history.length; i++){
/*      if (undefined !== time.history[i]){
        newArray.push(time.history[i]);
      }
  */
        newArray.push(time.history[i]);
  }
  time.history = newArray;

// delete alternate future history
  time.history.splice(time.pos);
// push state to history
  time.history.push(deepCopy(state));

  //callback(state,time);
  timeTravel(callback, 1)
  //updateUI(false, callback.render(state), time);

};