/*
* @Author: SUNNERCMS
* @Date:   2018-05-15 17:31:20
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-19 13:57:47
*/
var _mm = require('util/mm.js');
var _product={
    //获取商品列表
    getProductList  : function(listParam,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/product/list.do'),
            data    : listParam,
            success : resolve,
            error   : reject
        });
    },
    // 获取商品详细信息
    getProductDetail : function(productId,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/product/detail.do'),
            data    : {
                productId: productId
            },
            success : resolve,
            error   : reject
        });
    }
};
module.exports=_product;
