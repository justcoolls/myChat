import React from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');
var data=[{
    key: 1,
    name:"张三",
    mes:"你好"
},{
    key: 2,
    name:"lisi",
    mes:"nihao"
}]
socket.on('chats', msg => {
    console.log(msg);
    let headPortrait="<div class='headPortrait message-other'></div>"
    let myMessage=msg;
    console.log("mes:"+myMessage);
    let myMessageList=`<li class='message-li'>${headPortrait}<span class='message-other'>${myMessage}</span></li>`;
    // $('.message-list').append(myMessageList);

});
class App extends React.Component{
    state={

    };
    addmessage=(item)=>{
        return (
            <li className='message-li' key={item.key}>
                <div className='headPortrait message-other'/>
                <span className='message-other'>{ item.mes }</span>
            </li>
        )
    }
    keyLogin=(e)=>{
            if(e.shiftKey && e.keyCode==13){

            }else if (e.keyCode==13) {
                console.log("val:"+this.refs.nametext.value);
                event.preventDefault();
                let headPortrait="<div class='headPortrait message-my'></div>"
                let myMessage=this.refs.nametext.value;

                socket.emit('chats', myMessage);
                this.refs.nametext.value="";
            }
    };



    render(){
        return(
            <div>
                <div className="message-window">
                    <div className="message-head">  </div>
                    <div>
                        <div className="message-group"></div>
                        <div className="message-body">
                            <div className="message-list-border">
                                <div ref="message-list" className="message-list">
                                    { data.map((item) => {
                                        return (
                                            <li className='message-li' key={item.key}>
                                                <div className='headPortrait message-other'/>
                                                <span className='message-other'>{ item.mes }</span>
                                            </li>
                                        )
                                    }) }

                                </div>
                            </div>
                            <div className="message-in">
                                <textarea ref="nametext" onKeyDown={this.keyLogin} className="message-input"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;



