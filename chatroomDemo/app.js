const Koa = require('koa');
// const router = require("koa-router")();  //引入的是一个函数
//bodyParser解析原始request请求中的body，然后，把解析后的参数，绑定到ctx.request.body中。
//原始的默认表单提交方式中，body中的内容是查询字符串格式
const bodyParser = require("koa-bodyparser");  
const nunjucks = require('koa-nunjucks-2');       // 引入模板引擎
const path = require('path');

//自定义模块
const controller = require('./middleware/controller');
const staticFiles = require('./middleware/staticfiles');
const createWebSocketServer = require('./webSocketServer')

const app = new Koa();

//错误处理中间件，在最顶端运行
app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = 400
      ctx.body = `Uh-oh: ${err.message}`
      console.log('Error handler:', err.message)
    }
  })

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process request ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse user from cookie:
// 保存在ctx.state 
app.use(async (ctx, next) => {
    ctx.state.user = ctx.cookies.get('username') || '';
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
app.use(controller(__dirname, '/controllers'));

let server = app.listen(3000);

const wss = createWebSocketServer(server);

console.log("app start at port 3000");
