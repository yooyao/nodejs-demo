## chatroom多人聊天室
### 简介
基于先前的实现的koa项目来制作聊天室，可以方便的通过MVC开发模式，完成前后端的工作。
聊天室具有简单的用户登录和群聊功能。

### 登录实现:
- 暂时没有将用户数据和数据库对接，所以没有新用户注册，只是写死了测试账户，通过node处理post请求，并验证用户名和密码是否正确。
- 通过设置cookie，实现用户状态保持。
### 群聊实现：
- 在app.js中创建websocket链接对象（注意区分ws和wss，ws是一个websocket链接对象（与一客户端建立气的链接），wss是websocket服务器对象），websocketServer监听的端口和httpServer是同一个，不会相互影响
- 通过建立ws中的connection事件的req请求对象的属性来获取建立连接的对象的信息（const ip = req.connection.remoteAddress; const port = req.connection.remotePort），来对每个客户端连接进行区分
- 当服务器收到message，就将其进行广播，通过WebSocket Server 的clients 属性（它是已经建立起连接的 WebSocket 数组），将消息转发到每一个客户端。

由于chatroom是基于上一个koademo来做的，所以混带着很多上一个小demo的内容，后续再整理~
