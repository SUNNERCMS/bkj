/*
* @Author: SUNNERCMS
* @Date:   2018-06-03 20:31:45
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-05 20:29:52
*/
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
require('../../page/common/nav-side/index.string');
var navSide          = require('../../page/common/nav-side/index.js');
var _mm              = require('util/mm.js');
var _order           = require('service/order-service.js');
var templateIndex    = require('./index.string');

//  page 逻辑部分。初始化显示信息
var page = {
    data: {
         orderNumber : _mm.getUrlParam('orderNumber')    
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    // 绑定事件
    onLoad : function(){
        //初始化左侧菜单
        navSide.init({
            name:'order-list'
            });
        //加载订单详情的数据
        this.loadDetail();
    },
    bindEvent : function(){
        var _this=this;
        $(document).on('click','.order-cancel',function(){
            // 取消订单
            if(window.confirm("确定要取消订单吗？")){
                    _order.cancelOrder(_this.data.orderNumber,function(res){
                    _mm.successTips('该订单取消成功');
                    _this.loadDetail();
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
        });
    },
    //加载订单详情和商品清单
    loadDetail : function(){
        var _this=this,
            orderDetailHtml   = '',
            $content = $('.content');
            // 获取订单列表
            _order.getOrderDetail(_this.data.orderNumber,function(res){
                _this.dataFilter(res);
                orderDetailHtml  = _mm.renderHtml(templateIndex,res);
                $content.html(orderDetailHtml);
            },function(errMsg){
                $content.html('<p class="err-tip">'+errMsg+'</p>');
            });
    },
    // 数据的适配
    dataFilter:function(data){
        data.needPay        = data.status == 10; //10代表的订单的状态，表示在提交了订单以后，在支付以前
        data.isCancelable   = data.status == 10; 
    }
};

$(function(){
    page.init();
});