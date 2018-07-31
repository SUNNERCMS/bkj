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
功能实现的主要业务逻辑
