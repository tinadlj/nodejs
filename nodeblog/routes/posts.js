var express = require('express');
var router = express.Router();
var mongo=require("mongodb");
var db=require("monk")('localhost/nodeblog');

router.get('/add',function(req,res,next){
    var categories=db.get("categories");
    categories.find({},{},function(error,categories){
        res.render('addpost',{
                "title":"Add Post",
                "categories":categories
        });
    })
});

router.get('/show/:id',function(req,res,next){
    var db=req.db;
    var posts=db.get('posts');
    posts.findById(req.params.id,function(err,post){
        if(err) throw err;
        res.render('show',{
            'post':post
        });
    });
});

router.post('/addcomment',function(req,res,next){
    //get form values
    var name=req.body.name;
    var email=req.body.email;
    var body=req.body.body;
    var id=req.body.postid;
    var date=new Date();

    //form validation
    req.checkBody("name",'Name field is required').notEmpty();
    req.checkBody("email",'Email field is required').notEmpty();
	req.checkBody("email",'Body field is not valid').isEmail();
	req.checkBody("body",'Body field is required').notEmpty();

	//check for errors
	var errors=req.validationErrors();

	if(errors){
        var posts=req.db.get("posts");
        posts.findById(id,function(err,post){
            res.render('show',{
                "errors": errors,
                "post":post
            });
        });
	}else {
		var comment={"name":name,"email":email,"body":body,"commentdate":date};
        var posts=req.db.get("posts");
        posts.update({"_id":id},
            {
                $push:{
                        "comments":comment
                     }
            },function(err,doc){
                if(err) throw err;
                req.flash("success","Comment added");
                res.location('/posts/show/'+id);
                res.redirect('/posts/show/'+id);
            });
    }
});

router.post('/add',function(req,res,next){
    //get form values
    var title=req.body.title;
    var category=req.body.category;
    var body=req.body.body;
    var author=req.body.author;
    var date=new Date();

    if(req.files && req.files[0]){
        var mainimageOriginalName=req.files[0].originalname;
        var mainImageName=req.files[0].filename;
        var profileImageMime=req.files[0].mimetype;
		var profileImagePath=req.files[0].path;
		var profileImageExt=req.files[0].extension;
		var profileImageSize=req.files[0].size;
    }else{
        var mainimageOriginalName='noimage.png';
    }

    //form validation
    req.checkBody("title",'Title field is required').notEmpty();
	req.checkBody("body",'Body field is valid');

	//check for errors
	var errors=req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors": errors,
			"title":title,
			"Body":body
		});
	}else {
		var posts = db.get('posts');
        posts.insert({
            "title":title,
            "body":body,
            "category":category,
            "date":date,
            "author":author,
            "mainimage":mainImageName
        },function(err,post){
            if(err) {
                res.send('There was an issue submitting the post.')
            }
            else{
                req.flash('success','You insert a post successfully!');

                res.location('/');
                res.redirect('/');
            }
        })
    }
});

router.get('/show/:category', function(req,res,next){
    var db=req.db;
    var posts=db.get("posts");
    posts.find({category:req.params.category},{},function(err,posts){
        if(err) throw err;

        res.render('index',{
            "title":req.params.category,
            "posts":posts
        })
    });
})

module.exports=router;