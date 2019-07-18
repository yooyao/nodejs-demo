const Koa = require('koa');
// const router = require("koa-router")();  //引入的是一个函数
//bodyParser解析原始request请求中的body，然后，把解析后的参数，绑定到ctx.request.body中。
//原始的默认表单提交方式中，body中的内容是查询字符串格式
const bodyParser = require("koa-bodyparser");  
const nunjucks = require('koa-nunjucks-2');       // 引入模板引擎
const path = require('path');

const controller = require('./controller');
const staticFiles = require('./staticfiles');

const app = new Koa();
app.use(staticFiles('/static/',__dirname+'/static'));

app.use(nunjucks({
         ext: 'html',                               // 指定视图文件默认后缀
         path: path.join(__dirname, 'views'),       // 指定视图目录
         nunjucksConfig: {
                   trimBlocks: true                 // 开启转义，防止Xss漏洞
         }
}));

//通过app.use()注册async函数，async函数作为中间件方法
app.use(async (ctx, next)=>{
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next();  //调用下一个middleware
})

app.use(async (ctx, next)=>{
    const start = new Date().getTime();
    await next();
    const ms = new Date().getTime()-start;
    console.log(`Time: ${ms}ms`);

})

//bodyParser需要在router之前注册到app对象上
app.use(bodyParser());

// add router middleware:
app.use(controller());

app.listen(3000);
console.log("app start at port 3000");

