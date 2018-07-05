/*
* @Author: SUNNERCMS
* @Date:   2018-04-10 10:55:03
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-15 17:45:48
*/
require('./index.css');
var _mm=require('util/mm.js');
//通用页面头部
var header={
    init : function(){
        this.bindEvent();
        this.onLoad();
    },
    //重载输入框内容
    onLoad : function(){
        var keyword = _mm.getUrlParam('keyword');
        //keyword存在，则回填输入框
        if(keyword){
            $('#search-input').val(keyword);
        };
    },
    bindEvent : function(){
    var _this=this;
    //点击搜索按钮以后，做搜索提交
       $('#search-btn').click(function(){
        _this.searchSubmit();
       });
       //输入回车后，做搜索提交
       $('#search-input').keyup(function(e){
        //13是回车键的keyCode
        if(e.keyCode === 13){
            _this.searchSubmit();
         }
       });          
    },
    //搜索的提交
    searchSubmit : function(){
        var keyword = $.trim($('#search-input').val());
        //如果提交时有keyword，正常跳转到list页面
        if(keyword){
            window.location.href='./list.html?keyword='+keyword;
        }
        //如果keyword为空，直接跳转到首页
        else{
            _mm.goHome();
        }
    }

};
header.init();