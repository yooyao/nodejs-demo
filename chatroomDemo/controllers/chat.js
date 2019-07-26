const fn_chat = async (ctx, next)=>{
    await ctx.render('chat',{title:'WebSocket 聊天室'})
};

module.exports = {
    'GET /chat' : fn_chat
}
