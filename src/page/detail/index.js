/*
* @Author: SUNNERCMS
* @Date:   2018-05-18 14:21:34
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-19 21:03:56
*/
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _product        = require('service/product-service.js');
var _cart           = require('service/cart-service.js');
var templateIndex   = require('./index.string');

var page={
    data :{
        productId : _mm.getUrlParam('productId') || ''
    },
    init:function(){
        this.onLoad();
        this.bindEvent();
    },
    // 初始化加载方法，要做两件事：
    // 1、判断produId是否传过来，没传做错误处理。2、传了加载detail页
    onLoad:function(){
        //如果没有传productId直接跳回首页
        if(!this.data.productId){
            _mm.goHome();
        }
        //否则加载商品详情页
        this.loadDetail();
    },
    bindEvent : function(){
        var _this=this;
        // 图片预览,把缩略图的地址放到大图地址中，涉及图片地址的取操作和存操作
        $(document).on('mouseenter','.p-img-item',function(){
            var imageUrl = $(this).find('.p-img').attr('src');
            $('.main-img').attr('src',imageUrl);
        });        

        $(document).on('click','.p-count-btn',function(){
            var $pCount   = $('.p-count'),
                currCount = parseInt($pCount.val()),
                type      = $(this).hasClass('plus') ? 'plus' : 'minus',
                minCount  = 1,
                maxCount  = _this.data.detailInfo.stock || 1;
                console.log(currCount);
            if(type==='plus'){
                $pCount.val(currCount<maxCount ? currCount+1 : maxCount);
            }
            else if(type==='minus'){
                $pCount.val(currCount>minCount ? currCount-1 : minCount);
            }
        }); 
        // 加入购物车
        $(document).on('click','.cart-add',function(){
            _cart.addToCart({
                productId : _this.data.productId,
                count     : $('.p-count').val()
            },function(res){
                window.location.href = './result.html?type=cart-add';
            },function(errMsg){
                _mm.errTips(errMsg);
            });
        });     
    },
    // 加载loadDetail商品详情数据，根据productId去取相关信息
    loadDetail:function(){
        var html      = '',
            _this     = this,
            $pageWrap = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        // 请求detail信息
        _product.getProductDetail(this.data.productId,function(res){
            _this.data.detailInfo = res;    //缓存住接口返回的数据，为了利用stock
            //将返回的字符串型subImages分割成数组，即每一个缩略图的图片参数
            // 这里使用了对象引用类型的赋值，来改变对象的值
            res.subImages=res.subImages.split(',');
            html=_mm.renderHtml(templateIndex,res);
            $('.page-wrap').html(html);
        },function(errMsg){
            $('.page-wrap').html('<p class="err-tip">此商品太淘气，找不到了!</p>');
        });
    }

};
$(function(){
    page.init();
});