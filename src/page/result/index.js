/*
* @Author: SUNNERCMS
* @Date:   2018-04-11 21:22:57
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-07 18:34:57
*/
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');
$(function(){
    var type = _mm.getUrlParam('type')||'default';
    $element = $('.'+type+'-success');
    //判断URL的类型值是否是payment,payment从哪里来的见下面注释
    if(type==='payment'){
        var orderNumber = _mm.getUrlParam('orderNumber'),
            $orderNumber = $element.find('.order-number');
        $orderNumber.attr('hrer',$orderNumber.attr('hrer')+orderNumber);
            // 先将href拿出来和orderNumber拼接，之后再放到href
    }
    //显示对应的提示元素
    $element.show();
})
// 结果页业务逻辑
// 1、首先会根据 _mm.getUrlParam('type')获取到操作类型的参数
// 2、根据该参数，利用$('.'+type+'-success')选取相应的内容
// 3、将其显示出来
// 
//   // 通过接口不断的访问后台订单的状态
            // _payment.getPaymentStatus(_this.data.orderNumber,function(res){
            //     if(res===true){
            //         window.location.href = 
            //         // 这里传送的type=payment类型，是用于结果页面来提取的类型值，然后根据不同的类型值显示不同的结果提示；
            //         // orderNumber=_this.data.orderNumber,也是用于结果页面通过URL来提取，然后动态的放进result的HTML中，用于详情页的跳转
            //         './result.html?type=payment&orderNumber='+_this.data.orderNumber;
            //     }
// 上面的if语目的就是从URL中提取orderNumber,放到HTML中的详情页跳转的地方，来达到动态修改的目的