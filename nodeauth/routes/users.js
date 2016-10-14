var express = require('express');
var router = express.Router();
var passport=require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User=require('../models/user'); //user model


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render("register",{
  	'title': 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render("login",{
  	'title': 'Login'
  });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/contact',function(req,res,next){
    console.log(req.body);
    res.render('index', { title: 'Members' });
});



router.post('/register',function(req,res,next){
	console.log('enter post\n');
	console.log(req.query.name);

	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;

	//check for image field
	if(req.files && req.files.profileimage){
		console.log('Uploading File...');

		var profileImageOriginalName=req.files.profileimage.originalname;
		var profileImageName=req.files.profileimage.name;
		var profileImageMime=req.files.profileimage.mimetpye;
		var profileImagePath=req.files.profileimage.path;
		var profileImageExt=req.files.profileimage.extension;
		var profileImageSize=req.files.profileimage.size;
	} 
	else{
		var profileImageName='noimage.png';
	}
	console.log(profileImageName);
	console.log('enter validation\n');
	//form validation
	req.checkBody("name",'Name field is required').notEmpty();
	req.checkBody("email",'Email field is not valid').isEmail();
	req.checkBody("email",'Email field is required').notEmpty();
	req.checkBody("password",'Password field is required').notEmpty();
	req.checkBody("password2",'Password do not match').equals(req.body.password);

	//check for errors
	var errors=req.validationErrors();

	if(errors){
console.log(errors);
		res.render('register',{
			errors: errors,
			name:name,
			email:email,
			username:username,
			password:password,
			password2:password2
		});
	}else {
		var newUser = new User({
			//errors: errors,
			name:name,
			email:email,
			username:username,
			password:password,
			profileimage: profileImageName
		});
console.log('enter createUser\n');
		//Create user
		User.createUser(newUser,function(err,user){
			if(err) throw err;
			console.log(user);
		});

		//success message
		req.flash('success','You are now registered and may log in');

		res.location('/');
		res.redirect('/');
	}
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local',new LocalStrategy(
	function(username,password,done){
console.log('enter passport');
		User.getUserByUserName(username,function(err,user){
			if(err) {
//console.log(err);
				throw err;
			}
			if(!user) {
				console.log('Unknown user');
				return done(null,false,{message:'Unknow User'});
			}
//console.log(user);
			User.comparePassword(password,user.password,function(err,isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null,user);
				}else{
					console.log('Invalid Password');
					return done(null,false,{message:'Invalid Password'});
				}
			})
		})
	}
));

/*router.post('/login',function(req,res,next){
    console.log(req.body);
    res.redirect('/users/login');
});*/

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid username or password'}),function(req,res){
	console.log('Authentication Successful');
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

router.get('/logout',function(req,res){
	req.logout();
	req.flash("success","You are successfully logout!")
	res.redirect('/');
});

module.exports = router;
