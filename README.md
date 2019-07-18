# nodejs-demo
nodejs-demo，学习中的小实例

1. feedback 是直接使用原生node去搭建的一个简陋的留言板页面
- 留言板的数据直接是保存在全局变量之中，
- 路由处理直接使用了if else的方式，根据不同的路由来读取文件（fs.readFile）
- public中的静态公共资源没有进行处理，只是分了一个文件夹，表示一哈。。。。

2. koademo 是根据廖雪峰的koa教程，简单使用koa实现服务器搭建、路由控制，并整合成MVC模式
- 使用koa-router插件来处理路由，将放置在app.js文件中的路由注册全部抽离出来，变成controller.js和controllers文件夹
  - controllers中防止了所有的路由处理函数，然后暴露出来
  - controller.js对controllers文件夹中的所有 .js 文件做一个自动的遍历，引入所有的处理函数对象，根据设置的对象名来进行路由注册
- 编写了staticFiles 作为处理静态资源请求的中间件，先拦截客户端发过来的请求，判断是否是/static开头，如果是的便去读取相应的文件并返回文件内容作为响应
- 实现了一个简单地用户登录功能，用来作为处理post请求的练习

3. chatroom
- 基于websocket实现了一个群聊页面，关键内容在app.js中的websocket链接对象（注意区分ws和wss，ws是一个websocket链接对象（与一客户端建立气的链接），wss是websocket服务器对象），chat.js路由处理函数，chat.html是客户端页面
- websocketServer监听的端口和httpServer是同一个，不会相互影响
- 群聊思路：
  - 通过建立ws中的connection事件中的 req请求对象中的属性来获取建立连接的对象的信息（const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort），来对每个客户端连接进行区分
  - 当服务器收到message，就将其进行广播，通过WebSocket Server 的clients 属性（它是已经建立起连接的 WebSocket 数组），将消息转发到每一个客户端。
- 暂时没有做登录处理，每打开一个页面就是一个用户
- 由于chatroom是基于上一个koademo来做的，所以混带着很多上一个小demo的内容，后续再整理~

4. nodedemo
- 根据《node入门》https://www.nodebeginner.org/index-zh-cn.html完成
- 使用handle 对象作为请求处理的集合，不同的url被映射到对应的处理程序，避免了长串而难看的if else的路由处理方式
- 强调依赖注入的方式，可以较松散地添加路由模块
- 实现了node对于post请求的处理，实现了图片的上传和展示
