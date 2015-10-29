var ChatRow = React.createClass({
    render: function() {
        //console.log(this.props.chat)
        var name = this.props.chat.seen ?
            this.props.chat.name :
            <span style={{color: 'red'}}>
                {this.props.chat.name}
            </span>;
        return (
            <tr>
                <td> 
                    <span >{name} </span>
                    <span >{this.props.chat.company}</span>
                </td>
            </tr>
        );
    }
});

var ChatTable = React.createClass({
    render: function() {
        console.log(this.props.chats);

        var rows = [];
        this.props.chats.forEach(function(chat) 
        {
            if (chat.name.indexOf(this.props.filterText) === -1 ) {
                    return;
            }

            rows.push(<ChatRow chat={chat} key={chat.name}/>);
        }.bind(this));
        console.log({rows})

        return (
            <table>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});




var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value,
            this.refs.inStockOnlyInput.getDOMNode().checked
        );
    },
    render: function() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                />

            </form>
        );
    }
});

var MessageSection = React.createClass({
    render: function() {
        return(
            <h3> MOONLIGHT SHADOW </h3>
        )
    }
})

var FilterableChatTable = React.createClass({
    getInitialState: function() {
        return {
            filterText: '',
            inStockOnly: false
        };
    },

    handleUserInput: function(filterText, inStockOnly) {
        this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
        });
    },

    render: function() {
        return (
            <div className="chatapp">
                <div>
                    <SearchBar
                        filterText={this.state.filterText}
                        inStockOnly={this.state.inStockOnly}
                        onUserInput={this.handleUserInput}
                    />
                    <ChatTable
                        chats={this.props.chats}
                        filterText={this.state.filterText}
                        inStockOnly={this.state.inStockOnly}
                    />
                </div>
                <div>
                    <MessageSection />
                </div>
            </div>
        );
    }
});



// for simplicity, sort before passing it to react render?
// TODO highlight currently selected chat?
var SAMPLE = [
  {company: 'LuNing Pvt Ltd', seen: true, name: 'Luning'},
  {company: 'LuNing Pvt Ltd', seen: true, name: 'ChengZhen'},
  {company: 'LuNing Pvt Ltd', seen: false, name: 'Tian Tong'},
  {company: 'Yuxuan non-profit', seen: true, name: 'Yuxuan'},
  {company: 'EI agency', seen: false, name: 'tester'},
  {company: 'Sleepy Talents pte ltd', seen: true, name: 'Anyu'}
];

React.render(<FilterableChatTable chats={SAMPLE} />, document.getElementById('container'));
