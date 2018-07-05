/*
* @Author: SUNNERCMS
* @Date:   2018-04-08 21:58:40
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-23 17:14:34
*/
var _mm = require('util/mm.js');
var _user={
    //获取购物车数量
    getCartCount : function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/get_cart_product_count.do'),
            success : resolve,
            error   : reject
        });
    },
    //添加到购物车，将productInfo包含的商品类别，要购买的数量通过该接口传给后台
    addToCart : function(productInfo,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/add.do'),
            data    : productInfo,
            success : resolve,
            error   : reject
        });
    },
    //获取购物车列表，之前传入了后台购物的商品种类和数量，
    //经过后台计算后，通过该接口调用相关数据
    getCartCountList :  function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/list.do'),
            success : resolve,
            error   : reject
        });
    },
    //选择购物车商品
    selectProuduct :  function(productId,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/select.do'),
            data    : {
                productId:productId
            },
            success : resolve,
            error   : reject
        });
    },
    //取消选择购物车商品
    unselectProuduct :  function(productId,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/un_select.do'),
            data    : {
                productId:productId
            },
            success : resolve,
            error   : reject
        });
    },
    //选中全部商品
    selectAllProuduct :  function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/select_all.do'),
            success : resolve,
            error   : reject
        });
    },
    //取消选中全部商品
    unselectAllProuduct :  function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/un_select_all.do'),
            success : resolve,
            error   : reject
        });
    },
    //更新购物车列表中商品数量
    updateProduct : function(productInfo,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/update.do'),
            data    : productInfo,
            success : resolve,
            error   : reject
        });
    },
    //删除指定商品
    deleteProduct : function(productIds,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/cart/delete_product.do'),
            data    : {
                productIds : productIds
            },
            success : resolve,
            error   : reject
        });
    }
};
module.exports=_user;