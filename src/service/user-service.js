/*
* @Author: SUNNERCMS
* @Date:   2018-04-07 21:20:48
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-13 12:58:30
*/
var _mm = require('util/mm.js');
var _user={
    //用户登录
    login : function(userInfo,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/login.do'),//???
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject
        });
    },
    //注册用户名验证
    checkUsername : function(username,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/check_valid.do'),//check_valid.do接口不仅可以使用username，还可以使用phone,email
            method  : 'POST',
            data    : {
               type :'username',//字符串表示数据的类型
               str  : username  //数据的值是传进来的用户名栏中的值
            },
            success : resolve,
            error   : reject
        });
    },
    //用户注册接口
    register : function(userInfo,resolve,reject){
            _mm.request({
            url     : _mm.getServerUrl('/user/register.do'),
            method  : 'POST',
            data    : userInfo,
            success : resolve,
            error   : reject
        });
    },

    //检查登录状态
    checkLogin : function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/get_user_info.do'),//???
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //获取用户密码提示问题
    getQuestion : function(username,resolve,reject){

            _mm.request({
            url     : _mm.getServerUrl('/user/forget_get_question.do'),
            method  : 'POST',
            data    : {
                username:username
            },
            success : resolve,
            error   : reject
        });

    },
    //检查密码提示问题的答案
    checkAnswer : function(userInfo,resolve,reject){
            _mm.request({
            url     : _mm.getServerUrl('/user/forget_check_answer.do'),
            method  : 'POST',
            data    :userInfo,
            success : resolve,
            error   : reject
        });
    },
    //重置密码
    resetPassword : function(userInfo,resolve,reject){
            _mm.request({
            url     : _mm.getServerUrl('/user/forget_reset_password.do'),
            method  : 'POST',
            data    :userInfo,
            success : resolve,
            error   : reject
        });
    },
    //获取用户信息
    getUserInfo : function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/get_information.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    //更新个人信息
    updateUserInfo : function(userInfo,resolve,reject){
            _mm.request({
            url     : _mm.getServerUrl('/user/update_information.do'),
            method  : 'POST',
            data    :userInfo,
            success : resolve,
            error   : reject
        });
    },
    //登录状态下更新密码
    updatePassword : function(userInfo,resolve,reject){
            _mm.request({
            url     : _mm.getServerUrl('/user/reset_password.do'),
            method  : 'POST',
            data    :userInfo,
            success : resolve,
            error   : reject
        });
    },
    //退出登录
    logout : function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/user/logout.do'),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }

};
module.exports=_user;
