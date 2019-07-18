const fn_chat = async (ctx, next)=>{
    await ctx.render('chat')
};

module.exports = {
    'GET /chat' : fn_chat
}
