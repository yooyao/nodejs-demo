// function route(handle, pathname, response, postData) {
function route(handle, pathname, response, request) {
    console.log("About to route a request for " + pathname);;
    if(typeof handle[pathname] === "function"){
      // 阻塞
      // return handle[pathname]();
      // handle[pathname](response, postData);
      handle[pathname](response, request);
    }else{
      console.log("no request handler found for "+pathname);
      // return "404 not found"
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not found");
      response.end();
    }
  }
  
  exports.route = route;