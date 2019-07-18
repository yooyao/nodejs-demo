const Koa = require('koa');
// const router = require("koa-router")();  //引入的是一个函数
//bodyParser解析原始request请求中的body，然后，把解析后的参数，绑定到ctx.request.body中。
//原始的默认表单提交方式中，body中的内容是查询字符串格式
const bodyParser = require("koa-bodyparser");  
const nunjucks = require('koa-nunjucks-2');       // 引入模板引擎
const path = require('path');
const WebSocket = require('ws');
//创建websocketServer
const WebSocketServer = WebSocket.Server;

//自定义模块
const controller = require('./controller');
const staticFiles = require('./staticfiles');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse user from cookie:
// 保存在ctx.state 
app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '');
    await next();
});

app.use(staticFiles('/static/',__dirname+'/static'));

app.use(nunjucks({
         ext: 'html',                               // 指定视图文件默认后缀
         path: path.join(__dirname, 'views'),       // 指定视图目录
         nunjucksConfig: {
                   trimBlocks: true                 // 开启转义，防止Xss漏洞
         }
}));

//bodyParser需要在router之前注册到app对象上
app.use(bodyParser());

// add router middleware:
app.use(controller());

let server = app.listen(3000);
// console.log('server', server);

//解析用户
function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        //传入的是request请求对象

        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}


//websocketServer实例化
//把WebSocketServer绑定到同一个端口的关键代码是先获取koa创建的http.Server的引用，
//再根据http.Server创建WebSocketServer
//浏览器创建WebSocket时发送的仍然是标准的HTTP请求。
//无论是WebSocket请求，还是普通HTTP请求，都会被http.Server处理
//首先判断的是不是ws请求
const wss = new WebSocketServer({
    server:server
})

wss.on('open', function open() {
    console.log('connected');
  });
  
wss.on('close', function close() {
    console.log('disconnected');
});

wss.on('connection', function connection(ws, req){
    //ws是对某个client建立起来的websocket链接
    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    const clientName = ip + port;

    console.log(clientName,' is connected');

    ws.send("Welcome"+clientName);

    ws.on('message', function incoming(message){
        console.log(`received: ${message} from ${clientName} `);

        //广播给所有客户端
        //WebSocket Server 的clients 属性，它是已经建立起连接的 WebSocket 数组
        wss.clients.forEach(function each(client){
            if(client.readyState === WebSocket.OPEN){
                client.send(clientName+":"+message)
            }
        });
    });
});

console.log("app start at port 3000");
