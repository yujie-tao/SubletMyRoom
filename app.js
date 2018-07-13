var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var expressValidator =require('express-validator')
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users'])

var app =express();

var multer = require('multer');


/*
var logger=function(req,res,next){
	console.log('Logging...')
	next();
}

app.use(logger);
*/

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static Path, read file like index.html, whichi will always overwrites what we have in app.js
app.use(express.static(path.join(__dirname,'public')));

// var person=[
// {
// 	name:'Jeff',
// 	age :30
// },
// {
// 	name:'Sara',
// 	age:22
// },
// {
// 	name:'Bill',
// 	age:40

// }
// ]

//Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
  }));

var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

// var users=[
//     {
//     	id: 1,
//     	first_name:'John',
//     	last_name:'Doe',
//     	email:'johndoe@gmail.com',
//     },

//     {
//     	id: 2,
//     	first_name:'Bob',
//     	last_name:'Smith',
//     	email:'bobsmith@gmail.com',
//     },

//     {
//     	id: 3,
//     	first_name:'Jill',
//     	last_name:'Jackson',
//     	email:'jjackson@gmail.com',
//     }
// ]


app.get('/',function(req,res){
	db.users.find(function(err,docs){
		console.log(docs);
		res.render('index',{
		title:'Customers', //passing a title to the view
		users: docs
	});
	})
	// res.send('Hello')
	// res.json(person)

});


app.get('/sublease', (req, res) => {
	res.render('sublease')
})

app.get('/sublease/view', (req, res) => {
	db.subleases.find((err, sls) => {
		res.send(JSON.stringify(sls))
	})
})

app.get('/sublease/all', (req, res) => {

	db.subleases.find(function (err, sls) {
		if (err) {
			res.send('errored')
		} else {
			console.log(sls)
			res.render('view_lease',{
				title:'View Lease', //passing a title to the view
				subleases: sls
			})
			
		}
	})
})

app.get('/sublease/one/:id', (req ,res) => {
	db.subleases.findOne({
		_id: mongojs.ObjectId(req.params.id)
}, function(err, doc) {
 if (err) {
 	res.status(404);} 
 	else {
 		res.render('description', {
 			sublease: doc});}
})

})

app.post('/sublease/one/:id/contact', (req ,res) => {
		db.subleases.findOne({
		_id: mongojs.ObjectId(req.params.id)
}, function(err, doc) {
 if (err) {
 	res.status(404);} 
 	else {
 		res.render('description', {
 			sublease: doc});}
})
})



app.post('/sublease/add', upload.any(), (req, res) => {
	let rb = req.body
	console.log(rb)
    console.log(typeof(req.files))
    console.log(req.files) 
	let newSublease = {
		first_name: rb.firstname,
		last_name: rb.lastname,
		email: rb.email,
		aptname: rb.aptname,
		aptadr: rb.aptadr,
		city: rb.city,
		state: rb.state,
		zipcode: rb.zipcode,
		bedroomnum: rb.bedroomnum,
		bathroomnum: rb.bathroomnum,
		rmnum: rb.roommatemnum,
		rmgender: rb.rmgender,
		startdate: rb.startdate,
		enddate: rb.enddate,
		roomforsub:rb.roomforsub,
		pricefrom: rb.pricefrom,
		priceto: rb.priceto,
		description: rb.description,
		requirement: rb.requirement,
		photos: req.files.map(it => it.filename)
	}

	db.subleases.insert(newSublease, (err, sl) => {
		if (err) {
			console.log(err)
			res.send("error, see console")
		} else {
			res.send(JSON.stringify(sl))
		}
	})

	app.use(express.static(path.join(__dirname,'photos')))
})

// app.post('/users/add',function(req,res){
// 	// console.log('Form Submitted');
// 	// console.log(req.body.first_name);

// 	db.users.find((err, uservars) => {
// 		if (err) {
// 			return err;
// 		} else {
// 			req.checkBody('first_name','First Name is Required').notEmpty();
// 			req.checkBody('last_name','Last Name is Required').notEmpty();
// 			req.checkBody('email','Email is Required').notEmpty();

// 			var errors= req.validationErrors();

// 			if(errors){
// 				res.render('index',{
// 				title:'Customers', //passing a title to the view
// 				users: users,
// 				errors: errors
// 			});
// 				// console.log('Errors')
// 			}else{
// 				var newUser ={
// 				first_name:req.body.first_name,
// 				last_name:req.body.lastname,
// 				email: req.body.email
// 			}
// 			console.log('Success')
// 			}

// 			var newUser ={
// 				first_name:req.body.first_name,
// 				last_name:req.body.last_name,
// 				email: req.body.email
// 			}
// 			// console.log(newUser);
// 			db.users.insert(newUser,function(err,result){
// 				if(err){
// 					console.log(err);
// 				}
// 				res.redirect('/');

// 			})
// 		}
// 	})
	
// });


app.listen(3000,function(){
	console.log('Server Started on Port 3000...')
})