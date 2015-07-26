const Svenjs = require('../../sven.js');
var ENTER_KEY = 13;
let _toggled=false;
//import Svenjs from '../../../dist/sven.js';
var todoMVCApp = Svenjs.createComponent({
    displayName: "TodoMVC App",
    initialState: {
        messages:[
          {id:1,message:"Get the mail",complete:false},
          {id:2,message:"Make Coffe",complete:false}
        ]
    },
    addTodo(e){
      let messages=this.state.messages;
      let lastId
      if(messages.length===0) lastId=1;
      else lastId=messages[messages.length-1].id;
      messages.push({id:lastId+1, message:e.srcElement.value, complete: false});
      this.setState({messages:messages});
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
      this.setState({messages:messages});
    },
    toggleOne(item,e){
      let messages=this.state.messages.filter((msg)=>{
        if(msg.id === item.id) msg.complete=!msg.complete;
        return msg
      })
      this.setState({messages:messages});
    },
    toggleAll(){
      _toggled=!_toggled;
      let messages=this.state.messages.map((msg)=>{
        msg.complete=_toggled;
        return msg;
      })
      this.setState({messages:messages});
    },
    listMessages(){
      return this.state.messages.map((item)=>{
        let label= item.message;
        let checked=false;
        if(item.complete) {
          label= <del>{item.message}</del>;
          checked=true;
        }
        return  <li className="todo">
               <div className="view">
                 <input className="toggle" type="checkbox" checked={checked} onClick={this.toggleOne.bind(this,item)}  />
                 <label>{label}</label>
                 <button className="destroy" onClick={this.destroyMessage.bind(this,item)}></button>
               </div>
               <input className="edit" type="text" value={item.message} />
             </li>
      })
    },
    handleNewTodoKeyDown(e) {
      if (e.keyCode !== ENTER_KEY) {
        return;
      }
      this.addTodo(e);
      e.innerHTML="";
      document.getElementsByClassName(e.srcElement.className)[0].focus();
      e.preventDefault();
    },
    render(){
      "use strict";
      var state=this.state;

      return (<section class="todoapp">
                <header class="header">
                  <h1>todos</h1>
                  <input class="new-todo" 
                    onKeyDown={this.handleNewTodoKeyDown.bind(this)}
                    placeholder="What needs to be done?" autofocus />
                </header>
                <section className="main">
                  <input className="toggle-all" type="checkbox" onClick={this.toggleAll.bind(this)} />
                  <label for="toggle-all">Mark all as complete</label>
                  <ul className="todo-list">
                    {this.listMessages()}
                  </ul>
                </section>

                <footer class="footer">
                  <span class="todo-count">{this.state.messages.length}</span>
                  <ul class="filters">
                      <li>
                              <a href="#/" class="selected">All</a>
                      </li>
                      <li>
                              <a href="#/active">Active</a>
                      </li>
                      <li>
                              <a href="#/completed">Completed</a>
                      </li>
                  </ul>
                  <button class="clear-completed" onClick={this.destroyCompleted.bind(this)}>Clear completed</button>
                </footer>
        </section>);
    }

});
module.exports = todoMVCApp;