var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET Contact page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send',function(req,res,next){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: "tinadlj@gmail.com",
			pass: "dailijuan@)!)"
		}
	});

	var mailoptions={
		from:'Tina<dailijuan135@gmail.com>',
		to:'tinadlj@gmail.com',
		subject: 'Website Submission',
		text: ' You have a new submission with following details... Name' + req.body.name +'Email' + req.body.email +'Message' + req.body.message,
		html: '<p>You got a new submission with the following details</p><ul><li>Name: '+req.body.name + '</li><li>Email: '+req.body.email + '</li><li>Message: '+req.body.message + '</li></ul>'
	};

	transporter.sendMail(mailoptions,function(err,info){
		if(err) {
			console.log(err);
			res.redirect('/');
		}else{
			console.log('Message sent' + info.response);
			res.redirect('/');
		}
	})
});

module.exports = router;
