var http = require("http");
var fs = require("fs");
var template = require("art-template"); //第三方包需要重新下载安装依赖包，npm install，下载的依赖包会默认安装到node_modules文件夹中
var url = require("url");

var comments = [
	{
		name:"张三",
		message:'今天天气不错',
		time:'2019-03-04'
	},
	{
		name:"lisi",
		message:'今天天气不错',
		time:'2019-03-04'
	},
	{
		name:"mazi",
		message:'今天天气不错',
		time:'2019-03-04'
	},
	{
		name:"zhuzhu",
		message:'今天天气不错',
		time:'2019-03-02'
	}
]
// var server = http.createServer();
// server.on("request",function(){
// });
// server.listen(3000,function(){});
//简写方式：
http
	.createServer(function (req, res){
		// console.log('req---------------',req);
		//url.parse()方法，解析URL成对象，
		//第二个参数设为true表示将url中返回的query查询字符串解析成对象的结构，
		//否则就是将query返回为没有解析也没有解码的字符串
		var urlObj = url.parse(req.url,true);

		//取解析后的url对象中的pathnam，单独获取不包含查询字符串部分的路径
		var pathname = urlObj.pathname;

		if(pathname == "/"){
			fs.readFile("./view/index.html", function(err, data){
				if(err){
					return res.end("404 not found");
				}
				var htmlStr = template.render(data.toString(),{
					comments: comments
				})
				res.end(htmlStr);
			})
		}else if(pathname.indexOf('/public/') === 0){
			//希望输入的url中直接表示想要访问的文件路径，如  /public/css/main.css
			//统一处理：
			//	如果请求路径是以public开头的，则认为需要获取public中的某个资源
			//	所以直接把请求路径当做文件路径直接获取
			//  可以直接通过代码控制用户可以访问的文件
			fs.readFile('.'+pathname, function(err,data){
				if(err){
					res.setHeader("Content-Type","text/plain;charset=utf-8")
					return res.end("404 not found")
				}
				res.end(data)
			})
		}else if(pathname == "/post"){
			fs.readFile("./view/post.html",function(err,data){
				if(err){
					res.setHeader("Content-Type","text/plain;charset=utf-8")
					return res.end("404 not found")
				}
				res.end(data)
			})

		}else if(pathname == '/pinglun'){
			//res.end(JSON.stringify(urlObj.query,null,"    "))
			//给留言列表comments增添新数据
			comment = urlObj.query;
			comment.time = Date();
			comments.unshift(comment);

			//页面重定向到首页
			res.statusCode = 302;
			res.setHeader('Location','/');
			res.end();
		}else if(pathname == '/postComment'){
			var data = '';
			var dataObj = [];
			//2.注册data事件接收数据（每当收到一段表单提交的数据，该方法会执行一次）
			req.on('data', function (chunk) {
				// chunk 默认是一个二进制数据，和 data 拼接会自动 toString
				data += chunk;
				console.log(data);
				data = data.split("&");

				for(let value of data){
					var messArr = value.split("=");
					dataObj[messArr[0]] = messArr[1];
				}
				console.log('dataObj-------',dataObj)
				comments.unshift(dataObj);
				// 页面重定向到首页
				res.statusCode = 302;
				res.setHeader('Location','/');
				res.end();
		});
		}else{
			res.setHeader("Content-Type","text/plain;charset=utf-8")
			return res.end("这个路径不可以哦")
		}	
				
	})//返回的是server对象所以直接用连续操作
	.listen(5000, function (){
		console.log("running...in 5000");
	})