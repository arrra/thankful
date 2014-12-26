var _allPosts = []; // Local array of posts

var _completedPosts = [];//Local array of completed post

function Complpost(text){
	this.text = text;
}       

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
			var renderedHTML = template.render({
				posts: _allPosts,
			    completed: _completedPosts,
			    noPosts: _allPosts.length == 0//dynamiclly updates and print"no "post"
			});
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

	}else if(pathName == '/remove') {

		var bodyTwo = '';
		req.on('data',function(data){
			bodyTwo += data;
		});
		req.on('end',function(){
			var deletePost = qs.parse(bodyTwo).removePost;
			for(var i = 0; i < _allPosts.length;i++){
				if(i == deletePost){
					var completedItem =_allPosts[i];//get item to remove
					_completedPosts.push(completedItem);//push removed item
					_allPosts.splice(i,1);
				}
			}
			res.writeHead(302,{'Location':'/'});
			res.end();
		});

	} else {
		res.end();
	}
});
server.listen(8080);

