/*
* @Author: SUNNERCMS
* @Date:   2018-03-27 09:22:36
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-26 17:26:35
*/
var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 环境变量的配置，dev / online
var WEBPACK_ENV       = process.env.WEBPACK_ENV || 'dev';
// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name,title){
    return{                                     //return中的这些都是html-webpack-plugin中的配置属性，为了保证通用简洁写成了函数形式
        template : './src/view/'+ name +'.html', //指定你生成的文件所依赖哪一个HTML模板
        filename : 'view/'+ name +'.html', //生成模板文件的名字
        title    : title,  //生成HTML文件的标题，页面的标题
        inject   : true,   //true 默认值和设置为body效果一样，都是将script标签位于html文件的 body 底部
        favicon  : './favicon.ico',  //放在了根目录下
        hash     : true,            //hash选项的作用是 给生成的 js 文件一个独特的 hash 值。是否生成hash添加在引入文件地址的末尾，类似于我们常用的时间戳
        chunks   : ['common',name] //chunks主要用于多入口文件，当你有多个入口文件，编译后会生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件
    };
};
//webpack的配置文件
var config={
    entry: {
    'common'             : ['./src/page/common/index.js'],//所有页面都会有的一个组件,在这里打包个client所有的页面都可以使用啦
    'index'              : ['./src/page/index/index.js'],
    'list'               : ['./src/page/list/index.js'],
    'detail'             : ['./src/page/detail/index.js'],
    'cart'               : ['./src/page/cart/index.js'],
    'order-confirm'      : ['./src/page/order-confirm/index.js'],
    'order-list'         : ['./src/page/order-list/index.js'],
    'order-detail'       : ['./src/page/order-detail/index.js'],
    'payment'            : ['./src/page/payment/index.js'],
    'user-login'         : ['./src/page/user-login/index.js'],
    'user-pass-reset'    : ['./src/page/user-pass-reset/index.js'],
    'user-register'      : ['./src/page/user-register/index.js'],
    'user-center'        : ['./src/page/user-center/index.js'],
    'user-center-update' : ['./src/page/user-center-update/index.js'],
    'user-pass-update'   : ['./src/page/user-pass-update/index.js'],
    'result'             : ['./src/page/result/index.js'],
    'about'              : ['./src/page/about/index.js'],
    },
    output: {
        path:  __dirname+'/dist/', //打包后文件输出的位置
        publicPath: 'dev'===WEBPACK_ENV ? '/dist/' : '//s.happymmall.com/mmall-fe/dist/',       //资源文件引用目录：“publicPath”项被许多Webpack的插件用于在生产模式下更新内嵌到css、html文件里的url值。
        filename: 'js/[name].js'
    },
    // externals 定义外部依赖
    // externals 是用来排除某些你并不想打包的库，并且可以通过 import / require 在全局环境中调用。
    // 这个选项一般是提供给一些开源库或者组件作者使用的。
    // 相当于，你调用了一个库，而最终实际打包的文件里面剔除该库的存在，只是留下了一个引用接口。
    externals:{
        'jquery' : 'window.jQuery'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: "url-loader?limit=100&name=resource/[name].[ext]"},
            { test: /\.string$/, 
                    loader:'html-loader',
                    query:{
                            minimize:true,
                            removeAttributeQuotes:false
                        }
                    }
        ]
    },
    resolve :{  //处理文件的扩展名
        alias : {
            util           : __dirname + '/src/util',
            page           : __dirname + '/src/page',
            service        : __dirname + '/src/service',
            image          : __dirname + '/src/image',
            node_modules   : __dirname + '/node_modules',
        }
    },
    plugins:[
    //独立通用模块到js/base.js
    new webpack.optimize.CommonsChunkPlugin({
        name : 'common',  
        filename : 'js/base.js'
    }),
    //把css单独打包到文件里
    new ExtractTextPlugin("css/[name].css"),
    //html模板的处理(一个页面的配置一个new),多个页面的话构建函数，传值即可
    new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
    new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表')),
    new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情')),
    new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
    new HtmlWebpackPlugin(getHtmlConfig('order-confirm', '订单确认')),
    new HtmlWebpackPlugin(getHtmlConfig('order-list', '订单列表')),
    new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情')),
    new HtmlWebpackPlugin(getHtmlConfig('payment', '订单支付')),
    new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
    new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
    new HtmlWebpackPlugin(getHtmlConfig('result','操作结果')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
    new HtmlWebpackPlugin(getHtmlConfig('about','关于MMall')),
    ]
};
//开发环境中会加上webpack-dev-server开发工具，到线上时不加入
if('dev'===WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}
module.exports=config;
// webpack提供两个工具处理样式表，css-loader 和 style-loader，
// 二者处理的任务不同，
// css-loader使你能够使用类似@import 和 url(...)的方法实现 require()的功能,
// style-loader将所有的计算后的样式加入页面中，
// 二者组合在一起使你能够把样式表嵌入webpack打包后的JS文件中。


// 插件（Plugins）是用来拓展Webpack功能的，
// 它们会在整个构建过程中生效，执行相关的任务。
// Loaders和Plugins常常被弄混，但是他们其实是完全不同的东西，
// 可以这么来说，loaders是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），
// 一次处理一个，插件并不直接操作单个文件，它直接对整个构建过程其作用。

// HtmlWebpackPlugin
// 这个插件的作用是依据一个简单的index.html模板，
// 生成一个自动引用你打包后的JS文件的新index.html。
// 这在每次生成的js文件名称不同时非常有用（比如添加了hash值）。
