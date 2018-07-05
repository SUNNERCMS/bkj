/*
* @Author: SUNNERCMS
* @Date:   2018-05-15 17:22:24
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-19 14:36:32
*/
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _product        = require('service/product-service.js');
var Pagination      = require('util/pagination/index.js');
var templateIndex   = require('./index.string');

var page={
    data :{
        listParam:{
            keyword         :_mm.getUrlParam('keyword')      ||'',
            categoryId      :_mm.getUrlParam('categoryId')   ||'',
            orderBy         :_mm.getUrlParam('orderBy')      ||'default',
            pageNum         :_mm.getUrlParam('pageNum')      || 1,
            pageSize        :_mm.getUrlParam('pageSize')     || 15//每页商品列表的个数
        }
    },
    init:function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function(){
        this.loadList();
    },
    bindEvent:function(){
        var _this=this;
        //排序的点击事件
        $('.sort-item').click(function(){
            var $this=$(this);
             _this.data.listParam.pageNum=1;//页码置为1
            //点击默认排序
            if($this.data('type')==='default'){
                if($this.hasClass('active')){
                    return;
                }
                else{
                    $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                        _this.data.listParam.orderBy='default';
                }
            }
            //点击价格排序
            else if($this.data('type')==='price'){
                $this.addClass('active').siblings('.sort-item')
                    .removeClass('active asc desc');
                //升序处理
                if(!$this.hasClass('asc')){
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy="price_asc";//price_asc接口里定义的；传到后台匹配上升排序后返回
                }
                //降序处理
                else{
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy="price_desc";
                }
            }
            _this.loadList();//排序后重新进行列表加载
        });
    },
    // 加载list数据，续接口，拿回list数据，渲染,listParam用于传递一些信息
    loadList:function(){
        var _this     =this;
        var listHtml  ='';
        var listParam = this.data.listParam;// 在全局放一个缓存的变量，把listparam缓存起来，便于操作
        var $pListCon  = $(".p-list-con");
        $pListCon.html('<div class="loading"></div>');
        //删除参数中多余的字段
        listParam.categoryId ? (delete listParam.keyword):(delete listParam.categoryId);
        //请求接口
        _product.getProductList(listParam,function(res){
            //加载商品列表
            listHtml  = _mm.renderHtml(templateIndex,{
                list:res.list
            });
            $pListCon.html(listHtml);
            //加载分页信息
            _this.loadPagination({
                hasPreviousPage     : res.hasPreviousPage,//是否有上一页
                prePage             : res.prePage,        //上一页页码
                hasNextPage         : res.hasNextPage,     //是否有下一页
                nextPage            : res.nextPage,        //下一页页码
                pageNum             : res.pageNum,         //当前页码
                pages               : res.pages            //总页码
            });
        },function(errMsg){
            _mm.errorTips(errMsg);
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
                _this.loadList();
            }
        }));
        }
};
$(function(){
    page.init();
})
//排序事件的业务逻辑：
//1、给默认项的（defaul）和价格项（price）都加上排序点击事件
//2、判断点击的是default还是price
//3、如果点击的是default并且是active状态，直接return掉，
//   否则给default添加上active状态，移除掉其它兄弟项的active，
//   由于是默认排序，也需要移除兄弟项的上升排序（asc)或者下降排序(desc)
//4、如果点击的是price,给price添加active，移除掉其它兄弟项的active，
//   万一有销量排序项呢？所以也需要移除兄弟项的上升排序（asc)或者下降排序(desc)
//5、判断当前price项是asc还是desc排序
//   如果不是asc排序->需要添加上asc排序，同时移除掉自身之前的desc排序，同理
//   如果不是desc排序->需要添加上desc排序，同时移除掉自身之前的asc排序.