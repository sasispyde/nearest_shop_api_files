/*
	edited by : sasi;
	data : 6/03/2020
*/
// import section
const express = require('express');
const bodyParser = require('body-parser');
const category_model = require('../../modal/product_model/main_product_category_model');
const constant_values = require('../../../common_values');
const common_functions = require('../../../common_functions');

const app = express.Router();

// const values
const pass = constant_values.pass;
const fail = constant_values.fail;
const invalid = constant_values.invalid;
const already_exits = constant_values.already_exits;
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
app.post('/add_category',upload.single('categoryImage'),function(req,res){
	category_model.chack_if_category_name_is_already_exits(req.body.name,'').then(function(result){
		if(result.length === 0){
			let data = {
				category_name : req.body.name,
				status : "A",
				image_name : req.file.filename,
				image_path : req.file.path,
				type : 'MC'
			};
			category_model.add_product_category(data).then(function(result){
				res.json({
					status : pass,
					data : {
						message : "Category name successfully added"
					}
				});
			}).catch(function(err){
				common_functions.delete_file(req.file.filename).then((result)=>{
					res.json(system_error_message);
				}).catch((err)=>{
					console.log(err);
					res.json(system_error_message);
				});
			})
		} else {
			common_functions.delete_file(req.file.filename).then((result)=>{
				res.json({
					status : already_exits,
					data : {
						message : "Category name already exits"
					}
				})
			}).catch((err)=>{
				console.log(err);
				res.json({
					status : already_exits,
					data : {
						message : "Category name already exits"
					}
				})
			});
		}
	}).catch(function(err){
		common_functions.delete_file(req.file.filename).then((result)=>{
			res.json(system_error_message);
		}).catch((err)=>{
			console.log(err);
			res.json(system_error_message);
		});
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

app.get('/sub_cat_name/:category_name',function(req,res){
	let product_category_name = req.params.category_name;
	category_model.get_sub_category_by_using_category_name(product_category_name).then(function(result){
		res.json({
			status : pass,
			data : result
		})
	}).catch(function(err){
		res.json(system_error_message)
	})
})

// update a category
app.patch('/edit/:category_id',upload.single('categoryImage'),function(req,res){

	let product_category_id = req.params.category_id;
	category_model.chack_if_category_name_is_already_exits(req.body.name,product_category_id).then(function(result){
		if(result.length === 0){
			let data = {};
			if(req.file !== undefined) {
				data = {
					category_name : req.body.name,
					image_name : req.file.filename,
					image_path : req.file.path
				}
			} else {
				data = {
					category_name : req.body.name
				}
			}
			
			category_model.update_product_category(product_category_id,data).then(function(result){
				res.json({
					status : pass,
					data : {
						message : "Category name successfully updated"
					}
				});
			}).catch(function(err){
				res.json(system_error_message);
			})
		} else {
			res.json({
				status : already_exits,
				data : {
					message : "Category name already exits"
				}
			})
		}
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

app.get('/get_category',function(req,res){
	category_model.get_all_product_category_name().then(function(result){
		res.json({
			status : 1,
			data : result
		})
	}).catch((err)=>{
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