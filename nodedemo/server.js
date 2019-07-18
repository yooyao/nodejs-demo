const http = require("http");
const url = require("url");

const start = (route, handle)=>{
    const onRequest=(request,response)=>{
        let pathname = url.parse(request.url).pathname;
        console.log("request for "+ pathname + " received");
        
        // 方法1.以下使用阻塞的方式处理请求
        // let content = route(handle, pathname);
        // console.log('content',content);

        // response.writeHead(200,{"Content-Type":"text/plain"});
        // response.write(content);
        // response.end();
        
        // 方法2. 为了采用非阻塞的方式来处理路由请求
        // 将response对象（从服务器的回调函数onRequest()获取）通过请求路由传递给请求处理程序
        // route(handle, pathname, response);

        // //3. 新场景，处理post请求
        // let postData = "";
        // request.setEncoding("utf8");
        // //Node.js会将POST数据拆分成很多小的数据块postDataChunk，然后通过触发特定的事件，将这些小数据块传递给回调函数。
        // //这里的特定的事件有data事件（表示新的小数据块到达了）以及end事件（表示所有的数据都已经接收完毕）。
        // //注册监听器（listener）
        // request.addListener("data",(postDataChunk)=>{
        //     postData += postDataChunk;
        //     console.log("Received POST data chunk '"+ postDataChunk + "'.");
        // })

        // request.addListener('end',()=>{
        //     route(handle, pathname, response, postData);
        // })

        //4. 新场景，处理上传图片，不在需要postData了，而是选择将request直接进行处理

        route(handle, pathname, response, request);

    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started");

}

exports.start = start;