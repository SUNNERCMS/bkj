/*
* @Author: SUNNERCMS
* @Date:   2018-06-05 21:20:26
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-07 13:00:58
*/
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
var _mm              = require('util/mm.js');
var _payment         = require('service/payment-service.js');
var templateIndex    = require('./index.string');

//  page 逻辑部分。初始化显示信息
var page = {
    data: {
         orderNumber : _mm.getUrlParam('orderNumber')    
    },
    init: function(){
        this.onLoad();
    },
    // 绑定事件
    onLoad : function(){
        //加载支付信息
        this.loadPaymentInfo();
    },
    //加载支付页面信息
    loadPaymentInfo : function(){
        var _this=this,
            paymentHtml   = '',
            $pageWrap = $('.page-wrap');
            $pageWrap.html('<div class="loading"></div>');
            // 获取支付信息
            _payment.getPaymentInfo(_this.data.orderNumber,function(res){
                paymentHtml  = _mm.renderHtml(templateIndex,res);
                $pageWrap.html(paymentHtml);
                // 调用监听后台订单的状态方法，使其通过接口按时访问后台
                _this.listenOrderStatus();
            },function(errMsg){
                $pageWrap.html('<p class="err-tip">'+errMsg+'</p>');
            });
    },
    // 监听后台订单状态，扫码支付成功后，
    // 支付宝服务器会告诉后台服务器付款成功，也即是调用接口成功进行操作成功页面的跳转
    listenOrderStatus : function(){
        var _this = this;
        this.paymentTimer = window.setInterval(function(){
            // 通过接口不断的访问后台订单的状态
            _payment.getPaymentStatus(_this.data.orderNumber,function(res){
                if(res===true){
                    window.location.href = 
                    // 这里传送的type=payment类型，是用于结果页面来提取的类型值，然后根据不同的类型值显示不同的结果提示；
                    // orderNumber=_this.data.orderNumber,也是用于结果页面通过URL来提取，然后动态的放进result的HTML中，用于详情页的跳转
                    './result.html?type=payment&orderNumber='+_this.data.orderNumber;
                }
            });
        },5e3);

    }
   
};
$(function(){
    page.init();
});