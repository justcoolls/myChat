const mongoose =require('mongoose');
const config=require('../config/config');
const DB_URL = config.mongodb;
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    myMes:String,
    group:String,
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
const userDao=  mongoose.model('mychat', userSchema);
mongoose.connect(DB_URL,options);
module.exports ={
    messageSave: async function(formData){
        let name = formData.name;
        let myMes = formData.Mes;
        let group = formData.group;
        let new_user = new userDao({
            name:name,
            myMes: myMes,
            group:group,
            _enabled:false
        });
        return new Promise(( resolve, reject ) => {
            new_user.save(function(err,data){
                if (err) {
                    reject(err);
                }
                else {
                    resolve('suc')
                }
            });
        });
    },
    messageFind:async function(formData){
        let count=formData.mess;
        let group=formData.group;
        try {
            return await  userDao.find({group:group}, null,
                {
                    sort: {
                    createTime: -1, //倒序 desc
                    },
                    limit: count
                });
        } catch (e) {
            console.log(e);
        }
    },
    messagelast:async function(formData){
        let group=formData;
        try {
            return await  userDao.findOne({group:group}, null,
                {
                    sort: {
                        createTime: -1, //倒序 desc
                    }
                });
        } catch (e) {
            console.log(e);
        }
    },

};