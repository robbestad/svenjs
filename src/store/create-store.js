let _callbacks=[];
const createStore = (spec)=> {
  if(!spec.isMounted){
    spec.listenTo=function(cb){
      _callbacks.push(cb);
    };
    spec.emit=(data)=>{
      _callbacks.forEach((cb)=>{
        cb(data);
      });
    };

    if("function" === typeof spec.init){
      spec.init.apply(spec);
    }
  }
  return spec;
};
export default createStore;
