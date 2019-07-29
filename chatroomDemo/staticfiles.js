/**
 * 关于静态资源处理的中间件
 */
const path = require('path');
const mime = require('mime');
//mz提供的API和Node.js的fs模块完全相同，但fs模块使用回调，
//而mz封装了fs对应的函数，并改为Promise。
//这样，我们就可以非常简单的用await调用mz的函数，而不需要任何回调。
const fs = require('mz/fs');

// url: 如果说资源放在static下，就是'/static/'
// dir: 如：__dirname + '/static'
function staticFiles(url, dir){
    return async (ctx, next)=>{
        let reqpath = ctx.request.path;
        console.log('reqpath', reqpath);
        //判断是否以指定的url开头，也就是是否是请求静态资源
        if (reqpath.startsWith(url)){
            //获取完整资源路径
            let fp = path.join(dir,reqpath.substring(url.length));
            //判断文件是否存在
            if( await fs.exists(fp)){
                //查找文件的mime 类型
                ctx.response.type = mime.getType(reqpath);
                // 读取文件内容并赋值给response.body
                ctx.response.body = await fs.readFile(fp);
            }else{
                ctx.response.body = await fs.readFile(fp);
            }
        }else{
            //不是指定前缀的url，继续处理下一个middleware
            await next();
        }
    }
}

module.exports = staticFiles;