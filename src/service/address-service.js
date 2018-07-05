/*
* @Author: SUNNERCMS
* @Date:   2018-05-26 11:36:57
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-02 21:56:47
*/
var _mm = require('util/mm.js');
var _address={
    //获取地址列表
    getAddressList  : function(resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/list.do'),
            data    : {
                pageSize:50 //最多取出50个地址，再多也不会显示出来
            },
            success : resolve,
            error   : reject
        });
    },
    //新建收货地址
    save  : function(addressInfo,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/add.do'),
            data    : addressInfo,
            success : resolve,
            error   : reject
        });
    },
    //更新修改编辑收货地址
    update  : function(addressInfo,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/update.do'),
            data    : addressInfo,
            success : resolve,
            error   : reject
        });
    },
    //删除收货地址
    deleteAddress  : function(shippingId,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/del.do'),
            data    :{
                shippingId :shippingId
                },
            success : resolve,
            error   : reject
        });
    },
    //获取单条收件人信息
    getAddress  : function(shippingId,resolve,reject){
        _mm.request({
            url     : _mm.getServerUrl('/shipping/select.do'),
            data    :{
                shippingId  : shippingId //前面这个shippingId是请求接口用的，后台只认识shippingId，
                                        //换成Id或者其他字段，后台都不认识，那么也就相当于没有传地址ID过去
                },
            success : resolve,
            error   : reject
        });
    }
};
module.exports=_address;