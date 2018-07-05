/*
* @Author: SUNNERCMS
* @Date:   2018-06-06 20:55:52
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-06 21:31:01
*/
var _mm = require('util/mm.js');
var _payment={
    // 获取支付信息
    getPaymentInfo  : function(orderNumber,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/pay.do'),
            data    :{
                orderNo:orderNumber
            },
            success : resolve,
            error   : reject
        });
    },
    // 获取订单状态
    getPaymentStatus  : function(orderNumber,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/query_order_pay_status.do'),
            data    :{
                orderNo:orderNumber
            },
            success : resolve,
            error   : reject
        });
    }
};
module.exports=_payment;
