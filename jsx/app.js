/**
 * Created by linzerui on 15/4/11.
 */

/**
 * reflux
 */
var TodoAction = Reflux.createActions([
    'addTodo',
    'deleteTodo',
    'filterTodo'
]);

var appStore = Reflux.createStore({
    listenables: [TodoAction],

    onAddTodo: function( item ){
        var newTodo = {
            title: item,
            id: Math.random()
        };

        this.updateStatus({
            todos: this.data.todos.concat( newTodo ),
            filterText: ""
        });
    },

    onDeleteTodo: function( id ){

        this.updateStatus({
            todos: this.data.todos.filter(function(item){
                return item.id !== id
            }),
            filterText: ""
        });
    },

    onFilterTodo: function( text ){
        this.updateStatus({
            todos: this.data.todos,
            filterText: text
        });
    },

    updateStatus: function( todos ){
        this.data = todos;
        this.trigger( todos );
    },

    getInitialState: function(){
         this.data = {
            todos: [
                {
                    title: 'eat',
                    id: Math.random()
                },
                {
                    title: 'sleep',
                    id: Math.random()
                },
                {
                    title: 'code',
                    id: Math.random()
                },
                {
                    title: 'go home',
                    id: Math.random()
                }
            ],
            filterText: ''
        };

        return this.data;
    }
});


/*************************************************************************************/

/**
 * main component
 */

var App = React.createClass({
    mixins: [Reflux.connect(appStore)],

    render: function(){
        return (
            <div id="app">
                <Header filterText={this.state.filterText} />
                <List todos={this.state.todos} filterText={this.state.filterText} />
            </div>
        )
    }
});

/**
 * Header
 */
var Header = React.createClass({
    render: function(){
        return (
            <div className="header">
                <FilterTodo filterText={this.props.filterText} />
                <AddTodo />
            </div>
        )
    }
});

/**
 * FilterTodo
 */
var FilterTodo = React.createClass({
    handlerFilter: function() {
        TodoAction.filterTodo( React.findDOMNode( this.refs.filter ).value.trim() );
    },

    render: function() {
        return (
            <div className="filterTodo">
                <input type="text" ref="filter" placeholder="input to filter" value={this.props.filterText} onChange={this.handlerFilter} />
            </div>
        )
    }
});

/**
 * AddTodo
 */
/*
class AddTodo extends React.Component {
    handleAddTodo() {
        /!*var todo = React.findDOMNode( this.refs.add ).value.trim();
        if ( !todo ) return;

        this.props.handleAddTodo( todo );
        React.findDOMNode( this.refs.add ).value = '';*!/

        TodoAction.addTodo( React.findDOMNode( this.refs.add ).value.trim() );
    }

    render() {
        return (
            <div className="addTodo">
                <input type="text" ref="add" placeholder="what you want to do?" />
                <button onClick={this.handleAddTodo.bind(this)}>add</button>
            </div>
        )
    }
}
*/

var AddTodo = React.createClass({
    handleAddTodo: function() {
        var todo = React.findDOMNode( this.refs.add ).value.trim();
        if ( !todo ) return;

        TodoAction.addTodo( React.findDOMNode( this.refs.add ).value.trim() );
        React.findDOMNode( this.refs.add ).value = '';
    },

    render: function() {
        return (
            <div className="addTodo">
                <input type="text" ref="add" placeholder="what you want to do?" />
                <button onClick={this.handleAddTodo}>add</button>
            </div>
        )
    }
});

/**
 * List
 */
var List = React.createClass({
    render: function() {

        var list = this.props.todos.filter(function(item){
            return item.title.indexOf( this.props.filterText ) > -1;
        }, this);

        return (
            <ul className="todo-list">
                {
                    list.map(function(item){
                        return <Item key={item.id} data-id={item.id} item={item.title} />
                    }, this)
                }
            </ul>
        )
    }
});

/**
 * Item
 */
var Item = React.createClass({
    handleDeleteTodo: function( id ) {
        TodoAction.deleteTodo( id );
    },

    render: function() {
        return (
            <li onClick={this.handleDeleteTodo.bind(this, this.props['data-id'])}>{this.props.item}</li>
        )
    }
});

/**
 * render
 */
React.render(<App/>, document.body);