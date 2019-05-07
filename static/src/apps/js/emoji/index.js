import React from 'react';
import './style.less'

const path = '/public/img/arclist/';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emojiList: [
                {
                    key: "row1",
                    children: [
                        {title: "微笑", url: path + 'ab1.png'},
                        {title: "脸红", url: path + 'ab2.png'},
                        {title: "偷笑", url: path + 'ab3.png'},
                        {title: "耶", url: path + 'ab4.png'},
                        {title: "害羞", url: path + 'ab5.png'},
                        {title: "吐舌", url: path + 'ab6.png'},
                        {title: "捂脸", url: path + 'ab7.png'},
                        {title: "抠鼻", url: path + 'ab8.png'},
                        {title: "摸头", url: path + 'ab9.png'},
                        {title: "大白眼", url: path + 'ac0.png'},
                        {title: "门牙", url: path + 'ac1.png'},

                    ]
                },
                {
                    key: "row2",
                    children: [
                        {title: "惊喜", url: path + 'ac2.png'},
                        {title: "闭嘴", url: path + 'ac3.png'},
                        {title: "给力", url: path + 'ac4.png'},
                        {title: "泪奔", url: path + 'ac5.png'},
                        {title: "拽", url: path + 'ac6.png'},
                        {title: "泣不成声", url: path + 'ac7.png'},
                        {title: "灵光一闪", url: path + 'ac8.png'},
                        {title: "哭笑", url: path + 'ac9.png'},
                        {title: "色", url: path + 'aca.png'},
                        {title: "打脸", url: path + 'acb.png'},
                        {title: "大笑", url: path + 'acc.png'},
                    ]
                },
                {
                    key: "row3",
                    children: [
                        {title: "哈欠", url: path + 'acd.png'},
                        {title: "惊吓", url: path + 'ace.png'},
                        {title: "爱慕", url: path + 'acf.png'},
                        {title: "困", url: path + 'acg.png'},
                        {title: "疑问", url: path + 'ach.png'},
                        {title: "鼓掌", url: path + 'acj.png'},
                        {title: "尴尬", url: path + 'ack.png'},
                        {title: "流鼻", url: path + 'acl.png'},
                        {title: "吓死", url: path + 'acn.png'},
                        {title: "思考", url: path + 'aco.png'},
                        {title: "吐血", url: path + 'acp.png'},

                    ]
                },
                {
                    key: "row4",
                    children: [
                        {title: "可怜", url: path + 'acq.png'},
                        {title: "禁声", url: path + 'acr.png'},
                        {title: "撇嘴", url: path + 'acs.png'},
                        {title: "汗", url: path + 'act.png'},
                        {title: "苦笑", url: path + 'acu.png'},
                        {title: "雾霾", url: path + 'acv.png'},
                        {title: "奸笑", url: path + 'acx.png'},
                        {title: "得意", url: path + 'acy.png'},
                        {title: "坏笑", url: path + 'acz.png'},
                        {title: "抓狂", url: path + 'ad0.png'},
                        {title: "金钱", url: path + 'ad2.png'}
                    ]
                }, {
                    key: "row5",
                    children: [
                        {title: "亲亲", url: path + 'ad3.png'},
                        {title: "害怕", url: path + 'ad4.png'},
                        {title: "傻笑", url: path + 'ad5.png'},
                        {title: "快哭了", url: path + 'ad6.png'},
                        {title: "白眼", url: path + 'ad8.png'},
                        {title: "大哭", url: path + 'adh.png'},
                        {title: "委屈", url: path + 'adk.png'},
                        {title: "舔屏", url: path + 'adl.png'},
                        {title: "鄙视", url: path + 'adm.png'},
                        {title: "爱你", url: path + 'adn.png'},
                        {title: "再见", url: path + 'ado.png'}
                    ]
                }, {
                    key: "row6",
                    children: [
                        {title: "挖鼻", url: path + 'adp.png'},
                        {title: "吃瓜", url: path + 'ae2.png'},
                        {title: "呲牙", url: path + 'ae3.png'},
                        {title: "绿帽子", url: path + 'ae4.png'},
                        {title: "晕", url: path + 'ae6.png'},
                        {title: "坚定", url: path + 'ae7.png'},
                        {title: "汗颜", url: path + 'ae8.png'},
                        {title: "牛逼", url: path + 'aeb.png'},
                        {title: "来么么", url: path + 'aec.png'},
                        {title: "砸头", url: path + 'aeg.png'},
                        {title: "努力", url: path + 'aeh.png'}
                    ]
                }

            ],
            visible: false,
            active: "",
        }
    }

    componentDidMount() {

    }
    emojiShow=(event)=>{
        const {visible}=this.state;
        if (!visible) {
            this.setState({
                visible: true,
                active: "enter",
            });
            document.addEventListener('click',this.hide,false);
        } else {
            this.setState({
                active: "leave",
            }, () => {
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },400)
            })
        }
    };
    hide=()=>{
        this.setState({
            active: "leave",
        }, () => {
            setTimeout(()=>{
                this.setState({
                    visible: false,
                })
            },400)
        });
        document.removeEventListener('click',this.hide,false)
    };
    stopBubble=(event)=>{
        if(event && event.stopPropagation){
            event.preventDefault();
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
        }else{
            window.event.cancelBubble=true; //IE
        }
    };
    emojiList=(event)=>{
        this.stopBubble(event);
    };
    emojiChoose=(title)=>{
        this.props.onOk(title);
        this.hide();
    };
    render() {
        const {emojiList,visible, active} = this.state;
        return (
            <div className="emoji">
                <div className="message-icon " onClick={this.emojiShow}>
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icon-xiao"/>
                    </svg>
                </div>
                {visible ?
                <div onClick={this.emojiList} className={`emoji-list ${active}`}>
                    {emojiList.map((row) => {
                        return <div className="emoji-row" key={row.key}>
                            {row.children.map((item, index) => {
                                return <div key={index} onClick={()=>this.emojiChoose(item.title)} className="emoji-img">
                                    <img style={{width: 32, height: 32}} src={item.url}/>
                                </div>
                            })}
                        </div>
                    })}
                </div>:""}
            </div>
        )

    }
}

export default App;