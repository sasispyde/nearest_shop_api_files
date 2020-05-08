/*
	edited_by : "Sasi",
	date : 10/03/2020
*/

// import section

const express = require('express');
const bodyParser = require('body-parser');
const recipe_model = require('../../modal/recipe_model/recipe_model');
const constant_values = require('../../../common_values');
const validator = require('../../../validation/validation')

const app = express.Router();

// const values
const pass = constant_values.pass;
const fail = constant_values.fail;
const invalid = constant_values.invalid;
const system_error_message = constant_values.system_error_message;
const upload = constant_values.upload;

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Headers','Origin,X-requested-with,Content-Type,Accept,Authorization');
	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Allow-Methods','PUT,DELETE,PATCH,POST,GET');
	}
	next();	
});

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.get('/get_bacic_data',function(req,res){
	res.json({
		status  : pass,
		data : {
			message : "successfully data transmitted"
		}
	})
})

// get a state list of an given country
app.post('/add_recipe',upload.single('recipe_image'),function(req,res){
	console.log(req.file);
	console.log(JSON.parse(req.body.data));
	let data = JSON.parse(req.body.data);
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

module.exports = app
