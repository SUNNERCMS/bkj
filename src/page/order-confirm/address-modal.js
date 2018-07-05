/*
* @Author: SUNNERCMS
* @Date:   2018-05-26 16:43:20
* @Last Modified by:   SUNNERCMS
* @Last Modified time: 2018-06-03 14:53:50
*/
var _mm                    = require('util/mm.js'); //工具类
var _cities                = require('util/cities/index.js'); //省份城市组件
var _address               = require('service/address-service.js');//用于获取与地址相关的返回值
var templateAddressModal   = require('./address-modal.string');

// addressModal模块
var addressModal={
    show : function(option){
        //option的绑定
       this.option          = option;//把传入的参数放到option对象上，这样其它方法里也能用这些参数了.
       this.option.data     = option.data || {};
       this.$modalWrap      = $('.modal-wrap');
        //渲染页面，地址填写窗口被渲染出来，就可以绑定事件了
       this.loadModal();
       //绑定事件
       this.bindEvent();
    },
    bindEvent : function(){
        var _this = this;
        // 省份和城市二级联动
         this.$modalWrap.find('#receiver-province').change(function(){
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
         //提交收货地址
         this.$modalWrap.find('.address-btn').click(function(){
            var receiverInfo = _this.getReceiverInfo(),//通过该方法获取表单信息和验证是否通过的状态值
                isUpdate     = _this.option.isUpdate;
                //使用新地址，并且验证通过
                if(!isUpdate && receiverInfo.status){
                    //调用保存新地址接口，将表单信息传过去,
                    _address.save(receiverInfo.data,function(res){
                        _mm.successTips('地址添加成功');
                        _this.hide();  //清空、关闭弹出的地址窗口
                        typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                    },function(errMsg){
                        _mm.errorTips(errMsg);
                    });
                }
                //更新编辑地址，并且验证通过
                else if(isUpdate && receiverInfo.status){
                    _address.update(receiverInfo.data,function(res){
                        _mm.successTips('地址修改成功');
                        _this.hide();  //清空、关闭弹出的地址窗口
                        typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                    },function(errMsg){
                        _mm.errorTips(errMsg);
                    });
                }
                //验证没有通过
                else{
                    _mm.errorTips(receiverInfo.errMsg || '哪里出了问题！');
                }
        });
        //保证点击modal内容区时，阻止事件冒泡，不关闭弹窗
        this.$modalWrap.find('.modal-container').click(function(e) {
            e.stopPropagation();
        });
         //点击叉号和蒙版关闭地址弹窗
        this.$modalWrap.find('.close').click(function() {
            _this.hide();
        });
    },
    //渲染页面
    loadModal : function(){
        var  addressModalHtml = _mm.renderHtml(templateAddressModal,{
            isUpdate : this.option.isUpdate,
            data     : this.option.data  //将后台返回的data信息，以对象的属性放到option中，然后赋值给data用于渲染
        });
        this.$modalWrap.html(addressModalHtml);
        //加载省份
        this.loadProvince();
        //加载城市
        //this.loadCities();
    },
    //加载省份信息; 方法1.放在本地；方法2.从服务器读取，此处信息少采用放在本地，可以做个工具类来处理
    loadProvince : function(){
        var provinces=_cities.getProvinces() || [];
        $provinceSelect  = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));//对select做一些option，这个option可以通过方法来做，因为城市中也要用到。
        //如果是地址更新，并且有省份信息，则做省份的回填,把上面的加载城市的this.loadCities()拿过来
        if(this.option.isUpdate && this.option.data.receiverProvince){  //this.option.data.receiverProvince在添加时这里的data并没有值，
                                                            //在undefine上再取receiverProvince会报错，在上面进行这样的处理，this.option.data=option.data || {}
            $provinceSelect.val(this.option.data.receiverProvince);  //回填省份信息
            this.loadCities(this.option.data.receiverProvince);      //根据省份信息加载城市信息
        }
    },
    //加载城市信息
    loadCities : function(selectedProvince){
        var cities=_cities.getCities(selectedProvince) || [];
        $citySelect  = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));
        //如果是更新地址，并且有城市信息，做城市的回填
        if(this.option.isUpdate && this.option.data.receiverCity){  
            $citySelect.val(this.option.data.receiverCity);  //回填城市信息
        }
    },
    //获取select框的选项，输入array，输出<option></option>的HTML
    getSelectOption : function(optionArray){
        var html='<option value="">-请选择-</option>';
        for(var i=0,length=optionArray.length;i<length;i++){
            html+='<option value="'+ optionArray[i] +'">'+optionArray[i]+'</option>';
        }
        return html;
    },
    //获取表单信息的方法
    getReceiverInfo :function(){
        var receiverInfo = {}, //用来放表单信息，用于表单验证
            result       = {  //返回值，里面包括状态和数据，默认状态是表单验证不通过
                status:false
            }
        //将表单项内容拿出来放到receiverInfo对象中
        receiverInfo.receiverName     = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity     = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress  = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone    = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip      = $.trim(this.$modalWrap.find('#receiver-zip').val());
        //如果是编辑地址，那么需要传给后台地址的ID，知道编辑的是哪一个地址，也应该在地址窗口中取，设置一个隐形表单即可
        if(this.option.isUpdate){
            receiverInfo.id           = this.$modalWrap.find('#receiver-id').val();
        };
        //表单验证
        if(! receiverInfo.receiverName){
            result.errMsg = '请输入收件人姓名' ;
        }else if(!receiverInfo.receiverProvince){
             result.errMsg = '请输入收件人所在省份'; 
        }else if(!receiverInfo.receiverCity){
             result.errMsg = '请输入收件人所在城市'; 
        }else if(!receiverInfo.receiverAddress){
             result.errMsg = '请输入收件人详细地址'; 
        }else if(!receiverInfo.receiverPhone){
             result.errMsg = '请输入收件人手机号'; 
        }
        //表单验证全部通过
        else{
            result.status = true;
            result.data   = receiverInfo;
        }
        return result; //result中包含status和data
    },
    //关闭地址弹窗，采用清空的方法，从被选元素移除所有内容，包括所有文本和子节点
    hide:function(){
     this.$modalWrap.empty();   
    }
};
module.exports=addressModal;
// 地址模块的开发
// 加载省份信息：1、利用cities中的getProvinces()方法，返回数组中各省的名字。
//               2、通过一个方法将省份放到<option>省份</option>这样的HTML中，然后将众多option标签放到选者框的HTML中
// 将包含省份的数组，转换为可以放到select中的option方法：
//               1、定义一个初始显示栏，然后遍历数组获取省份名字，通过''+将众多option连接起来，之后作为一个整体的html返回。              
// 城市的加载需要根据省份来决定，-》怎样取得某个具体省份的信息，需要在省份选择框上加个change事件，
// 之后触发一个函数，该函数中将选择的省份缓存住， 之后调用加载城市的函数，根据缓存值加载出来相应的城市信息。
// //提交收货地址 :把表单里的信息都拿出来，然后请求接口
// 提交之前需要（获取表单信息，并做表单验证）把他们做到一个方法里面之后返回
// result.errMsg 是某一项验证不通过时，相对应的提示信息，放到errMsg中，在绑定事件中通过_mm.errorTips(errMsg)进行弹框提示。
// 调用保存新地址接口:1-将拿到的表单信息传进去，由此得到相应的后台返回res，
//                    2-成功时进行以下步骤：（1）提示保存新地址成功（2）将地址窗口隐藏起来（3）执行回调函数，继续到主程序执行，
//                                           执行回调函数借用的是“&&”的执行函数性质，同时也将请求结果res进行了返回
//                    3-失败时，将后台错误提示弹出
// //添加新地址
        // $(document).on("click",'.address-add',function(){
        //     addressModal.show({
        //         isUpdate  : false,     
        //         onSuccess : function(){
        //             _this.loadAddressList();   
        //         }
        //     });
        // });                      
// var addressModal={
//     show : function(option){
//        this.option     = option;
// 因为上面的addressModal.show调用了该show方法，那么show里面的this指向了addressModal，
// 所以this.option就相当于addressModal.option={
                                    //         isUpdate  : false,     
                                    //         onSuccess : function(){
                                    //             _this.loadAddressList();   
                                    //         }
// 也即是在addressModal对象中新增加了一个属性，该属性值是个对象，并且这个option对象是由index.js传进来的
// 所以在其他函数里面可以使用 _this.option.isUpdate;来使用该对象里面的属性值和方法