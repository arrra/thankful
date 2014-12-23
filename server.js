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
       fs = require('fs'),
       url = require('url'),
	qs = require('querystring');

var server = http.createServer();
server.on('request',function(req,res){
	var pathName = url.parse(req.url).pathname;//url.parse returns object and get propert "pathname"

	
	if( pathName == '/'){
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
	} else if (pathName == '/search') {
		var body = '';
		req.on('data',function(data){
			body += data;	
		});
		req.on('end',function(){
			var postText = qs.parse(body).search;	
			_allPosts.push(new Post(postText));
			res.writeHead(302,{'Location':'/'});
			res.end();
		});
	}else{
		res.end();
	}
});
server.listen(8080);
 
