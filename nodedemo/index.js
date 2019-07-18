//node入门，搭建服务器，并实现路由，图片文件上传和展示功能
let server = require("./server");
let router = require("./router");
let requestHandlers = require("./requestHandlers");

//handle 作为请求处理的集合，不同的url被映射到对应的处理程序
//这样的映射就避免了长串而难看的if else
const handle = {};
handle["/"] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;

//router是要被传入到 server中调用的，那为什么我不直接把require("./router")写在server里面，
//而是选择写在index再进行传递呢
//因为不应该让模块之间过度紧密耦合，使用依赖注入的方式较松散地添加路由模块是更好的方式
server.start(router.route, handle)