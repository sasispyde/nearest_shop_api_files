/*
	edited by : sasi;
	data : 6/03/2020
*/
// import section
const express = require('express');
const bodyParser = require('body-parser');
const product_model = require('../../modal/product_model/product_model');
const constant_values = require('../../../common_values');
const common_functions = require('../../../common_functions');

const app = express.Router();

// const values
const pass = constant_values.pass;
const fail = constant_values.fail;
const system_error_message = constant_values.system_error_message;
const upload = constant_values.upload;

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Headers','Origin,X-requested-with,Content-Type,Accept,Authorization');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT,DELETE,PATCH,POST,GET');
	}
	next();	
});

// product Routes
// add product
app.post('/add_product',upload.single('product_image'),function(req,res){
	let file = req.file;
	let data = JSON.parse(req.body.data);

	res.json({
		status : pass,
		data : {
			message : "Product Successfully Inserted"
		}
	})
})

// Edit product( get the product details using id)
app.get('/edit/:product_id',function(req,res){
	let id = req.params.product_id;
	product_model.get_product_by_id(id).then(function(result){
		res.json({
			status : pass,
			data : result
		});
	}).catch(function(err){
		res.json(system_error_message);
	})
})

// Edit product( update the product details using id)
app.patch('/edit/:product_id',function(req,res){
	let id = req.params.product_id;
	let data = {
		name : req.body.name,
		price : req.body.price
	}
	product_model.update_product(id,data).then(function(result){
		res.json({
			status : pass,
			data :{ 
				message : "succesfully updated"
			}
		})
	}).catch(function(err){
		res.json(system_error_message)
	})
})

// Delete product( Delete the product details using id)
app.delete('/delete',function(req,res){
	let id = req.body.delete_id;
	product_model.delete_product(id).then(function(result){
	}).then(function(){
		product_model.get_all_product().then(function(result){
			res.json({
				status : pass,
				data : result
			})
		})
	}).catch(function(err){
		res.json(system_error_message);
	})
})

// Get all the products
app.get('/',function(req,res){
	product_model.get_all_product().then(function(result){
		res.json({
			status : pass,
			data : result
		})
	}).catch(function(err){
		res.json(system_error_message);
	})
})

// default route
app.get('*',function(req,res){
	res.json({
		status : invalid,
		data : {
			messgae : "invalid request"
		}
	})
})

module.exports = app;