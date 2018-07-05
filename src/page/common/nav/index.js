/*
* @Author: SUNNERCMS
* @Date:   2018-04-03 16:18:59
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-13 12:56:06
*/
require('./index.css');
var _mm=require('util/mm.js');
var _user=require('service/user-service.js');
var _cart=require('service/cart-service.js');
//导航条
var nav={
    init: function(){
        this.bindEvent();
        this.loadUserInfo();
        this.loadCartCount();
        return this;  //此时的this指向的是init的调用者

    },
    bindEvent: function(){
        // 登录点击事件
        $('.js-login').click(function(){
            _mm.doLogin();
        });
        // 注册点击事件
        $('.js-register').click(function(){
            window.location.href="./register.html";//点击注册时直接跳转到注册界面
        });
        //退出点击事件
        $('.js-logout').click(function(){
            _user.logout(function(res){
                window.location.reload();//通用组件在不同的页面下需要有不同的逻辑，退出登录后重新刷新请求接口
            },function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
    },
    //加载用户信息
    loadUserInfo: function(){
        _user.checkLogin(function(res){
            $(".user.not-login").hide().siblings('.user.login').show().find(".username").text(res.username);
        }),function(errMsg){
            //do noting
        }
    },
    //加载购物车数量
    loadCartCount:function(){
        _cart.getCartCount(function(res){
            $('.nav .cart-count').text(res||0);
        },function(errMsg){
            $('.nav .cart-cont').text(0);
        });
    }
};
module.exports=nav.init();//使用init()，其中有返回值，返回的是init的调用者nav对象,在使用该对象之前进行了初始化