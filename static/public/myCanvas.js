/**
 * Created by Administrator on 2017/12/28 0028.
 */
let c=document.getElementById("myCanvas");
let ctx=c.getContext("2d");

function watch(){
    ctx.save();
    ctx.translate(150,150);
    ctx.beginPath();
    ctx.arc(0,0,120,0,2*Math.PI,false);
    ctx.closePath();
    ctx.strokeStyle="#eee";
    ctx.lineWidth=8;
    ctx.stroke();
    ctx.font="18px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillStyle="#eee";
    let hourNUmbers=[3,4,5,6,7,8,9,10,11,12,1,2];
    hourNUmbers.forEach(function (num,i){
        let rad=2*Math.PI/12*i;
        let x=Math.cos(rad)*100;
        let y=Math.sin(rad)*100;
        ctx.fillText(num,x,y)
    });

};

function needleHour(hour,minute){
    ctx.save();
    ctx.beginPath();
    ctx.lineCap="round";
    ctx.strokeStyle="#8c8a8a";
    let rad=2*Math.PI/12*hour;
    let mrad=2*Math.PI/12/60*minute;
    ctx.rotate(rad+mrad);
    ctx.lineWidth=5;
    ctx.moveTo(0,10);
    ctx.lineTo(0,-70);
    ctx.stroke();
    ctx.restore();
};
function needleMinute(minute){
    ctx.save();
    ctx.beginPath();
    ctx.lineCap="round";
    ctx.strokeStyle="#8c8a8a";
    let rad=2*Math.PI/60*minute;
    ctx.rotate(rad);
    ctx.lineWidth=3.5;
    ctx.moveTo(0,10);
    ctx.lineTo(0,-85);
    ctx.stroke();
    ctx.restore();
};

function needleSecond(second){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle="#ef7b7b";
    let rad=2*Math.PI/60*second;
    ctx.rotate(rad);
    ctx.lineWidth=1;
    ctx.moveTo(-2,20);
    ctx.lineTo(2,20);
    ctx.lineTo(1,-90);
    ctx.lineTo(-1,-90);
    ctx.fill();
    ctx.restore();
};
function drawTime(){
    ctx.clearRect(0,0,300,300);
    let now=new Date();
    let hour=now.getHours();
    let minute=now.getMinutes();
    let second=now.getSeconds();
    watch();
    needleHour(hour,minute);
    needleMinute(minute);
    needleSecond(second);
    ctx.restore();

};

drawTime();
setInterval(drawTime,1000);



ctx.fillText("1",150,150);
ctx.font=15;