const Svenjs = require('../../sven.js');
var ENTER_KEY = 13;

//import Svenjs from '../../../dist/sven.js';
var todoMVCApp = Svenjs.createComponent({
    displayName: "TodoMVC App",
    initialState: {
        messages:[{id:1,message:"do this"},{id:2,message:"then do that"}]
    },
    handleNewTodoKeyDown(e) {
      console.log(e);
      if (e.keyCode !== ENTER_KEY) {
        console.log('hit enter');
        return;
      }
      e.preventDefault();
      /*
      var val = React.findDOMNode(this.refs.newField).value.trim();

      if (val) {
        this.props.model.addTodo(val);
        React.findDOMNode(this.refs.newField).value = '';
      }
      */
    },
    render(){
      "use strict";
      var state=this.state;
      //const log = (level="debug") => (::console[level](this), this);
      //state::log();
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
        return <li>{item.message}</li>
      })

      return (<section class="todoapp">
                        <header class="header">
                                <h1>todos</h1>
                                <input class="new-todo" 
                                  onKeyDown={this.handleNewTodoKeyDown}
                                  placeholder="What needs to be done?" autofocus />
                        </header>
                        <section class="main">
                                <input class="toggle-all" type="checkbox" />
                                <label for="toggle-all">Mark all as complete</label>
                                <ul class="todo-list"></ul>
                        </section>
                        <ul>
                          {messages}
                          <li>2 do this</li>
                          <li>2 then do this</li>
                        </ul>
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