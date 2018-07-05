/*
* @Author: SUNNERCMS
* @Date:   2018-04-29 16:44:33
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-10 22:03:28
*/
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
require('../../page/common/nav-side/index.string');
var navSide         = require('../../page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var templateIndex   = require('./index.string');

//  page 逻辑部分。初始化显示信息
var page = {
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    // 绑定事件
    onLoad : function(){
        //初始化左侧菜单
        navSide.init({
            name:'user-center'
            });
        //加载用户信息
        this.loadUserInfo();
    },
    //提交事件用于加载用户信息
    bindEvent : function(){
        var _this=this;
        // 点击提交按钮后的动作
        $(document).on('click','.btn-submit',function(){
            var userInfo = {
                phone     : $.trim($('#phone').val()),
                email     : $.trim($('#email').val()),
                question  : $.trim($('#question').val()),
                answer    : $.trim($('#answer').val())
            },
            //对表单信息进行验证,此处为表单验证结果
            validateResult = _this.validateForm(userInfo);
            //验证成功
            if(validateResult.status){
                //更改用户信息,传给后台
                _user.updateUserInfo(userInfo,function(res,msg){
                    _mm.successTips(msg);
                    window.location.href ='./user-center.html';
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            // 验证失败
            else{
                //错误提示
                 _mm.errorTips(validateResult.msg);
            }
        });
    },
    //表单字段验证
    validateForm : function(userInfo){
        var result={
            status  : false,
            msg     : ''
        };

        //验证手机号格式
        if(!_mm.validate(userInfo.phone,'phone')){
            result.msg = '手机号格式不正确';
            return result;
        }
        //验证邮箱格式
        if(!_mm.validate(userInfo.email,'email')){
            result.msg = '邮箱格式不正确';
            return result;
        }
        //验证密码提示问题是否为空
        if(!_mm.validate(userInfo.question,'require')){
            result.msg = '密码提示问题不能为空';
            return result;
        }
        //验证密码提示答案是否为空
        if(!_mm.validate(userInfo.answer,'require')){
            result.msg = '密码提示答案不能为空';
            return result;
        }        
        //如果验证通过,返回正确提示
         result.status = true;
         result.msg   = '验证通过';
         return result;
    },
    //加载用户信息
    loadUserInfo : function(){
        var userHtml = '';
        _user.getUserInfo(function(res){
            userHtml=_mm.renderHtml(templateIndex,res);
            $('.panel-body').html(userHtml);
        },function(errMsg){
            _mm.errorTips(errMsg);
        });
    }
};
$(function(){
    page.init();
});
    //提交事件用于加载用户信息
    //因为包括按钮在内的个人信息界面是通过JS渲染进来的，所以如果最开始就
    //绑定事件是绑定不了的，那么仍然需要其中一个元素在点击时能触发一个点击事件，要怎么办呢？
    //所以可以给全局添加一个监听事件，通过冒泡来触发该事件。
    //或者说将内部元素的点击事件代理到父元素和全局中。
    //
    //问题1：点击提交没有触发提交事件，
    //原因1：'.btn-submit'少了个点,注意类的格式
    //原因二： $.trim($('#phone').val())写成了$.trim($('#phone').value())
            //$(document).on('click','.btn-submit',function(){
            // var userInfo = {
            //     phone     : $.trim($('#phone').val()),
            //     email     : $.trim($('#email').val()),
            //     question  : $.trim($('#question').val()),
            //     answer    : $.trim($('#answer').val())
            // },