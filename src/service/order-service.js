/*
* @Author: SUNNERCMS
* @Date:   2018-05-25 13:43:46
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-05 19:13:30
*/
/*
* @Author: SUNNERCMS
* @Date:   2018-05-15 17:31:20
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-19 13:57:47
*/
var _mm = require('util/mm.js');
var _order={
    // 获取订单页中的商品列表
    getProductList  : function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/get_order_cart_product.do'),
            success : resolve,
            error   : reject
        });
    },
    // 提交订单的接口
    createOrder  : function(orderInfo,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/create.do'),
            data    : orderInfo,//orderInfo里面实际上只有一个字段，但是没有单独把他传进来，
                                //而是传入了一个对象，是因为订单确认将来肯定比这复杂，
                                //这里通过一个对象传进来，是为了后面好改。
            success : resolve,
            error   : reject
        });
    },
    // 获取订单列表
    getOrderList  : function(listParam,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/list.do'),
            data    : listParam,
            success : resolve,
            error   : reject
        });
    },
    //获取订单详情
    getOrderDetail  : function(orderNumber,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/detail.do'),
            data    : {
                orderNo:orderNumber
            },
            success : resolve,
            error   : reject
        });
    },
    // 取消订单
    cancelOrder  : function(orderNumber,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/cancel.do'),
            data    : {
                orderNo:orderNumber
            },
            success : resolve,
            error   : reject
        });
    } 
};
module.exports=_order;
