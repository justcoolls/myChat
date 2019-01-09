const path='/public/img/arclist/';
const emoji={
    emojilist : [
        {
            key:"row1",
            children: [
                {title:"微笑",url:path+'ab1.png'},
                {title:"脸红",url:path+'ab2.png'},
                {title:"偷笑",  url:path+'ab3.png'},
                {title:"耶",url:path+'ab4.png'},
                {title:"害羞",url:path+'ab5.png'},
                {title:"吐舌",url:path+'ab6.png'},
                {title:"捂脸",url:path+'ab7.png'},
                {title:"抠鼻",url:path+'ab8.png'},
                {title:"摸头",url:path+'ab9.png'},
                {title:"大白眼",url:path+'ac0.png'},
                {title:"门牙",url:path+'ac1.png'},

            ]},
        {
            key:"row2",
            children:[
                {title:"惊喜",url:path+'ac2.png'},
                {title:"闭嘴",url:path+'ac3.png'},
                {title:"给力",url:path+'ac4.png'},
                {title:"泪奔",url:path+'ac5.png'},
                {title:"拽",url:path+'ac6.png'},
                {title:"泣不成声",  url:path+'ac7.png'},
                {title:"灵光一闪",url:path+'ac8.png'},
                {title:"哭笑",url:path+'ac9.png'},
                {title:"色",url:path+'aca.png'},
                {title:"打脸",url:path+'acb.png'},
                {title:"大笑",url:path+'acc.png'},
            ]},
        {
            key:"row3",
            children:[
                {title:"哈欠",url:path+'acd.png'},
                {title:"惊吓",url:path+'ace.png'},
                {title:"爱慕",url:path+'acf.png'},
                {title:"困",  url:path+'acg.png'},
                {title:"疑问",url:path+'ach.png'},
                {title:"鼓掌",url:path+'acj.png'},
                {title:"尴尬",url:path+'ack.png'},
                {title:"流鼻",url:path+'acl.png'},
                {title:"吓死",url:path+'acn.png'},
                {title:"思考",url:path+'aco.png'},
                {title:"吐血",url:path+'acp.png'},

            ]
        },
        {
            key:"row4",
            children:[
                {title:"可怜",url:path+'acq.png'},
                {title:"禁声",url:path+'acr.png'},
                {title:"撇嘴",url:path+'acs.png'},
                {title:"汗",url:path+'act.png'},
                {title:"苦笑",url:path+'acu.png'},
                {title:"雾霾",url:path+'acv.png'},
                {title:"奸笑",url:path+'acx.png'},
                {title:"得意",url:path+'acy.png'},
                {title:"坏笑",url:path+'acz.png'},
                {title:"抓狂",url:path+'ad0.png'},
                {title:"金钱",url:path+'ad2.png'}
            ]
        }, {
            key:"row5",
            children:[
                {title:"亲亲",url:path+'ad3.png'},
                {title:"害怕",url:path+'ad4.png'},
                {title:"傻笑",url:path+'ad5.png'},
                {title:"快哭了",url:path+'ad6.png'},
                {title:"白眼",url:path+'ad8.png'},
                {title:"大哭",url:path+'adh.png'},
                {title:"委屈",url:path+'adk.png'},
                {title:"舔屏",url:path+'adl.png'},
                {title:"鄙视",url:path+'adm.png'},
                {title:"爱你",url:path+'adn.png'},
                {title:"再见",url:path+'ado.png'}
            ]
        }, {
            key:"row6",
            children:[
                {title:"挖鼻",url:path+'adp.png'},
                {title:"吃瓜",url:path+'ae2.png'},
                {title:"呲牙",url:path+'ae3.png'},
                {title:"绿帽子",url:path+'ae4.png'},
                {title:"晕",url:path+'ae6.png'},
                {title:"坚定",url:path+'ae7.png'},
                {title:"汗颜",url:path+'ae8.png'},
                {title:"牛逼",url:path+'aeb.png'},
                {title:"来么么",url:path+'aec.png'},
                {title:"砸头",url:path+'aeg.png'},
                {title:"努力",url:path+'aeh.png'}
            ]
        }

    ],
    emojishow:  (str)=>{
        if(str){
            let emon=str.match(/\[([\u4e00-\u9fa5]*)\]/g);
            let url="";
            if(emon!=null){
                let  emonlen=emon.length;
                let patt=/\[([\u4e00-\u9fa5]*)\]/;
                for(let i=0;i<emonlen;i++){
                    switch (emon[i]){
                        case "[微笑]":
                            url =`<img class='emojili' src="/public/img/arclist/ab1.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[脸红]":
                            url =`<img class='emojili' src="/public/img/arclist/ab2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[偷笑]":
                            url =`<img class='emojili' src="/public/img/arclist/ab3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[耶]":
                            url =`<img class='emojili' src="/public/img/arclist/ab4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[害羞]":
                            url =`<img class='emojili' src="/public/img/arclist/ab5.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吐舌]":
                            url =`<img class='emojili' src="/public/img/arclist/ab6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[捂脸]":
                            url =`<img class='emojili' src="/public/img/arclist/ab7.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[抠鼻]":
                            url =`<img class='emojili' src="/public/img/arclist/ab8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[摸头]":
                            url =`<img class='emojili' src="/public/img/arclist/ab9.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[大白眼]":
                            url =`<img class='emojili' src="/public/img/arclist/ac0.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[门牙]":
                            url =`<img class='emojili' src="/public/img/arclist/ac1.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[惊喜]":
                            url =`<img class='emojili' src="/public/img/arclist/ac2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[闭嘴]":
                            url =`<img class='emojili' src="/public/img/arclist/ac3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[给力]":
                            url =`<img class='emojili' src="/public/img/arclist/ac4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[泪奔]":
                            url =`<img class='emojili' src="/public/img/arclist/ac5.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[拽]":
                            url =`<img class='emojili' src="/public/img/arclist/ac6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[泣不成声]":
                            url =`<img class='emojili' src="/public/img/arclist/ac7.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[灵光一闪]":
                            url =`<img class='emojili' src="/public/img/arclist/ac8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[哭笑]":
                            url =`<img class='emojili' src="/public/img/arclist/ac9.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[色]":
                            url =`<img class='emojili' src="/public/img/arclist/aca.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[打脸]":
                            url =`<img class='emojili' src="/public/img/arclist/acb.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[大笑]":
                            url =`<img class='emojili' src="/public/img/arclist/acc.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[哈欠]":
                            url =`<img class='emojili' src="/public/img/arclist/acd.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[惊吓]":
                            url =`<img class='emojili' src="/public/img/arclist/ace.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[爱慕]":
                            url =`<img class='emojili' src="/public/img/arclist/acf.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[困]":
                            url =`<img class='emojili' src="/public/img/arclist/acg.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[疑问]":
                            url =`<img class='emojili' src="/public/img/arclist/ach.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[鼓掌]":
                            url =`<img class='emojili' src="/public/img/arclist/acj.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[尴尬]":
                            url =`<img class='emojili' src="/public/img/arclist/ack.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[流鼻]":
                            url =`<img class='emojili' src="/public/img/arclist/acl.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吓死]":
                            url =`<img class='emojili' src="/public/img/arclist/acn.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[思考]":
                            url =`<img class='emojili' src="/public/img/arclist/aco.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吐血]":
                            url =`<img class='emojili' src="/public/img/arclist/acp.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[可怜]":
                            url =`<img class='emojili' src="/public/img/arclist/acq.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[禁声]":
                            url =`<img class='emojili' src="/public/img/arclist/acr.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[撇嘴]":
                            url =`<img class='emojili' src="/public/img/arclist/acs.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[汗]":
                            url =`<img class='emojili' src="/public/img/arclist/act.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[苦笑]":
                            url =`<img class='emojili' src="/public/img/arclist/acu.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[雾霾]":
                            url =`<img class='emojili' src="/public/img/arclist/acv.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[奸笑]":
                            url =`<img class='emojili' src="/public/img/arclist/acx.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[得意]":
                            url =`<img class='emojili' src="/public/img/arclist/acy.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[坏笑]":
                            url =`<img class='emojili' src="/public/img/arclist/acz.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[抓狂]":
                            url =`<img class='emojili' src="/public/img/arclist/ad0.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[金钱]":
                            url =`<img class='emojili' src="/public/img/arclist/ad2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[亲亲]":
                            url =`<img class='emojili' src="/public/img/arclist/ad3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[害怕]":
                            url =`<img class='emojili' src="/public/img/arclist/ad4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[傻笑]":
                            url =`<img class='emojili' src="/public/img/arclist/ad5.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[快哭了]":
                            url =`<img class='emojili' src="/public/img/arclist/ad6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[白眼]":
                            url =`<img class='emojili' src="/public/img/arclist/ad8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[大哭]":
                            url =`<img class='emojili' src="/public/img/arclist/adh.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[委屈]":
                            url =`<img class='emojili' src="/public/img/arclist/adk.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[舔屏]":
                            url =`<img class='emojili' src="/public/img/arclist/adl.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[鄙视]":
                            url =`<img class='emojili' src="/public/img/arclist/adm.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[爱你]":
                            url =`<img class='emojili' src="/public/img/arclist/adn.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[再见]":
                            url =`<img class='emojili' src="/public/img/arclist/ado.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[挖鼻]":
                            url =`<img class='emojili' src="/public/img/arclist/adp.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吃瓜]":
                            url =`<img class='emojili' src="/public/img/arclist/ae2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[呲牙]":
                            url =`<img class='emojili' src="/public/img/arclist/ae3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[绿帽子]":
                            url =`<img class='emojili' src="/public/img/arclist/ae4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[晕]":
                            url =`<img class='emojili' src="/public/img/arclist/ae6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[坚定]":
                            url =`<img class='emojili' src="/public/img/arclist/ae7.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[汗颜]":
                            url =`<img class='emojili' src="/public/img/arclist/ae8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[牛逼]":
                            url =`<img class='emojili' src="/public/img/arclist/aeb.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[来么么]":
                            url =`<img class='emojili' src="/public/img/arclist/aec.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[砸头]":
                            url =`<img class='emojili' src="/public/img/arclist/aeg.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[努力]":
                            url =`<img class='emojili' src="/public/img/arclist/aeh.png">`;
                            str = str.replace(patt,url);
                            break;
                    }
                }
            }
        }

        return str
    }
};

module.exports = emoji;