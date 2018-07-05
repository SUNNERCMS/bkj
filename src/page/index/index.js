/*
* @Author: SUNNERCMS
* @Date:   2018-03-27 09:08:26
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-05-15 16:19:34
*/
//该js文件应该是主页的js程序部分，用于调用各个通用独立模块的JS文件
// 模块化的方式引入jQuery
// require('../../page/common/nav-simple/index.js');
require('./index.css');
require('../../page/common/header/index.js');
require('../../page/common/nav/index.js');
require('../../util/slider/index.js');
var navSide = require('../../page/common/nav-side/index.js');
var templateBanner = require('./banner.string');
var _mm = require('util/mm.js');

$(function() {
    // 渲染banner的HTML结构
    var bannerHtml = _mm.renderHtml(templateBanner);
    $('.banner-con').html(bannerHtml);
    // 初始化banner
    var slider = $('.banner').unslider({
        dots: true
    });
    // banner的前一张和后一张的点击绑定事件
    $('.banner-con .banner-arrow').click(function(){
        var fn=this.className.split(' ')[1];
        slider.data('unslider')[fn]();
    });
    // $('banner-con banner-arrow').click(function(){
    // var forward = $(this).hasClass('prew')?'prew':'next';
    // $slider.data('unslider')[forward]();
    // });
    // $('banner-con banner-arrow')又忘记带点，取对象时注意
    
});