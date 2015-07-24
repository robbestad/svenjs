exports.getJSON=(url) =>{
  'use strict';
  return new Promise((resolve, reject) =>{
    const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      }
      };
      xhr.open('GET', url);
      xhr.send();
  });
}
