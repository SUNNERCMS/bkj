/*
* @Author: SUNNERCMS
* @Date:   2018-06-03 15:05:28
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-03 19:37:55
*/
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
require('../../page/common/nav-side/index.string');
var navSide          = require('../../page/common/nav-side/index.js');
var _mm              = require('util/mm.js');
var _order           = require('service/order-service.js');
var Pagination       = require('util/pagination/index.js');
var templateIndex    = require('./index.string');

//  page 逻辑部分。初始化显示信息
var page = {
    data: {
            listParam:{
                pageNum : 1,
                pageSize : 5
            }
    },
    init: function(){
        this.onLoad();
    },
    // 绑定事件
    onLoad : function(){
        this.loadOrderList();
        //初始化左侧菜单
        navSide.init({
            name:'order-list'
            });
    },
    //加载订单列表
    loadOrderList : function(){
        var _this=this,
            orderListHtml   = '',
            $listCon = $('.order-list-con');
            // 获取订单列表
            _order.getOrderList(this.data.listParam,function(res){
                orderListHtml  = _mm.renderHtml(templateIndex,res);
                $listCon.html(orderListHtml);
                _this.loadPagination({
                    hasPreviousPage     : res.hasPreviousPage,//是否有上一页
                    prePage             : res.prePage,        //上一页页码
                    hasNextPage         : res.hasNextPage,     //是否有下一页
                    nextPage            : res.nextPage,        //下一页页码
                    pageNum             : res.pageNum,         //当前页码
                    pages               : res.pages            //总页码
                });
            },function(errMsg){
                $listCon.html('<p class="err-tip"> 加载订单失败，请刷新后重试</p>');
            });
    },
    // 加载分页信息
    loadPagination:function(pageInfo){
            var _this=this;
            this.pagination ? '' : (this.pagination = new Pagination());//Pagination()用类的方式在util中开发
            this.pagination.render($.extend({},pageInfo,{
                container   : $('.pagination'),
                onSelectPage: function(pageNum){
                    _this.data.listParam.pageNum = pageNum;
                    _this.loadOrderList();
                }
            }));
        }
};

$(function(){
    page.init();
});