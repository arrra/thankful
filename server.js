var _allPosts = []; // Local array of posts

function getIncompletePosts() {
  return _allPosts.filter(function(post){
    return post.completed === false;
  });
}

function getCompletePosts() {
  return _allPosts.filter(function(post){
    return post.completed === true;
  });
}

function markAsCompleted(uid) {
  for (var i = 0; i < _allPosts.length; i++) {
    var post = _allPosts[i];
    if (post.uid == uid) {
      post.completed = true;
      return;
    }
  }
}

var _nextPostUid = 1;
function Post(text) {
  this.uid = _nextPostUid++;
	this.text = text;
  this.completed = false;
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
          posts: getIncompletePosts(),
			    completed: getCompletePosts(),
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
			var postIndex = qs.parse(bodyTwo).removePost;
      markAsCompleted(postIndex);

			res.writeHead(302,{'Location':'/'});
			res.end();
		});

	} else {
		res.end();
	}
});
server.listen(8080);

