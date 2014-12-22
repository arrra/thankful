
var _allPosts = [
	new Post("I'm thankful for code 1"),
	new Post("I'm thankful for code 2"),
	new Post("I'm thankful for code 3")
]; // Local array of posts

function Post(text) {
	this.text = text;
}

var http = require('http'),
    hogan = require('hogan.js'),
       fs = require('fs');

var server = http.createServer();
server.on('request',function(req,res){

	if(req.url == '/'){
		fs.readFile('index.html',{encoding:'utf8'},function(err,contents){
			if(err){
				throw err; 
				return ; 
			}
			var template = hogan.compile(contents);
			var renderedHTML = template.render({posts: _allPosts});
			res.setHeader('Content-Type','text/html');
			res.end(renderedHTML);
		});
	}
});
server.listen(8080);
