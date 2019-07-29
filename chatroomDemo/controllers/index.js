const TEST_ACCOUNT = require('../accountDev.js')

const fn_index = async (ctx, next) => {
    //检查是否已登录用户
    let user = ctx.state.user;
    console.log('ctx.state.user',ctx.state.user)
    if(user){
        await ctx.render('chat',{
            titile:"chatroom",
            user:user
        });
    }else{
        //这里是一个异步操作，一定要加上await，否则是不能够获取到数据的
        //ctx.render(view, model)，MVC模式
        await ctx.render('index', {
            title: "login",
            message: "Welcome please login"
        })
    }
};

//验证账户是否存在，并验证密码
const fn_authentication = (username, password) =>{
    for(var user in TEST_ACCOUNT){
        if(user === username){
            return TEST_ACCOUNT[user] === password;
        }
    }
    return false;
}

const fn_login = async (ctx, next)=>{
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';

    if(fn_authentication(name, password)){
        let date = new Date();
        date.setMinutes(date.getMinutes()+5);  //设置两分钟过期时间
        ctx.cookies.set(
            'username',
            name,
            {
                path: '/',  
                httpOnly: false,
                maxAge: 300000,  //以毫秒为单位
                expires: date
            }
        );        
        console.log(`ctx.cookies ${ctx.cookies.get('username')}`);

        ctx.response.redirect('/chat')
    }else {
        await ctx.render('index', {
            title: "login",
            message: "The account is invalid, please log in again!"
        });
    }
};

module.exports = {
    'GET /': fn_index,
    'GET /login': fn_index,
    'POST /login': fn_login
}