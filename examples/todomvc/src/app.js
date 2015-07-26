const Svenjs = require('../../sven.js');
var ENTER_KEY = 13;

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
      let lastId=messages[messages.length-1].id;
      messages.push({id:lastId+1, message:e.srcElement.value, complete: false});
      this.setState({messages:messages});
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
      //const log = (level="debug") => (::console[level](this), this);
      
     /*
      return(<div>
          <header className="header">
            <h1>todos</h1>
            <input
              ref="newField"
              className="new-todo"
              placeholder="What needs to be done?"
              onKeyDown={this.handleNewTodoKeyDown}
              autoFocus={true}
            />
          </header>
          
        </div>)
*/

      let messages=this.state.messages.map((item)=>{
        return  <li className="todo">
                 <div className="view">
                   <input className="toggle" type="checkbox" />
                   <label>adssad</label>
                   <button className="destroy"></button>
                 </div>
                 <input className="edit" type="text" value="asdas" />
               </li>
      })

      return (<section class="todoapp">
                        <header class="header">
                                <h1>todos</h1>
                                <input class="new-todo" 
                                  onKeyDown={this.handleNewTodoKeyDown.bind(this)}
                                  placeholder="What needs to be done?" autofocus />
                        </header>
                        <section className="main">
                                <input className="toggle-all" type="checkbox" />
                                <label for="toggle-all">Mark all as complete</label>

                                <ul className="todo-list">
                                {messages}
                                 <li className="todo">
                                   <div className="view">
                                     <input className="toggle" type="checkbox" />
                                     <label>adssad</label>
                                     <button className="destroy"></button>
                                   </div>
                                   <input className="edit" type="text" value="asdas" />
                                 </li>
                                </ul>

                        </section>
                       

                        <footer class="footer">
                                <span class="todo-count"></span>
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
                                <button class="clear-completed">Clear completed</button>
                        </footer>
                </section>)

    }

});
module.exports = todoMVCApp;