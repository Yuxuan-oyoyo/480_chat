var CurrentUser = "bob"
var get_data = []

var LeftUser = React.createClass({
    render: function() {
        var DisplayName = (this.props.data.user1 == CurrentUser) ? this.props.data.user2: this.props.data.user1;

        return (
            <li className="thread-list-item" onClick={this.props.handleClickOnLeftUser.bind(null, this.props.data)}>
                <h5 className="thread-name"> {DisplayName} </h5>  
                <div className="thread-time">
                    {this.props.data.lastMsgTimeStamp}
                </div>
                <div className="thread-last-message">
                    {this.props.data.lastMessage}
                </div>
            </li>
        );
    }
});

// WORKINGON
var LeftUserList = React.createClass({

    render: function() {
        console.log("= = = LeftUserList Render = = =")
        
        var parentProps = this.props;
        var userNodes = this.props.chats.map(function(data){
            return (
                <LeftUser data={data} handleClickOnLeftUser={parentProps.clickFunc} key={data.chatID}> </LeftUser>
            )
        })

        console.log("= = = = = = = = = = = = = = = = = = = = = = ")

        return (
            <ul className="thread-list">
                {userNodes}
            </ul>

        );
    }
});







var RightMessage = React.createClass({
    render: function(){

        return (
            <li className="message-list-item">
                <h5 className="message-author-name"> {this.props.msg.author} </h5>
                <div className="message-time">

                </div>
                <div className="message-text"> {this.props.msg.content}</div>
            </li>

  
        )
    }
})

var RightMessageComposerBox = React.createClass({
    //WORKINGON
    getInitialState: function() {
        return {text: 'type your message here!'};
    },
    handleChange: function(event) {
        this.setState({text: event.target.value});
    },
    handleKeyDown: function(evt) {
        if (evt.keyCode == 13 ) { //code 13 enter
            // console.log("press enter");
            // console.log(evt.target.value);
            //$.post(URL,data,callback);
            /*
            $.post("localhost:8080/messages",evt.target.value, function () {
                console.log('success')
            } )
            */
            event.preventDefault()
            var text = this.state.text.trim();
            if (text)
            {
                console.log("handle composer [enter]")
                var threadID = this.props.thread.chatID
                var datetime = Date.now()
                //ChatMessageActionCreators.createMessage(text, this.props.threadID);
                    //chatappdispatcher.dispatch
                var message = { chatID: threadID, 
                                author: CurrentUser,
                                content: text,
                                timeStamp: datetime
                                }
                console.log(message)

                // push to server 
                // callback to server to refresh                
            }
            this.setState({text: ''})

        }
    },
    render: function(){
        return(
            <div >
                <textarea className="message-composer" value={this.state.text} onChange={this.handleChange} onKeyDown={this.handleKeyDown}/>
            </div>
        )
    }
})

var RightMessageBox = React.createClass({
    //         <RightMessageBox chat={this.props.chats[{this.state.chatID}]} />
    //var j = (this.props.chat.user1 == CurrentUser) ? this.props.chat.user2: this.props.chat.user1;

    render: function() {
        console.log("user 1 is " + this.props.chat.user1)
        var j = (this.props.chat.user1 == CurrentUser) ? this.props.chat.user2: this.props.chat.user1;

        // WORKINGON
        var sortedMessages;
        var msgNodes;
        if (this.props.chat.user1 !== undefined) {
            sortedMessages = this.props.chat.messages.sort(function(a,b){
                return a.timeStamp - b.timeStamp
            })
            msgNodes = sortedMessages.map(function(msg){
                return (
                    <RightMessage msg={msg} key={msg.msgID}> </RightMessage>
                )
            })    
        } else {
            msgNodes = "not selected yet"
        }
        

        return(
            <div className="message-section">
                <h3 className="message-thread-heading">{j}</h3>
                <div className="message-list" ref="messageList">
                   {msgNodes}
                </div>
                <RightMessageComposerBox thread={this.props.chat}></RightMessageComposerBox>

            </div>
        )
    }
})

// PARENT component
var MainChat = React.createClass({
    getInitialData: function(){
        var url = "http://127.0.0.1/test/sampledata.php?user="+CurrentUser;
        $.get(url, function(data, status) {
            this.setState({chats: data})    
        }.bind(this))
    },
    getAjaxUpdates: function() {
        var url = "http://127.0.0.1/test/samplepolldata.php?user="+CurrentUser;
        $.get(url, function(data, status) {
            this.setState({chats: data})    
        }.bind(this))
    },
    componentDidMount: function(){
        this.getInitialData();
        setInterval(this.getAjaxUpdates, 2000); // Call a method on the mixin
    },
    getInitialState: function() {
        return {
            chatId : "",
            chats : [],
            //chats: this.props.chats
        };
    },
    handleClickOnLeftUser: function(data){
        console.log("handleClickOnLeftUser");
        // console.log("chat id is"); 
        // console.log(data.chatID); 
        this.setState({chatID: data.chatID});
    },

    render: function() {
        console.log("main:render")
        console.log(this.props.chats);


        var theThreadIWantToPass = {};
        for(var i = 0; i < this.state.chats.length; i++)
        {
            console.log("chat: " + this.state.chats[i].chatID);
            if (this.state.chats[i].chatID === this.state.chatID) {
                theThreadIWantToPass = this.state.chats[i];
                break;
            }
        }

        return (
            <div className="chatapp">
                <div className="thread-section">
                    <div className="thread-count">
  
                    </div>
                    <LeftUserList
                        chats={this.state.chats}
                        clickFunc={this.handleClickOnLeftUser} // ***important
                    />
                </div>
                <div>
                    <RightMessageBox chat={theThreadIWantToPass} />
                </div>
            </div>
        );
    }
});

// ASSUMPTION: this view belongs to luning how do we display only his chats

// for simplicity, sort before passing it to react render?
// TODO highlight currently selected chat?
// TODO checkbox to filter all unread?
var SAMPLE = [

        // log in as bob
        { 
            user1:"bob", 
            user2:"anyu", 
            seen: false, 
            chatID:1, 
            messages: [
                {
                    author: "anyu",
                    msgID: 1,
                    content: "hey bob",
                    timeStamp: 1
                },{
                    author: "bob",
                    msgID: 2,
                    content: "hello anyu",
                    timeStamp: 2
                },{
                    author: "anyu",
                    msgID: 3,
                    content: "thank you for today man",
                    timeStamp: 3
                }
            ], 
            lastMsgTimeStamp: 0, 
            lastMessage:"thank you for today man"
        },

        { 
            user1:"bob", 
            user2:"luning", 
            seen: true, 
            chatID:"2", 
            messages: [
                {
                    author: "bob",
                    msgID: 1,
                    content: "hello luning",
                    timeStamp: 1
                },{
                    author: "luning",
                    msgID: 2,
                    content: "hey bob",
                    timeStamp: 2
                },{
                    author: "luning",
                    msgID: 3,
                    content: "whats up?",
                    timeStamp: 3
                }
            ], 
            lastMsgTimeStamp: 0, 
            lastMessage:"whats up?"
        },
    ];

        console.log("test for jquery")
        console.log(typeof jQuery)




React.render(<MainChat chats={SAMPLE} />, document.getElementById('container'));








