//controller.js用于扫描controllers文件夹，把url处理函数遍历注册到每个url上
//这样就避免在app.js中反复的添加 router.get()，router.post()这样的代码，导致app.js内容越来愈多
const fs = require('fs');

//把引出的具体的controller/XX.js文件中的对象导出，遍历，注册每个url
function addmapping (router, mapping){
    for(var url in mapping){
        if(url.startsWith('GET')){
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        }else if (url.startsWith('POST')){
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        }else{
            console.log(`invalid URL: ${url}`);
        }
    }
}   

//扫描controllers目录
function addControllers(router, dir){
    //readdirSync列出文件， 这里可以用sync是因为启动时只运行一次，不存在性能问题:
    var files = fs.readdirSync(__dirname + '/' + dir);

    //过滤出每个js文件
    var js_files = files.filter((item)=>{
        console.log(item)
        return item.endsWith('.js');
    })

    for(var f of js_files){
        //导入各个文件对象
        var mapping = require(__dirname+'/'+dir+'/'+f);
        addmapping(router, mapping);
    }
}

module.exports = function (dir) {
    let 
        controllers_dir = dir || 'controllers',  //不传入dir则默认使用controllers
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();

}