/*
* @Author: SUNNERCMS
* @Date:   2018-05-17 10:09:39
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-17 17:27:08
*/
// 在js 中实现类时使用function，其方法靠原型往上加
require('./index.css');
var templatePagination = require('./index.string');
var _mm                = require('util/mm.js');

var Pagination = function(){
    var _this=this;
    this.defaultOpition={
        container   :null,
        pageNum     :1,
        pageRange   :3,
        onSelectPage:null
    };
    // 事件的处理：采用的事件代理而不是事件绑定
    // 因为这个组件设计时是先new，之后会调用这个function，若是事件绑定，
    // 那么绑定完事件再去加载HTML是无效的，或者说此时绑定的对象还没有加载出来
    $(document).on('click','.pg-item',function(){
        var $this=$(this);
        //对于active和disabled的按钮点击，不做处理
        if($this.hasClass('active')||$this.hasClass('disabled')){
            return;
        }
        typeof _this.option.onSelectPage === 'function'
            ? _this.option.onSelectPage($this.data('value')):null;
    });
};
// 渲染分页组件的render方法
Pagination.prototype.render=function(userOption){
    //合并分页信息选项（接口反馈+容器，页码+默认信息(pageRange)）
     this.option = $.extend({},this.defaultOpition,userOption);
    //判断容器是否是合法的jQuery对象
    if(!(this.option.container instanceof jQuery)){
        return;
    }
    // 判断是否只有一页
    if(this.option.pages<=1){
        return;
    }
    //将分页内容HTML放在到容器中
    this.option.container.html(this.getPaginationHtml());
};
//获取分页内容的HTML,|上一页|1 2 3 4 =5= 6|下一页| 5/6
Pagination.prototype.getPaginationHtml=function(){
    var html      = '',
        pageArray = [],//往其中推入三大项（均是对象型）：上一页，页码，下一页,
        start     = (this.option.pageNum-this.option.pageRange)>0
            ?(this.option.pageNum-this.option.pageRange): 1,
        end       = (this.option.pageNum+this.option.pageRange)<this.option.pages
            ?(this.option.pageNum+this.option.pageRange): this.option.pages;
        //推送的是对象，因为每个按钮里都有几个属性，
        //name：用来写它呈现的样子，value：返回的页码值，disabled：按钮是否可用
        //上一页按钮的数据
        pageArray.push({
            name        :'上一页',
            value       : this.option.prePage,
            disabled    : !(this.option.hasPreviousPage)  // 有前一页则取反，disabled为false，不失能,即由上一页按钮可点
        });
        //数字按钮的处理
        for(var i=start;i<=end;i++){
            pageArray.push({
                name : i,
                value: i,
                active:(i === this.option.pageNum)
            }); 
        };
        //下一页按钮的数据
        pageArray.push({
            name        : '下一页',
            value       : this.option.nextPage,
            disabled    : !(this.option.hasNextPage)  // 有下一页则取反，disabled为false，不失能
        });
        //将相关数据项渲染到HTML结构模板中
        html = _mm.renderHtml(templatePagination,{
            pageArray   : pageArray,
            pageNum     : this.option.pageNum,
            pages       : this.option.pages
        });
    return html;
};
module.exports = Pagination;