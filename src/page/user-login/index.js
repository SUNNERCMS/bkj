/*
* @Author: SUNNERCMS                                                                                            
* @Date:   2018-03-27 10:02:04
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-04-24 14:43:11
*/
require('./index.css');
require('page/common/nav-simple/index.js');
var _user = require('service/user-service.js');
var _mm   = require('util/mm.js');

// 表单里的错误提示
var formError = {
    show : function(errMsg){
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $('.error-item').hide().find('.err-msg').text('');
    }
};
// 建立个对象统一处理业务,page 逻辑部分
var page = {
    init: function(){
        this.bindEvent();
    },
    // 绑定事件
    bindEvent : function(){
        var _this=this;
        //登录按钮点击提交事件
        $('#submit').click(function(){
            _this.submit();
        });
        //如果按下回车，也进行提交
        $('.user-content').keyup(function(e){
            //回车键的判断
            if(e.keyCode===13){
                _this.submit();
            }
        });
    },
    //提交表单（伪表单没有用form）
    submit : function(){
        //获取表单内容信息
        var formData={
            username : $.trim($('#username').val()),
            password : $.trim($('#password').val())
        },
        //对表单信息进行验证,此处为表单验证结果
        validateResult = this.formValidate(formData);
        //验证成功
        if(validateResult.status){
            //提交,用service中的_user.login()接口，将数据，成功操作，失败操作传给后台
            _user.login(formData,function(res){
                window.location.href =  _mm.getUrlParam('redirect')||'./index.html';//???'redirect'
            },function(errMsg){
                formError.show(errMsg);
            });
        }
        // 验证失败
        else{
            //错误提示
            formError.show(validateResult.msg);
        }
    },
    //表单字段验证
    formValidate : function(formData){
        var result={
            status  : false,
            msg     : ''
        };
        //如果username栏为空,不能通过验证，显示返回提示信息和satus=false,传入validateResult,其值就是result对象
        if(!_mm.validate(formData.username,'require')){
            result.msg = '用户名不能为空';
            return result;
        }
        if(!_mm.validate(formData.password,'require')){
            result.msg = '密码不能为空';
            return result;
        } 
        // if(!_mm.validate(formData.username,'require')&&!_mm.validate(formData.password,'require')){
        //     result.msg = '用户名和密码不能为空';
        //     return result;
        // } 
        //如果验证通过,返回正确提示
         result.status = true;
         result.msg    = '验证通过';
         return result;
    }
};
$(function(){
    page.init();
});