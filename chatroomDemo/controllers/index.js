const fn_index = async (ctx, next) => {
    //这里是一个异步操作，一定要加上await，否则是不能够获取到数据的
    //ctx.render(view, model)，MVC模式
    await ctx.render('index', {title: "Welcome login"})
};

const fn_signin = async (ctx, next)=>{
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';

    console.log(`signin with name: ${name}, password: ${password}`);
    if(name == "koa" && password == "12345"){
        ctx.response.body = `<h1>welcome, ${name}!</h1>`;

    }else {
        ctx.response.body = `<h1>Login failed</h1>`;
    }
};

module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin
}