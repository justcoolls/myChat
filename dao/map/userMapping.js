/**
 * Created by CHEN on 2016/8/8.
 */
var user = {
    userDao:"select * from user WHERE name=? and pwd=?"
};

module.exports = user;