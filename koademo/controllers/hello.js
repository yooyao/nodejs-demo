
const fn_hello = async (ctx, next)=>{
    var name = ctx.params.name;  
    //Named route parameters are captured and added to ctx.params.
    console.log(ctx.params);
    // ctx.response.body = `<h1>Hello,${name}!`
    await ctx.render('hello',{name:name})
};

module.exports = {
    'GET /hello/:name' : fn_hello
}
