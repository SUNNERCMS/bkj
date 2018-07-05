/*
* @Author: SUNNERCMS
* @Date:   2018-05-13 11:32:57
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-13 12:39:49
*/
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
require('../../page/common/nav-side/index.string');
var navSide         = require('../../page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');


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
            name:'user-pass-update'
            });
    },
    //提交事件用于加载用户信息
    bindEvent : function(){
        var _this=this;
        // 点击提交按钮后的动作
        $(document).on('click','.btn-submit',function(){
            var userInfo = {
                password            : $.trim($('#password').val()),
                passwordNew        : $.trim($('#password-new ').val()),
                passwordConfirm    : $.trim($('#password-confirm').val())
            },
            //对表单信息进行验证,此处为表单验证结果
            validateResult = _this.validateForm(userInfo);
            //验证成功
            if(validateResult.status){
                //更改用户密码
                _user.updatePassword({
                    passwordOld:userInfo.password,
                    passwordNew:userInfo.passwordNew
                },function(res,msg){
                    _mm.successTips(msg);
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
        //原密码是否为空
        if(!_mm.validate(userInfo.password,'require')){
            result.msg = '原密码不能为空';
            return result;
        }
        //新密码不能为空，且长度要大于六位；
        //若userInfo.passwordNew为空，则!userInfo.passwordNew为真，即密码不存在时不去判断长度
        if(!userInfo.passwordNew||userInfo.passwordNew.length<6){
            result.msg = '密码长度不得少于6位';
            return result;
        }
        //确认密码是否和新密码相同
        if(userInfo.passwordNew!==userInfo.passwordConfirm){
            result.msg = '两次输入的密码不一致';
            return result;
        }       
        //如果验证通过,返回正确提示
         result.status = true;
         result.msg   = '验证通过';
         return result;
    },

};
$(function(){
    page.init();
});