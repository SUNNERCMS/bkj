# 埠口集电商平台项目的开发
记录开发过程中的点滴、、、
## 用户模块开发
### 用户模块涉及的页面
1、登录 2、注册 3、找回密码 4、个人中心 5、修改密码
### 页面的功能点以及前后台连接接口
- 登录页面功能点：（1）将姓名和密码做字段验证，通过后提交给后端接口。（2）接口返回成功，跳转到登录前的页面或者首页（3）接口请求失败做错误处理。  
所需接口：提交登录接口  
- 注册页面功能点：（1）对用户名异步验证：当输入用户名后就能立即看到该用户名能否已经被注册。（2）接口返回成功，跳转到结果页来显示用户注册成功。（3）接口请求失败做错误处理。  
所需接口：（1）判断用户名是否存在的接口（2）提交注册接口  
- 找回密码功能点：（1）输入账号，获取密码提示问题（2）输入密码提示问题的答案进行验证。（3）提交修改后的密码。  
所需接口：（1）根据用户名获取密码提示问题的接口（2）根据用户名、问题和答案获取认证token接口.(3)根据用户名和认证token重置密码接口。  
- 个人中心页面功能点：
（1）显示个人信息（2）修改个人信息  
- 修改密码页面功能点：根据原密码和新密码来跟新用户密码。
### 1.登录页面开发  
- 登录页面功能点：（1）将姓名和密码做字段验证，通过后提交给后端接口。（2）接口返回成功，跳转到登录前的页面或者首页（3）接口请求失败做错误处理。  
所需接口：提交登录接口  
- 代码逻辑分析：建立页面对象统一处理业务，在这个对象中首先定义`init`初始化方法，初始化绑定事件（登录按钮点击事件+回车提交事件），进行表单提交，表单提交方法中应该包含获取表单信息的函数，表单信息验证的函数，表单信息验证成功或者失败的处理函数。  
- 主要代码段分析记录:
> 表单提交的两种方式：  
````js
    //按钮提交
    $('#submit').click(function(){
        _this.submit();
    });
    //如果按下回车，也进行提交
    $('.user-content').keyup(function(e){
        //回车键的判断
        if(e.keyCode===13){
            _this.submit();
        }
    });
````
> 业务逻辑主线部分: 
```js
 submit : function(){
                                                           //获取表单内容信息
        var formData={
            username : $.trim($('#username').val()),
            password : $.trim($('#password').val())
        },
        validateResult = this.formValidate(formData);  //对表单信息进行验证,此处为表单验证结果，验证返回的是reslut对象
        //验证成功
        if(validateResult.status){
                                                 //提交,用service中的_user.login()接口，将数据，成功操作，失败操作传给后台
            _user.login(formData,function(res){
                window.location.href =  _mm.getUrlParam('redirect')||'./index.html';//???'redirect'
            },function(errMsg){
                formError.show(errMsg);
            });
        }
        // 验证失败
        else{
            //错误提示
            formError.show(validateResult.msg);
        }
    },
```
> 表单字段验证函数:将登录表单中的用户名和密码的数据存放到对象`formData`中，然后传给`formValidate(formData)`进行验证。
> 验证结果用result对象缓存返回给`validateResult`，此时`validateResult`就是result对象，包含验证成功与否的标志位和提示信息。
````js
    formValidate : function(formData){
        var result={
            status  : false,
            msg     : ''
        };
        //如果username栏为空,不能通过验证，显示返回提示信息和satus=false,传入validateResult,其值就是result对象
        if(!_mm.validate(formData.username,'require')){
            result.msg = '用户名不能为空';
            return result;
        }
        if(!_mm.validate(formData.password,'require')){
            result.msg = '密码不能为空';
            return result;
        } 
        //如果验证通过,返回正确提示
         result.status = true;
         result.msg    = '验证通过';
         return result;       //表单信息验证后的结果
    }
````

