/*
* @Author: SUNNERCMS
* @Date:   2018-05-20 13:54:26
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-25 13:25:27
*/
require('./index.css');
require('../../page/common/header/index.js');
var nav             = require('../../page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _cart           = require('service/cart-service.js');
var templateIndex   = require('./index.string');

var page={
    data :{

    },
    init:function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function(){
        this.loadCart();
    },
    bindEvent : function(){
        var _this=this; 
        // 商品的选择、取消选择,把这个动作告诉后台，然后把后台的新数据做渲染
        $(document).on('click','.cart-select',function(){
            var $this     = $(this),
                productId = $this.parents('.cart-table').data('product-id');
            //选中
            if($this.is(':checked')){
                _cart.selectProuduct(productId,function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartErr();
                });
            }
            //取消选中
            else{
                _cart.unselectProuduct(productId,function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartErr();
                });
            }
        });
        // 商品的全选、取消全选,把这个动作告诉后台，然后把后台的新数据做渲染
        $(document).on('click','.cart-select-all',function(){
            var $this = $(this);
            //选中
            if($this.is(':checked')){
                _cart.selectAllProuduct(function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartErr();
                });
            }
            //取消选中
            else{
                _cart.unselectAllProuduct(function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartErr();
                });
            }
        });
        // 点击加减后商品数量的变化
        $(document).on('click','.count-btn',function(){
            var $this     = $(this),
                $pCount   = $this.siblings('.count-input'),
                currCount = parseInt($pCount.val()),
                type      = $this.hasClass('plus')?'plus':'minus',
                productId = $this.parents('.cart-table').data('product-id'),
                minCount  = 1,
                maxCount  = parseInt($pCount.data('max')),
                newCount  = 0;
            if(type==='plus'){
                if(currCount>=maxCount){
                    _mm.errorTips('该商品数量已经达到上限');
                    return;
                }
                newCount=currCount+1;
            }
            else if(type==='minus'){
                if(currCount<=minCount){
                    return;
                }
                newCount=currCount-1;
            }
            //更新购物车商品数量
            _cart.updateProduct({
                productId : productId,
                count:newCount
            },function(res){
                _this.renderCart(res);
            },function(errMsg){
                _this.showCartErr();
            });
        });
        // 删除单个商品
        $(document).on('click','.cart-delete',function(){
            if(window.confirm("确实要删除该商品吗？")){
                var productId = $(this).parents('.cart-table').data('product-id');
                _this.deleteCartProduct(productId);
            }
        });
        // 删除选中的商品
        $(document).on('click','.delete-selected',function(){
            if(window.confirm("确实要删除选中的商品吗？")){
                var arrProductIds=[],               //用于存放选中条目的Id
                    $selectedItem=$('.cart-select:checked'),
                    iLength=$selectedItem.length; //条目被选中的个数
                for(var i=0;i<iLength;i++){
                    arrProductIds.push($($selectedItem[i]).parents('.cart-table').data('product-id'));
                }
                if(arrProductIds.length){
                    _this.deleteCartProduct(arrProductIds.join(','));
                    // _this.deleteCartProduct.apply(this,arrProductIds);   
                }
                else{
                    _mm.errorTips('您还没有选中要删除的商品');
                }
            }
        });
        //提交购物车，去结算
        $(document).on('click','.submit-btn',function(){
            //总价大于0，进行提交
            if(_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice>0){
                window.location.href="./order-confirm.html";
            }else{
                _mm.errorTips("请选择商品后再提交");
            }
        });
    },
    // 加载loadCart商品详情数据，请求接口，拿回数据
    loadCart:function(){
        var _this=this;
        //获取购物车列表
        _cart.getCartCountList(function(res){
            _this.renderCart(res);
        },function(errMsg){
            $('.page-wrap').html('<p class="err-tip">哪里不对了，刷新下试试吧！');
        });
    },
    //渲染购物车
    renderCart:function(data){
        //数据匹配，调用filter()判断数据是否为空,记为标记位，用于列表加载
        this.filter(data);
        //缓存购物车信息,每次render时都把数据缓存起来，最后提交时，我们通过它来判断我们的数据是否合法
        this.data.cartInfo = data;
        //生成HTML
        var cartHtml = _mm.renderHtml(templateIndex,data);
        $('.page-wrap').html(cartHtml);
        //通知导航栏的购物车更新数量,调用其它模块中的方法
        nav.loadCartCount();
    },
    filter : function(data){
        //给data对象添加个notEmpty属性，作为购物车列表是否为空的标记位，!!强制转换为布尔型
        data.notEmpty = !!data.cartProductVoList.length; 
    },
    showCartErr : function(){
        $('.page-wrap').html('<p class="err-tip">哪里不对了，刷新下试试吧！');
    },
    // 删除指定商品，支持批量，productId用逗号分隔
    deleteCartProduct : function(productIds){
        var _this = this;
        _cart.deleteProduct(productIds,function(res){
            _this.renderCart(res);
        },function(errMsg){
            _this.showCartErr();
        });
    }
};
$(function(){
    page.init();
});
//  data.notEmpty = !!data.cartProductVoList.length; 
//  给data对象添加个notEmpty属性，作为购物车列表是否为空的标记位，
//  我认为后台返回的data对象中应该包括这个购物车列表是否为空的标记位属性，
//  不过在这个属性，后台没写，那就在前端自己通过data中的其他信息，来做一个后台伪属性