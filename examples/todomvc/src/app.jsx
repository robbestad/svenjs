const Svenjs = require('assets/index.js');
let ENTER_KEY = 13;
let ESCAPE_KEY = 27;
let _toggled=false;
let _prevEditing=false;
let _currentEdit=0;

function deepCopy (o) {
	return JSON.parse(JSON.stringify(o));
};


let todoMVCApp = Svenjs.create({
    displayName: "TodoMVC App",
    initialState: {
        messages:[
          {id:1,message:"Answer all the mail",complete:false,editing:false},
          {id:2,message:"Get a cup of coffee",complete:false,editing:false}
        ]
    },
    _didUpdate(){
      let node= document.getElementById('new-todo');
      if(node!==null && _prevEditing){
        _prevEditing=false;
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
      }
    },
    _didMount(){
      var url = self.history === true ? self.getPath() : window.location.hash.replace(/.*#\//, '');
      this.setState({messages:this.state.messages,url:url});
      window.addEventListener("hashchange", this.onHashChange.bind(this), false);
    },
    handleEditTodoKeyDown(e){

      if (e.keyCode === ESCAPE_KEY) {
        this.simpleResetEditing();
        return;
      }
      if (e.keyCode !== ENTER_KEY) {
          return;
      }
      this.saveTodo(e);
      this.resetEditing();
      e.preventDefault();
    },
    handleNewTodoKeyDown(id,e) {
      if (e.keyCode !== ENTER_KEY) {
        return;
      }
      this.addTodo(e);
      e.innerHTML="";
      document.getElementById(id).focus();
      e.preventDefault();
    },
    onHashChange(){
        var url = self.history === true ? self.getPath() : window.location.hash.replace(/.*#\//, '');
        this.resetEditing();
        this.setState({messages:this.state.messages,url:url});
    },
    saveTodo(e){
      let val = "undefined" === typeof e.srcElement ? e.target.value : e.srcElement.value;
      let messages=this.state.messages.filter((msg)=>{
        if(msg.id === _currentEdit) msg.message=val;
        return msg
      })
      this.setState({messages:messages, url:this.state.url});
    },
    addTodo(e){
      let messages=deepCopy(this.state.messages);
      let lastId;
      let val = "undefined" === typeof e.srcElement ? e.target.value : e.srcElement.value;
      if(messages.length===0) lastId=1;
      else lastId=messages[messages.length-1].id;
      messages.push({id:lastId+1, message:val , complete: false, editing:false});
      this.setState({messages:messages, url:this.state.url});
    },
    destroyMessage(item){
      let messages=this.state.messages.filter((msg)=>{
        return msg.id!==item.id
      })
      this.setState({messages:messages});
    },
    destroyCompleted(){
      let messages=this.state.messages.filter((msg)=>{
        return msg.complete===false
      })
      this.resetEditing();
      this.setState({messages:messages, url:this.state.url});
    },
    toggleOne(item,e){
      let messages=this.state.messages.filter((msg)=>{
        if(msg.id === item.id) msg.complete=!msg.complete;
        return msg
      })
      this.resetEditing();
      this.setState({messages:messages, url:this.state.url})
    },
    simpleResetEditing(){
      let messages=this.state.messages.map((msg)=>{
        msg.editing = false;
        return msg
      });
      _prevEditing=false;
      this.setState({messages:messages, url:this.state.url});
    },
    resetEditing(e){
      let update=false;
      let messages=this.state.messages.map((msg)=>{
        if(msg.editing) update=true;
        msg.editing = false;
        return msg
      })
      if(update) {
        _prevEditing=true;
        this.setState({messages:messages, url:this.state.url});
      } else {
        _prevEditing=false;
      }
    },
    onDoubleClick(todo,e){
      _currentEdit=todo.id;
      if(!todo.complete){
        let messages=this.state.messages.map((msg)=>{
           msg.editing = msg.id===todo.id ? !msg.editing : false;
          return msg
        })
        this.setState({messages:messages, url:this.state.url});
        let node= document.getElementsByClassName('edit active')[0];
        node.focus();
        node.setSelectionRange(node.value.length, node.value.length);
      }
    },
    toggleAll(){
      _toggled=!_toggled;
      let messages=this.state.messages.map((msg)=>{
        msg.complete=_toggled;
        return msg;
      })
      this.resetEditing();
      this.setState({messages:messages});
    },
    listTodos(){

      let shownTodos = this.state.messages.filter( (todo) => {
        switch (this.state.url) {
        case "active":
          return !todo.complete;
        case "completed":
          return todo.complete;
        default:
          return true;
        }
      }, this);

      return shownTodos.map((todo)=>{
        let label= todo.message;
        let checked=false;
        let className="todo";
        let editClassName="edit";
        if(todo.editing){
          className="todo editing";
          editClassName="edit active";
          }
        if(todo.complete) {
          label= <del>{todo.message}</del>;
          checked=true;
        }
        return  <li className={className} >
               <div className="view">
                 <input className="toggle" type="checkbox" checked={checked} onClick={this.toggleOne.bind(this,todo)}  />
                 <label ondblclick={this.onDoubleClick.bind(this, todo)} >{label}</label>
                 <button className="destroy" onClick={this.destroyMessage.bind(this,todo)}></button>
               </div>
               <input className={editClassName}
                type="text"
                onKeyDown={this.handleEditTodoKeyDown.bind(this)}
                value={todo.message} />
             </li>
      })
    },
    render(){
      "use strict";
      var state=this.state;
      let selected_all="", selected_active="", selected_completed="";
      if(this.state.url==="" || this.state.url==="all") selected_all='selected';
      if(this.state.url==="active") selected_active='selected';
      if(this.state.url==="completed") selected_completed='selected';

      return (<section class="todoapp">
                <header class="header">
                  <h1>todos</h1>
                  <input className="new-todo"
                    id="new-todo"
                    onClick={this.resetEditing.bind(this)}
                    onKeyDown={this.handleNewTodoKeyDown.bind(this,"new-todo")}
                    placeholder="What needs to be done?" autofocus />
                </header>
                <section className="main">
                  <input className="toggle-all" type="checkbox" onClick={this.toggleAll.bind(this)} />
                  <label for="toggle-all">Mark all as complete</label>
                  <ul className="todo-list">
                    {this.listTodos()}
                  </ul>
                </section>

                <footer class="footer">
                  <span class="todo-count">{this.state.messages.length}
                    {this.state.messages.length === 1 ? " item" : " items"} remaining</span>

                  <ul class="filters">
                      <li>
                          <a href="#/all" class={selected_all}>All</a>
                      </li>
                      <li>
                          <a href="#/active" class={selected_active}>Active</a>
                      </li>
                      <li>
                          <a href="#/completed" class={selected_completed}>Completed</a>
                      </li>
                  </ul>
                  <button class="clear-completed" onClick={this.destroyCompleted.bind(this)}>Clear completed</button>
                </footer>
        </section>);
    }

});
module.exports = todoMVCApp;
