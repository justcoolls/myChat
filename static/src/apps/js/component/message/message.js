'use strict';
Object.defineProperty(exports, "__esModule", {
    value: true
});
import React from 'react';
import ReactDOM from "react-dom";

class App extends React.Component {
    constructor() {
        super();
        this.add = this.add.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.remove = this.remove.bind(this);
        this.onClose = this.onClose.bind(this);
        this.state = {
            nodes: [],
        };
    }

    add(node){
        const nodes = this.state.nodes;
        node.class = 'move-up-enter';
        nodes.push(node);
        this.setState({
            nodes
        });

    };
    onRemove(node){
        const self=this;
        setTimeout(function(){
            self.remove(node.key);
        }, node.duration * 1000);
    };
    remove (key) {
        const self=this;
        const nodeStart = self.state.nodes;
        const len = nodeStart.length;
        let onClose;
        for (let i = 0; i < len; i++) {
            if (nodeStart[i].key === key) {
                nodeStart[i].class = 'move-up-leave';
                onClose = nodeStart[i].onClose;
                break;
            }
        }
        self.setState({
            nodes: nodeStart
        }, function() {
            setTimeout(function() {
                self.onClose(onClose);
                const nodes = self.state.nodes.filter(
                    function (item) {
                        return item.key !== key;
                    });
                self.setState({
                    nodes
                });
            }, 300);
        });
    };
    onClose (onClose){
        return onClose();
    };

    render() {
        const {nodes} = this.state;
        return (
            <div>
                {nodes.map((node) => {
                    return <div key={node.key} className={`message-li  ${node.class}`}>
                        <div className='message-node'>
                            {node.content}
                        </div>
                    </div>
                })}
            </div>

        )
    }
}

App.newMessage = function(className, callback){
    function ref(app) {
        callback({
            notice(noticeProps) {
                app.add(noticeProps);
                app.onRemove(noticeProps);
            },
        })

    }

    ReactDOM.render(<App ref={ref}/>, document.getElementById(className));
};

export default App;