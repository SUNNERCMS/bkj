/*
* @Author: SUNNERCMS
* @Date:   2018-03-29 10:48:55
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-22 17:00:09
*/
//通用JS工具类封装
var Hogan = require('hogan.js');
var conf ={
    serverHost : ''//接口地址和当前静态文件地址一样，所以用''
}
var _mm ={
    //网络数据请求功能
    request : function(param){
        var _this=this;
        $.ajax({
            type     : param.method  || 'get',
            url      : param.url     || '',
            dataType : param.type    || 'json',//错写成了param.data
            data     : param.data    || '',
            //请求正常并且请求内容也正常时为请求本身成功
            success  : function(res){
                if(0===res.status){//请求成功
                    typeof param.success === 'function'&&param.success(res.data,res.msg);
                }
                else if(10===res.status){//没有登录状态，需要强制登录
                    _this.doLogin();
                }
                else if(1===res.status){//请求数据错误
                    typeof param.error === 'function'&&param.error(res.msg);
                }
            },
            error   : function(err){
                    typeof param.error === 'function'&&param.error(err.statusText);
            }
        });
    },
    //获取服务器地址（接口）
    getServerUrl  : function(path){
        return conf.serverHost + path;
    },
    //获取Url中的参数
    getUrlParam : function(name){
        var reg    = new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
      
    },

    //渲染Html模板，将data和htmlTemplate进行拼接
    renderHtml : function (htmlTemplate,data){
        var template = Hogan.compile(htmlTemplate);
        var result   = template.render(data);
        return result;
    },
    //成功提示
    successTips : function(msg){
        alert(msg || '操作成功');
    },
    //错误提示
    errorTips : function(msg){
        alert(msg || '哪里出了问题！');
    },
    //字段的验证，支持非空、手机、邮箱的验证判断
    validate : function(value,type){
        var value = $.trim(value);//去掉收尾空格
        //非空验证
        if(type==='require'){
            return !!value; //转换为布尔值， 这里返回true
        }
        //手机号验证
        if(type==='phone'){
            return /^1\d{10}$/.test(value);
        }
        //邮箱验证
        if(type==='email'){
            return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
        }
    },
    //统一登录(跳转)处理
    doLogin : function(){
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    goHome : function(){
        window.location.href = './index.html';
    }
};
module.exports = _mm;