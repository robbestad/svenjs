import {deepCopy} from '../utils/deep-copy';
import {updateUI} from './update-ui';
import {setState} from './set-state';

exports.timeTravel = (spec,position)=> {
  let time=spec.time;
  let state=spec.state;
  let newTimePosition=time.pos+position;
  if(position<0){
	if(undefined === spec.time.history[time.pos]){
		newTimePosition--;
		state = time.history[newTimePosition];	
		time.pos=time.pos+position;
  	}
	else
	if(newTimePosition<=0){
	  	newTimePosition = 0;
		state = {items:[]}; // should be defaultstate
		time.pos=time.pos+position;
  	}	
  	else {
		newTimePosition--;
  		state = time.history[newTimePosition];
  		time.pos=time.pos+position;
  	}
  }
  else {
	state = time.history[newTimePosition];
	time.pos=time.pos+position;
  }
  updateUI(true, spec.render(state), time);
};