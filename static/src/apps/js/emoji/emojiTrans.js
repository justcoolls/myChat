const emoji={
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
                            url =`<img class='emojiLi' src="/public/img/arclist/ab1.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[脸红]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[偷笑]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[耶]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[害羞]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab5.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吐舌]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[捂脸]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab7.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[抠鼻]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[摸头]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ab9.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[大白眼]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac0.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[门牙]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac1.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[惊喜]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[闭嘴]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[给力]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[泪奔]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac5.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[拽]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[泣不成声]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac7.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[灵光一闪]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[哭笑]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ac9.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[色]":
                            url =`<img class='emojiLi' src="/public/img/arclist/aca.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[打脸]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acb.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[大笑]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acc.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[哈欠]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acd.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[惊吓]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ace.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[爱慕]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acf.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[困]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acg.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[疑问]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ach.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[鼓掌]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acj.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[尴尬]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ack.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[流鼻]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acl.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吓死]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acn.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[思考]":
                            url =`<img class='emojiLi' src="/public/img/arclist/aco.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吐血]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acp.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[可怜]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acq.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[禁声]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acr.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[撇嘴]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acs.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[汗]":
                            url =`<img class='emojiLi' src="/public/img/arclist/act.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[苦笑]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acu.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[雾霾]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acv.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[奸笑]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acx.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[得意]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acy.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[坏笑]":
                            url =`<img class='emojiLi' src="/public/img/arclist/acz.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[抓狂]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ad0.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[金钱]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ad2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[亲亲]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ad3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[害怕]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ad4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[傻笑]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ad5.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[快哭了]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ad6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[白眼]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ad8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[大哭]":
                            url =`<img class='emojiLi' src="/public/img/arclist/adh.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[委屈]":
                            url =`<img class='emojiLi' src="/public/img/arclist/adk.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[舔屏]":
                            url =`<img class='emojiLi' src="/public/img/arclist/adl.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[鄙视]":
                            url =`<img class='emojiLi' src="/public/img/arclist/adm.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[爱你]":
                            url =`<img class='emojiLi' src="/public/img/arclist/adn.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[再见]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ado.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[挖鼻]":
                            url =`<img class='emojiLi' src="/public/img/arclist/adp.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[吃瓜]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ae2.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[呲牙]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ae3.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[绿帽子]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ae4.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[晕]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ae6.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[坚定]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ae7.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[汗颜]":
                            url =`<img class='emojiLi' src="/public/img/arclist/ae8.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[牛逼]":
                            url =`<img class='emojiLi' src="/public/img/arclist/aeb.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[来么么]":
                            url =`<img class='emojiLi' src="/public/img/arclist/aec.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[砸头]":
                            url =`<img class='emojiLi' src="/public/img/arclist/aeg.png">`;
                            str = str.replace(patt,url);
                            break;
                        case "[努力]":
                            url =`<img class='emojiLi' src="/public/img/arclist/aeh.png">`;
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