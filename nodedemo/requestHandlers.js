var exec = require("child_process").exec;
var querystring = require('querystring'),
    fs = require("fs"),
    util = require("util"),
    formidable = require("formidable");

function start(response) {
    console.log("Request handler 'start' was called.");
    function sleep(milliSeconds){
        var startTime = new Date().getTime();
        while(new Date().getTime() < startTime +milliSeconds);
        console.log("sleep over")
    }
    //1.阻塞 
    // sleep(5000);    
    // return "hello start"; 
    //模拟休眠5秒（比如一些查询操作，还有一些大量计算的操作），
    //在快速依次打开 http://localhost:8888/ 和http://localhost:8888/upload的时候
    //upload页面也会发生五秒休眠，其实这是因为使用return 操作是同步的（阻塞）,休眠导致页面的请求被阻塞了
    //要用非阻塞操作，我们需要使用回调

    //2.非阻塞
    // exec("find /",
    //     { timeout: 10000, maxBuffer: 20000*1024 },
    //     function (error, stdout, stderr) {
    //         response.writeHead(200, {"Content-Type": "text/plain"});
    //         response.write(stdout);
    //         response.end();
    //     }
    // );

    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

//处理post数据
// function upload(response, postData) {
//     console.log("Request handler 'upload' was called.");
//     // return "hello upload";

//     response.writeHead(200,{'Content-Type':'text/plain; charset=UTF-8'})    //charset=UTF-8,规定编码，以显示中文
//     response.write("You've sent: "+ querystring.parse(postData).text);      //querystring.parse(postData)，解析post请求体中的参数
//     response.end();
// }

//处理上传图片，涉及到读取文件
function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    //创建一个默认临时路径，保证fs.renameSync的时候处在同一磁盘分区
    //如果不创建临时路径，会由于磁盘分区导致，“ ENOENT: no such file or directory”或者“ cross-device link not permitted”
    //因为是上传文件在C，保存文件路径在E， C: -> E，跨磁盘
    form.uploadDir='tmp';  
    form.parse(request,function(error, filds, files){
        console.log("parse down ");
        // 同步操作文件，需要try catch
        try{
            fs.renameSync(files.upload.path, "tmp/animal.jpg");
            //很奇怪，如果说把路径写成 "/tmp/animal.jpg"，那么就不会再tmp目录下生成名为animal.jpg的文件，也就是不会吧文件重命名，而是一串编号
        }catch(e){
            console.log(e);
        }
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        //util.inspect(object,[showHidden],[depth],[colors]) 是一个将任意对象转换为字符串的方法，通常用于调试和错误输出。
        // response.write(util.inspect({filds:filds, files:files}))
        response.end();
    })
}

function show(response){
    console.log("Request handler 'show' was called.");
    //readfile 的路径需要注意，如果说写成了"/tmp/animal.jpg"，就是从磁盘根目录开始找，也就是E:\tmp\animal.jpg，是找不到的，所以用相对路径
    fs.readFile("./tmp/animal.jpg","binary",function(error, file){
        if(error){
            response.writeHead(500,{'Content-Type':'text/plain'});
            response.write(error+"\n");
            response.end();
        }else{
            response.writeHead(200,{"Content-Type":"image/jpg"});
            response.write(file,"binary");
            response.end();
        }
    } )
}

exports.start = start;
exports.upload = upload;
exports.show = show;