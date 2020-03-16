/*
	edited by : sasi;
	data : 6/03/2020
*/
// import section
const express = require('express');
const bodyParser = require('body-parser');
const category_model = require('../../modal/product_model/product_category_model');
const constant_values = require('../../../common_values');

const app = express.Router();

// const values
const pass = constant_values.pass;
const fail = constant_values.fail;
const invalid = constant_values.invalid;
const system_error_message = constant_values.system_error_message;

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


// get all product categories
app.get('/',function(req,res){
	category_model.get_all_product_category().then(function(result){
		res.json({
			status : pass,
			data : result
		});
	}).catch(function(err){
		res.json(system_error_message);
	})
})

// add a category
app.post('/add_category',function(req,res){
	let data = {
		category_name : req.body.name,
		sub_category : req.body.sub_category,
		status : "A"
	};
	category_model.add_product_category(data).then(function(result){
		res.json({
			status : pass,
			data : "successfully added"
		});
	}).catch(function(err){
		res.json(system_error_message);
	})
})

// get a category details by using the id
app.get('/edit/:category_id',function(req,res){
	let product_category_name = req.params.category_id;
	category_model.get_product_category_id(product_category_name).then(function(result){
		res.json({
			status : pass,
			data : result
		});
	}).catch(function(err){
		res.json(system_error_message);
	})
})

// update a category
app.patch('/edit/:category_id',function(req,res){
	let product_category_id = req.params.category_id;
	let data = {
		category_name : req.body.category_name,
		sub_category : req.body.sub_category
	};
	category_model.update_product_category(product_category_id,data).then(function(result){
		res.json({
			status : pass,
			data : {
				message : "successfully updated"
			}
		});
	}).catch(function(err){
		res.json(system_error_message);
	})
})

// delete the product category
app.post('/delete',function(req,res){
	let id = req.body.delete_id;
	category_model.delete_product_category(id).then(function(result){
		category_model.get_all_product_category().then(function(result){
			res.json({
				status : pass,
				data : result
			})
		}).catch(function(err){
			res.json(system_error_message);
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

module.exports =  app;