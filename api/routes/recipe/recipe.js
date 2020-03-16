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

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// get a state list of an given country


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
