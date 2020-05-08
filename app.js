// import section
const express = require('express');
const bodyParser = require('body-parser');
const auth_modal = require('./api/modal/authentication/authentication');
const validator = require('./validation/validation');
const productRoute = require('./api/routes/product/products');
const productCategoryRoute = require('./api/routes/product/product_category');
const mainProductCategoryRoute = require('./api/routes/product/main_product_category');
const countryBasedRoute = require('./api/routes/country/country');
const recipeBasedRoute = require('./api/routes/recipe/recipe');
const common_values = require('./common_values')
const app = express();

//common values;
const port = common_values.port;
const pass = common_values.pass;
const fail = common_values.fail;
const system_error_message = common_values.system_error_message;

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use('/uploads',express.static('./uploads'));

app.use('/product',productRoute);
app.use('/category',productCategoryRoute);
app.use('/main_category',mainProductCategoryRoute);
app.use('/country',countryBasedRoute);
app.use('/recipe',recipeBasedRoute);

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Headers','Origin,X-requested-with,Content-Type,Accept,Authorization');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT,DELETE,PATCH,POST,GET');
		res.status(200).json({});
	}
	next();	
});

app.get('/',function(req,res){
	res.json({
		status : pass,
		data : {
			meaasge : "Home Page"
		}
	})
})

app.post('/login',function(req,res){
	let data = {
		username : req.body.username,
		password : req.body.password
	}
	let validate = validator.validate_login_form(data).then(function(result){
		if(Object.keys(result).length !== 0){
			res.json({
				status : fail,
				data   : result
			})
		} else {
			let response = auth_modal.validate_login(data).then(function(result){
				if(result.length > 0){
					res.json({
						status : pass,
						data : result
					});
				} else {
					res.json({
						status : fail,
						data : data,
						meaasge : "Invalid username and password"
					});
				}
			}).catch(function(err){
				res.json(system_error_message)
			})
		}
	}).catch(function(err){
		res.json(system_error_message)
	})
});

app.post('/register',function(req,res){
	let data = {
		username : req.body.username,
		email : req.body.email,
		password : req.body.password
	}
	let validate = validator.validate_register_form(data).then(function(result){
		if(Object.keys(result).length === 0){
			auth_modal.chack_if_email_already_exits(data.email).then(function(result){
				if(result.length == 0){
					auth_modal.insert_new_user(data).then(function(result){
						res.json({
							status :  pass,
							data : "successfully Registered"
						})
					}).catch(function(err){
						res.json(system_error_message);
					})
				} else {
					res.json({
						status : fail,
						data : {
							meaasge : "email already exits"
						}
					})
				}
			}).catch(function(err){
				res.json(system_error_message);
			})
		} else {
			res.json({
				status : fail,
				data : result
			})
		}
	})
});

app.listen(port,()=>{
	console.log("Server is listening");
})