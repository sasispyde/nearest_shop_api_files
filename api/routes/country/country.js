/*
	edited_by : "Sasi",
	date : 10/03/2020
*/

// import section
const express = require('express');
const bodyParser = require('body-parser');
const country_model = require('../../modal/country_model/country_model');
const constant_values = require('../../../common_values');
const validator = require('../../../validation/validation');
const app = express.Router();
const fs = require('fs');

const upload = constant_values.upload;

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Headers','Origin,X-requested-with,Content-Type,Accept,Authorization');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT,DELETE,PATCH,POST,GET');
	}
	next();	
});


// const values
const pass = constant_values.pass;
const fail = constant_values.fail;
const invalid = constant_values.invalid;
const system_error_message = constant_values.system_error_message;

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// Api to get all the country name
app.get("/get_all_country_name",function(req,res){
	country_model.get_all_country().then(function(result){
		res.json({
			status : pass,
			data : result
		})
	}).catch(function(err){
		res.json({
			status : fail,
			data : system_error_message
		})
	})
})

app.get("/all_country_name",function(req,res){
	country_model.all_country().then(function(result){
		res.send({
			status : pass,
			data : result
		})
	}).catch(function(err){
		res.json({
			status : fail,
			data : system_error_message
		})
	})
})

// check if all the params are valid and precess next
// app.use('/add_country',(req,res,next)=>{
// 	if(req.body.name==undefined||req.body.name==null){
// 		res.json({
// 			status : fail,
// 			data : {
// 				messgae : "Country name not empty"
// 			}
// 		})
// 	}
// 	next();
// })

// api to add a country to the database
app.post('/add_country',upload.single('myImage'),(req,res)=>{

	let country_name = req.body.name;
	validator.validate_country(country_name).then(function(result){
		if(Object.keys(result).length === 0){
			country_model.get_country_by_name(country_name,'').then(function(result){
				console.log(result);
				if(result.length != 0){
					let path = "./uploads/"+req.file.filename;
			      	fs.stat(path, function (err, stats) {
					   	if (err) {
					       	console.error(err);
					   	} else {
						   	fs.unlink(path,function(err){
						        if(err) return console.log(err);
						        console.log('file deleted successfully');
						   	});  
					   	}
					});
					res.json({
						status : fail,
						data : {
							message : "Country name already exists"
						}
					})
				} else {
					let data = {
						country_name : country_name,
						image : req.file.path,
						image_name : req.file.filename,
						status : 'A'
					}
					country_model.add_country(data).then(function(result){
						res.json({
							status : pass,
							data : {
								message : "Country name successfully added."
							}
						})
					}).catch(function(err){
						let path = "./uploads/"+req.file.filename;
				      	fs.stat(path, function (err, stats) {
						   	if (err) {
						       	console.error(err);
						   	} else {
							   	fs.unlink(path,function(err){
							        if(err) return console.log(err);
							        console.log('file deleted successfully');
							   	});  
						   	}
						});
						res.json({
							status : pass,
							data : system_error_message
						})
					})
				}
			})
		} else {
			let path = "./uploads/"+req.file.filename;
	      	fs.stat(path, function (err, stats) {
			   	if (err) {
			       	console.error(err);
			   	} else {
				   	fs.unlink(path,function(err){
				        if(err) return console.log(err);
				        console.log('file deleted successfully');
				   	});  
			   	}
			});
			res.json({
				status : fail,
				data : result
			})
		}
	}).catch(function(err){
		res.json({
			status : fail,
			data : system_error_message
		})
	})
})

// To get the edit data.
app.get('/edit/:country_id',function(req,res){
	let country_id = req.params.country_id;
	validator.validate_id(country_id).then(function(result){
		if(Object.keys(result).length === 0){
			country_model.get_country_by_id(country_id).then(function(result){
				res.json({
					status : pass,
					data : result
				})
			}).catch(function(err){
				res.json({
					status : fail,
					data : system_error_message
				})
			})
		} else {
			res.json({
				status : fail,
				data : result
			})
		}
	}).catch(function(err){
		res.json({
			status : invalid,
			data : system_error_message
		})
	})
})

// update a country with new values
app.patch('/edit/:country_id',upload.single('myImage'),function(req,res){
	
	let country_name = req.body.name;
	let id = req.params.country_id;
	validator.validate_country(country_name).then(function(result){
	if(Object.keys(result).length === 0){
		country_model.get_country_by_name(country_name,id).then(function(result){
			if(result.length != 0){
				res.json({
					status : fail,
					data : {
						message : "Country name already exists"
					}
				})
			} else {
				let data = {};
				if(req.file !== undefined){
					data = {
						country_name : country_name,
						image : req.file.path,
						image_name : req.file.filename,
					}
				} else {
					data = {
						country_name : country_name,
					}
				}
				
				country_model.edit_country(id,data).then(function(result){
					res.json({
						status : pass,
						data : {
							message : "Country successfully updated."
						}
					})
				}).catch(function(err){
					res.json({
						status : pass,
						data : system_error_message
					})
				})
			}
		})
	} else {
		res.json({
			status : fail,
			data : result
		})
	}
	}).catch(function(err){
		res.json({
			status : fail,
			data : system_error_message
		})
	})
})

// To delete the existing data
app.post('/delete',function(req,res){
	let id = req.body.delete_id;
	validator.validate_id(id).then(function(result){
		if(Object.keys(result).length === 0){	
			country_model.delete_country(id).then(function(result){
				country_model.all_country().then(function(result){
					res.json({
						status : pass,
						data : result
					})
				}).catch(function(err){
					res.json({
						status : fail,
						data : 'system_error_message'
					})
				})
			}).catch(function(err){
				res.json({
					status : fail,
					data : system_error_message
				})
			})
		} else {
			res.json({
				status : invalid,
				data : "Invalid result"
			})
		}
	}).catch(function(err){
		res.json({
			status : fail,
			data : system_error_message
		})
	})
})

app.get('*',function(req,res){
	res.json({
		status : invalid,
		data : {
			message : "invalid request"
		}
	})
})

module.exports = app
