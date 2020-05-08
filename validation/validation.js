const validator = require('validator');

module.exports = {
	validate_login_form : function(data){
		return new Promise(function(resolve,reject){
			let errs = {};
			if(validator.isEmpty(data.username)){
				errs['username'] = "username must not be empty";
			}
			if(validator.isEmpty(data.password)){
				errs['password'] = "password must not be empty";
			}
			resolve(errs);
		})
	},
	validate_register_form : function(data){
		return new Promise(function(resolve,reject){
			let err = {};

			// Name validation
			if(!validator.isEmpty(data.username)){
				if(data.username.length < 4 || data.username.length > 30){
					err['username'] = "username should be the length of 4 to 30 charecters";
				} else if(!validator.isAlpha(data.username)){
					err['username'] = "username must be alphabet";
				}
			} else {
				err['username'] = "username must not be same";
			}

			// email validation 
			if(!validator.isEmpty(data.email)){
				if(!validator.isEmail(data.email)){
					err['email'] = "invalid email format";
				}
			} else {
				err['email'] = "email must not be empty";
			}

			//password validation 
			if(validator.isEmpty(data.password)){
				err['password'] = "password must not be empty";
			}
			resolve(err);
		})
	},
	validate_country : function(country_name){
		let err = {};
		return new Promise(function(resolve,reject){
			if( country_name === undefined || country_name === null || validator.isEmpty(country_name)){
				err['message'] = "Conntry Name Must Not Be Empty"
			} else {
				let name = country_name.split(' ').join('').trim();
				if(!validator.isAlpha(name)){
					err['message'] = "country must be alphabet"
				}
			}
			resolve(err);
		})
	},
	validate_id : function(id){
		return new Promise(function(resolve,reject){
			let err = {};
			if(validator.isEmpty(id)){
				err['id'] = "id must not be empty"
			}
			resolve(err);
		})
	}
}