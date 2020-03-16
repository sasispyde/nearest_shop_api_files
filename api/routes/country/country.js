/*
	edited_by : "Sasi",
	date : 10/03/2020
*/

// import section
const express = require('express');
const bodyParser = require('body-parser');
const country_model = require('../../modal/country_model/country_model');
const constant_values = require('../../../common_values');
const validator = require('../../../validation/validation')

const app = express.Router();

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

// check if all the params are valid and precess next
app.use('/add_country',function(req,res,next){
	if(req.body.name==undefined||req.body.name==null){
		res.json({
			status : fail,
			data : {
				messgae : "Country name not empty"
			}
		})
	}
	next();
})
// api to add a country to the database
app.post('/add_country',function(req,res){
	let country_name = req.body.name;
	validator.validate_country(country_name).then(function(result){
		if(Object.keys(result).length === 0){
			country_model.get_country_by_name(country_name).then(function(result){
				if(result.length != 0){
					res.json({
						status : fail,
						data : {
							messgae : "Country name already exists"
						}
					})
				} else {
					country_model.add_country(country_name).then(function(result){
						res.json({
							status : pass,
							data : {
								messgae : "Country name successfully added."
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
app.patch('/edit/:country_id',function(req,res){
	let country_name = req.body.name;
	let id = req.params.country_id;
	validator.validate_country(country_name).then(function(result){
		if(Object.keys(result).length === 0){
			country_model.get_country_by_name(country_name).then(function(result){
				if(result.length != 0){
					res.json({
						status : fail,
						data : {
							messgae : "Country name already exists"
						}
					})
				} else {
					country_model.edit_country(id,country_name).then(function(result){
						res.json({
							status : pass,
							data : {
								messgae : "country name successfully updated"
							}
						})
					}).catch(function(err){
						res.json({
							status : fail,
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
app.delete('/delete',function(req,res){
	let id = req.body.delete_id;
	validator.validate_id(id).then(function(result){
		if(Object.keys(result).length === 0){	
			country_model.delete_country(id).then(function(result){
				country_model.get_all_country().then(function(result){
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
			messgae : "invalid request"
		}
	})
})

module.exports = app
