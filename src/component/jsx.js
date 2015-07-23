import {updateUI} from './update-ui';
exports.jsx = (...parts) => {
    let docFragment = document.createDocumentFragment();
    let el = document.createElement(parts[0]);
    if(parts[1]){
    	console.log(parts[1]);
    	if(parts[1].hasOwnProperty('onClick')) 
    		el.onclick = parts[1].onClick;

		if(parts[1].hasOwnProperty('disabled')) 
    		if(parts[1].disabled !== "false") el.disabled = parts[1].disabled;
    	
		if(parts[1].hasOwnProperty('id')) 
    		el.id = parts[1].id;
    	
    }
    if(parts[2]){
    el.appendChild(document.createTextNode(parts[2]));
    }
    if(parts[3]){
    el.appendChild(document.createTextNode(parts[3]));
    }
    docFragment.appendChild(el);

    document.getElementById('ui').appendChild(docFragment);
    //return updateUI(false,docFragment);
//    return updateUI(false,div);
}

