/*
* @Author: SUNNERCMS
* @Date:   2018-05-25 13:26:44
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-05 21:18:22
*/
/*
* @Author: SUNNERCMS
* @Date:   2018-05-20 13:54:26
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-25 13:25:27
*/
require('./index.css');
require('../../page/common/header/index.js');
var nav               = require('../../page/common/nav/index.js');
var _mm               = require('util/mm.js');
var _address          = require('service/address-service.js');
var _order            = require('service/order-service.js');
var templateAddress   = require('./address-list.string');
var templateProduct   = require('./product-list.string');
var addressModal      = require('./address-modal.js');

var page={
    data:{
        selectedAddressId:null //地址列表里面的Id
    },
    init:function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function(){
        // 加载地址列表
        this.loadAddressList();
        // 加载商品信息列表
        this.loadProductList();
    },
    bindEvent:function(){
        var _this=this;
        //地址的选择，选中之后有个红色外框
        $(document).on("click",'.address-item',function(){
            $(this).addClass('active').siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId=$(this).data('id');
        });
        //提交订单
        $(document).on("click",'.order-submit',function(){
            var shippingId = _this.data.selectedAddressId;
            if(shippingId){
                _order.createOrder({
                    shippingId :shippingId
                },function(res){
                     window.location.href = './payment.html?orderNumber='+res.orderNo;
                },function(errMsg){
                    _mm.errorTips(errMsg); //这里后台返回的是订单创建失败
                });
            }else{
                _mm.errorTips('请选择地址后再提交');
            }
        });
        //添加新地址
        $(document).on("click",'.address-add',function(){
            addressModal.show({
                isUpdate  : false,      //用作标记位，来判断是添加地址还是更新编辑地址
                //放回调函数，当添加成功后，modal框会做一个回调，来继续执行主页面的逻辑
                //在使用新地址并且验证通过后，调用该函数
                onSuccess : function(){
                    _this.loadAddressList();    //重新加载地址列表，即做到添加后地址列表的更新显示
                }
            });
        });
        //地址的编辑入口
        $(document).on("click",'.address-update',function(e){
             e.stopPropagation();  //阻止冒泡到address-item上触发红色标记框
            var shippingId = $(this).parents('.address-item').data('id');
            //获取单条收件人信息
            _address.getAddress(shippingId,function(res){
                addressModal.show({
                    data      : res,
                    isUpdate  : true,      //用作标记位，来判断是添加地址还是更新编辑地址
                    //放回调函数，当添加成功后，modal框会做一个回调，来继续执行主页面的逻辑
                    //在使用新地址并且验证通过后，调用该函数
                    onSuccess : function(){
                        _this.loadAddressList();    //重新加载地址列表，即做到添加后地址列表的更新显示
                    }
                });
            },function(errMsg){
                _mm.errorTips(errMsg);
            });

        });
        //地址的删除
        $(document).on('click','.address-delete',function(e){
            e.stopPropagation();  //阻止冒泡到address-item上触发红色标记框
            var id = $(this).parents('.address-item').data('id');
            if(window.confirm('确认要删除该地址吗')){
                _address.deleteAddress(id,function(res){
                    _this.loadAddressList();
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
        }); 
    },
    // 加载地址列表(通过地址接口进行信息的加载)
    loadAddressList:function(){
        var _this = this;
         $(".address-con").html('<div class="loading"></div>');
        //获取地址列表
        _address.getAddressList(function(res){
            _this.addressFilter(res);
            var addressListHtml = _mm.renderHtml(templateAddress,res);
            $(".address-con").html(addressListHtml);
        },function(errMsg){
            $(".address-con").html('<p class="err-tip">地址加载失败，请刷新后重试</p>');
        });
    },
    //处理地址列表选中状态
    addressFilter : function(data){
        if(this.data.selectedAddressId){ //缓存的有ID
            var selectedAddressFlag = false;
            for(var i=0,length=data.list.length;i<length;i++){
                if(data.list[i].id===this.data.selectedAddressId){
                    data.list[i].isActive = true;
                    selectedAddressFlag   = true;
                }
            };
            //如果以前选中的地址不在列表里，将其删除
            if(!selectedAddressFlag){
                this.data.selectedAddressId = null;
            }
        }

    },
    // 加载商品信息列表
    loadProductList:function(){
        var _this = this;
         $(".product-con").html('<div class="loading"></div>');
        //获取商品信息列表
        _order.getProductList(function(res){
            var productListHtml = _mm.renderHtml(templateProduct,res);
            $(".product-con").html(productListHtml);
        },function(errMsg){
            $(".product-con").html('<p class="err-tip">商品信息加载失败，请刷新后重试</p>');
        });
    }
};

$(function(){
    page.init();
})
// 绑定事件包含的操作
// 1、地址的选择：该选中的地址添加active，并清除兄弟元素的active，并将data-id作为标识项
// 2、订单的提交：提交之前要判断是否选中了地址，选中的是哪个地址，
//    然后传这个地址到后台接口，生成订单号，再拿回来在支付界面使用。
// 3、添加新地址：（1）点击之后，弹出modal窗口，里面的操作有modal.js完成。
//                （2）这个地方只需要有个入口，和回调即可
// 4、删除地址：1、首先要取得将要删除地址的ID，然后调用删除接口，将这个地址ID传进去，
//                  后台拿到这个地址ID后会进行删除操作，
//                  我们真是实现的删除操作将后台处理后的结果进行界面的重新加载刷新
//5、处理地址列表选中状态 : 代码段解读，首先判断下是否有之前点击地址缓存起来的地址ID，
//                          如果有，那么遍历地址列表中地址的ID看哪个和它一样，将其active
//                          ，遍历全部后发现没有和之前点击地址时缓存起来的ID值选项，
//                          说明进行了删除操作，将这个地址删除了，那么之前缓存起来的ID值
//                          此时就没有存在价值了，将其null.
//6、地址的编辑 ： 