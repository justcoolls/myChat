const mongoose =require('mongoose');
const crypto = require("crypto");
const config=require('../config/config');
const DB_URL = config.mongodb;
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    password:String,
    avatar:String,
    groups:Array,
    sex:String,
    location:String,
    age:String,
    email:String,
    gitHub:String,
    personalWeb:String,
    _enabled:Boolean,
    createTime: {
        type: Date,
        default: Date.now
    }
});
const options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
const userDao=  mongoose.model('users', userSchema);
mongoose.connect(DB_URL,options);
module.exports ={
    login: async (formData)=>{
        let name = formData.userName;
        let password = formData.pwd;
        let md5 = crypto.createHash("md5");
        let newPas = md5.update(password).digest("hex");
        let namePwd = {name: name,password: newPas};
        try {
            return await  userDao.findOne(namePwd);
        } catch (e) {
            console.log(e);
        }
    },
    verifyUser:async (formData)=>{
        let name = formData.userName;
        let namePwd = {name: name};
        try {
            return await  userDao.findOne(namePwd);
        } catch (e) {
            console.log(e);
        }
    },
    register: async (formData)=>{
            let name = formData.userName;
            let password = formData.pwd;
            let md5 = crypto.createHash("md5");
            let newPas = md5.update(password).digest("hex");
            let avatar= Math.floor(Math.random()*35+1).toString();
            let avataradd= "/public/img/avatar/default/"+avatar+".jpg";
            let myDate = new Date()
            let age =myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
            let new_user = new userDao({
                name:name,
                password: newPas,
                avatar:avataradd,
                groups:'talk',
                age:age,
                _enabled:false
            });
            return new Promise(( resolve, reject ) => {
                    new_user.save((err)=>{
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve('suc')
                        }
                    });
            });
    },
    informa:async (formData)=>{
        let name = formData;
        let namePwd = {name: name};
        try {
            return await  userDao.find(namePwd,["avatar"]);
        } catch (e) {
            console.log(e);
        }

    },
    userinform:async (formData)=>{
        let name = formData;
        let namePwd = {name: name};
        try {
            return await  userDao.find(namePwd,["name","avatar","sex","location","age","email","gitHub","personalWeb"]);
        } catch (e) {
            console.log(e);
        }

    },
    updateform:async(data)=>{
        let users = data.user;
        let sex = data.sex;
        let location = data.location;
        let age = data.age;
        let email = data.email;
        let gitHub = data.gitHub;
        let personalWeb = data.personalWeb;
        return new Promise(( resolve, reject ) => {
            userDao.updateOne({name: users}, {$set:{sex:sex,location:location,age:age,email:email,gitHub:gitHub,personalWeb:personalWeb}},function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve("suc")
                }
            });
        });
    },
    groupList:async (formData)=>{

        let name = formData;
        let namePwd = {name: name};
        try {
            return await  userDao.findOne(namePwd,["groups"]);
        } catch (e) {
            console.log(e);
        }

    },
    addGroup:async(data)=>{
        let groupname = data.name;
        let users = data.user;
        return new Promise(( resolve, reject ) => {
            userDao.updateOne({name: users}, {$addToSet:{groups:groupname}},function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve("suc")
                }
            });
        });
    },
    outGroup:async(data)=>{
        let groupname = data.name;
        let users = data.user;
        return new Promise(( resolve, reject ) => {
            userDao.updateOne({name: users}, {$pull:{groups:groupname}},function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }

};