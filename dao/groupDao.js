const mongoose =require('mongoose');
const config=require('../config/config');
const DB_URL = config.mongodb;
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    groupname:{type:String,unique:true,dropDups: true},
    avatar:String,
    users:Array,
    owner:String,
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
const userDao=  mongoose.model('groups', userSchema);
mongoose.connect(DB_URL,options);
module.exports={
    groupfind:async(data)=>{
        let name = data;
        return new Promise(( resolve, reject ) => {
            userDao.findOne({groupname: name},function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data)
                }
            });
        });
    },
    grouplimit:async(data)=>{
        let name = data;
        return new Promise(( resolve, reject ) => {
            userDao.find({owner: name},function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data)
                }
            });
        });
    },
    groupGreat:async(data)=>{
        let name = data.name;
        let users = data.user;
        let avatar= Math.floor(Math.random()*12+1).toString();
        let avataradd= "/public/img/avatar/default/"+avatar+".jpg";
        let new_user = new userDao({
            groupname:name,
            avatar:avataradd,
            users: users,
            owner:users,
            _enabled:false
        });
        return new Promise(( resolve, reject ) => {
            new_user.save(function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve("suc")
                }
            });
        });
    },

    addGroup:async(data)=>{
        let name = data.name;
        let users = data.user;
        return new Promise(( resolve, reject ) => {
            userDao.updateOne({groupname: name}, {$addToSet:{users:users}},function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    },
    outGroup:async(data)=>{
        let name = data.name;
        let users = data.user;
        return new Promise(( resolve, reject ) => {
            userDao.updateOne({groupname: name}, {$pull:{users:users}},function(err,data){
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