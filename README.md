# nodejs-demo
nodejs-demo，学习中的小实例

feedback 是直接使用原生node去搭建的一个简陋的留言板页面
- 留言板的数据直接是保存在全局变量之中，
- 路由处理直接使用了if else的方式，根据不同的路由来读取文件（fs.readFile）
- public中的静态公共资源没有进行处理，只是分了一个文件夹，表示一哈。。。。

koademo 是根据廖雪峰的koa教程，简单使用koa实现服务器搭建、路由控制，并整合成MVC模式
- 使用koa-router插件来处理路由，将放置在app.js文件中的路由注册全部抽离出来，变成controller.js和controllers文件夹
  - controllers中防止了所有的路由处理函数，然后暴露出来
  - controller.js对controllers文件夹中的所有 .js 文件做一个自动的遍历，引入所有的处理函数对象，根据设置的对象名来进行路由注册
- 编写了staticFiles 作为处理静态资源请求的中间件
- 实现了一个简单地用户登录功能，用来作为处理post请求的练习
