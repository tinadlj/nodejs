var express = require('express');
var router = express.Router();
var mongo=require("mongodb");
var db=require("monk")('localhost/nodeblog');

/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.render('addcategories',{
    "title":"Add Category"
  });
});

router.post('/add',function(req,res,next){
    //get form values
    var title=req.body.title;
  
    //form validation
    req.checkBody("title",'Title field is required').notEmpty();
	
	//check for errors
	var errors=req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors": errors,
			"title":title,
			"Body":body
		});
	}else {
		var categories = db.get('categories');
        categories.insert({
            "title":title
        },function(err,category){
            if(err) {
                res.send('There was an issue submitting the category.')
            }
            else{
                req.flash('success','You add a category successfully!');

                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
