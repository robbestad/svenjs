import Svenjs from "./assets/sven.browser.js";

let ENTER_KEY = 13;
let ESCAPE_KEY = 27;
let _toggled = false;
let _prevEditing = false;
let _currentEdit = 0;

function deepCopy(o) {
	return JSON.parse(JSON.stringify(o));
};


let todoMVCApp = SvenJs.create({
	initialState: {
		messages: [
			{id: 1, message: "Answer all the mail", complete: false, editing: false},
			{id: 2, message: "Get a cup of coffee", complete: false, editing: false}
		]
	},
	_didUpdate() {
		let node = document.getElementById('new-todo');
		if (node !== null && _prevEditing) {
			_prevEditing = false;
			node.focus();
			node.setSelectionRange(node.value.length, node.value.length);
		}
	},
	_didMount() {
		var url = self.history === true ? self.getPath() : window.location.hash.replace(/.*#\//, '');
		this.setState({messages: this.state.messages, url: url});
		window.addEventListener("hashchange", this.onHashChange.bind(this), false);
	},
	handleEditTodoKeyDown(e) {

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
	handleNewTodoKeyDown(id, e) {
		if (e.keyCode !== ENTER_KEY) {
			return;
		}
		this.addTodo(e);
		e.innerHTML = "";
		document.getElementById(id).focus();
		e.preventDefault();
	},
	onHashChange() {
		var url = self.history === true ? self.getPath() : window.location.hash.replace(/.*#\//, '');
		this.resetEditing();
		this.setState({messages: this.state.messages, url: url});
	},
	saveTodo(e) {
		let val = "undefined" === typeof e.srcElement ? e.target.value : e.srcElement.value;
		let messages = this.state.messages.filter((msg) => {
			if (msg.id === _currentEdit) msg.message = val;
			return msg
		})
		this.setState({messages: messages, url: this.state.url});
	},
	addTodo(e) {
		let messages = deepCopy(this.state.messages);
		let lastId;
		let val = "undefined" === typeof e.srcElement ? e.target.value : e.srcElement.value;
		if (messages.length === 0) lastId = 1;
		else lastId = messages[messages.length - 1].id;
		messages.push({id: lastId + 1, message: val, complete: false, editing: false});
		this.setState({messages: messages, url: this.state.url});
	},
	destroyMessage(item) {
		let messages = this.state.messages.filter((msg) => {
			return msg.id !== item.id
		})
		this.setState({messages: messages});
	},
	destroyCompleted() {
		let _messages = deepCopy(this.state.messages);
		let messages = _messages.filter((msg) => {
			return msg.complete === false
		})
		this.resetEditing();
		this.setState({messages: messages, url: this.state.url});
	},
	toggleOne(item, e) {
		let _messages = deepCopy(this.state.messages);
		let messages = _messages.filter((msg) => {
			if (msg.id === item.id) msg.complete = !msg.complete;
			return msg
		})
		this.resetEditing();
		this.setState({messages: messages, url: this.state.url})
	},
	simpleResetEditing() {
		let _messages = deepCopy(this.state.messages);
		let messages = _messages.map((msg) => {
			msg.editing = false;
			return msg
		});
		_prevEditing = false;
		this.setState({messages: messages, url: this.state.url});
	},
	resetEditing(e) {
		let update = false;
		let _messages = deepCopy(this.state.messages);

		let messages = _messages.map((msg) => {
			if (msg.editing) update = true;
			msg.editing = false;
			return msg
		})
		if (update) {
			_prevEditing = true;
			this.setState({messages: messages, url: this.state.url});
		} else {
			_prevEditing = false;
		}
	},
	onDoubleClick(todo, e) {
		_currentEdit = todo.id;
		let _messages = deepCopy(this.state.messages);

		if (!todo.complete) {
			let messages = _messages.map((msg) => {
				msg.editing = msg.id === todo.id ? !msg.editing : false;
				return msg
			})
			this.setState({messages: messages, url: this.state.url});
			let node = document.getElementsByClassName('edit active')[0];
			node.focus();
			node.setSelectionRange(node.value.length, node.value.length);
		}
	},
	toggleAll() {
		_toggled = !_toggled;
		let _messages = deepCopy(this.state.messages);

		let messages = _messages.map((msg) => {
			msg.complete = _toggled;
			return msg;
		})
		this.resetEditing();
		this.setState({messages: messages});
	},
	listTodos() {
		let _messages = deepCopy(this.state.messages);

		let shownTodos = _messages.filter((todo) => {
			switch (this.state.url) {
				case "active":
					return !todo.complete;
				case "completed":
					return todo.complete;
				default:
					return true;
			}
		}, this);

		return shownTodos.map((todo) => {
			let label = todo.message;
			let checked = false;
			let className = "todo";
			let editClassName = "edit";
			if (todo.editing) {
				className = "todo editing";
				editClassName = "edit active";
			}
			if (todo.complete) {
				label = {tag: "del", attrs: {sjxid: "1222.595115120892"}, children: [todo.message]};
				checked = true;
			}
			return {tag: "li", attrs: {sjxid: "1405.0809556733816", className:className}, children: [
				{tag: "div", attrs: {sjxid: "1981.417695621729", className:"view"}, children: [
					{tag: "input", attrs: {sjxid: "1591.9679358835772", className:"toggle", type:"checkbox", checked:checked, onClick:this.toggleOne.bind(this, todo)}}, 
					{tag: "label", attrs: {sjxid: "1413.0949864339284", ondblclick:this.onDoubleClick.bind(this, todo)}, children: [label]}, 
					{tag: "button", attrs: {sjxid: "1464.726366737478", className:"destroy", onClick:this.destroyMessage.bind(this, todo)}}
				]}, 
				{tag: "input", attrs: {sjxid: "550.0186024273787", className:editClassName, 
				       type:"text", 
				       onKeyDown:this.handleEditTodoKeyDown.bind(this), 
				       value:todo.message}}
			]}
		})
	},
	render() {
		var state = this.state;
		let selected_all = "", selected_active = "", selected_completed = "";
		if (this.state.url === "" || this.state.url === "all") selected_all = 'selected';
		if (this.state.url === "active") selected_active = 'selected';
		if (this.state.url === "completed") selected_completed = 'selected';

		return ({tag: "section", attrs: {sjxid: "1128.2683506240464", class:"todoapp"}, children: [
			{tag: "header", attrs: {sjxid: "857.4076023295851", class:"header"}, children: [
				{tag: "h1", attrs: {sjxid: "496.0860361085362"}, children: ["todos"]}, 
				{tag: "input", attrs: {sjxid: "451.10573650802934", className:"new-todo", 
				       id:"new-todo", 
				       onClick:this.resetEditing.bind(this), 
				       onKeyDown:this.handleNewTodoKeyDown.bind(this, "new-todo"), 
				       placeholder:"What needs to be done?", autofocus:true}}
			]}, 
			{tag: "section", attrs: {sjxid: "1121.9020961367999", className:"main"}, children: [
				{tag: "input", attrs: {sjxid: "1212.6006707260694", className:"toggle-all", type:"checkbox", onClick:this.toggleAll.bind(this)}}, 
				{tag: "label", attrs: {sjxid: "1099.8503021133588", for:"toggle-all"}, children: ["Mark all as complete"]}, 
				{tag: "ul", attrs: {sjxid: "783.2873843576813", className:"todo-list"}, children: [
					this.listTodos()
				]}
			]}, 

			{tag: "footer", attrs: {sjxid: "220.7633598493457", class:"footer"}, children: [
				{tag: "span", attrs: {sjxid: "526.4140235647093", class:"todo-count"}, children: [this.state.messages.length, 
					this.state.messages.length === 1 ? " item" : " items", " remaining"]}, 

				{tag: "ul", attrs: {sjxid: "1300.7775582596", class:"filters"}, children: [
					{tag: "li", attrs: {sjxid: "273.1071093783215"}, children: [
						{tag: "a", attrs: {sjxid: "1532.2045614556946", href:"#/all", class:selected_all}, children: ["All"]}
					]}, 
					{tag: "li", attrs: {sjxid: "1969.2213916277628"}, children: [
						{tag: "a", attrs: {sjxid: "1815.6839176872713", href:"#/active", class:selected_active}, children: ["Active"]}
					]}, 
					{tag: "li", attrs: {sjxid: "1969.6586309694237"}, children: [
						{tag: "a", attrs: {sjxid: "1526.0339520846337", href:"#/completed", class:selected_completed}, children: ["Completed"]}
					]}
				]}, 
				{tag: "button", attrs: {sjxid: "103.73083651869264", class:"clear-completed", onClick:this.destroyCompleted.bind(this)}, children: ["Clear completed"]}
			]}
		]});
	}

});
Svenjs.render(
	App,
	document.getElementById("myapp")
);
