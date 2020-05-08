/*
	edit_by : "Sasi",
	date : 10/03/2020
*/

const mongodb = require('mongodb');
const database = require('../../../database');
var object_id = require('mongodb').ObjectID;
const constant = require('../../../common_values');

const url = database.db_connection_url;
const db_name = database.db_name;
var db;

mongodb.connect(url,{ useUnifiedTopology : true },function(err,connection){
	if(err){
		return err;
	} else {
		db = connection.db(db_name);
	}
});

module.exports = {
	get_all_country : function(){
		let home_page_data = {};
		return new Promise(function(resolve,reject){
			db.collection('country').find({ status : { $ne : "D" } }).toArray(function(err,result){
				if(err) reject(err);
				else {
					home_page_data['country_list'] = result;
					db.collection('recipe').find({},{ projection : { _id : 1,name : 1,image_url : 1 } }).sort({ _id : -1 }).limit(10).toArray(function(err,result){
						if(err) reject(err);
						else{
							home_page_data['new_recipe'] = result;
							resolve(home_page_data);
						}
					})
				}
			})
		})
	},
	all_country : function(){
		return new Promise(function (resolve,reject) {
			db.collection('country').find({ status : { $ne : "D" } }).limit(10).toArray(function(err,result){
				if(err) reject(err);
				else {
					for(let i = 0; i < result.length; i++){
						let image_url = "http://"+constant.ip_address+':'+constant.port+"/"+result[i]['image'];
						result[i]['image'] = image_url;
					}
					resolve(result);
				}
			})
		})
	},
	add_country : function(data){
		return new Promise(function(resolve,reject){
			db.collection('country').insertOne(data,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	get_country_by_name : function(country_name,id){
		return new Promise(function(resolve,reject){
			let query = {};
			if(id !== ''){
				id = new object_id(id);
				query = { 
					country_name : country_name,
					status : { $ne : "D" },
					_id : { $ne : id  }
				}
			} else {
				query = { 
					country_name : country_name,
					status : { $ne : "D" }
				}
			}
			console.log(query);
			db.collection('country').find(query).toArray(function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	edit_country : function(id,data){
		id = new object_id(id);
		let new_data = { $set : data };
		return new Promise(function(resolve,reject){
			db.collection('country').updateOne({ '_id' : id },new_data,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	delete_country : function(id){
		id = new object_id(id);
		let new_data = { $set : { status : 'D' } };
		return new Promise(function(resolve,reject){
			db.collection('country').updateOne({ _id : id },new_data,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	get_country_by_id : function(id){
		id = new object_id(id);
		return new Promise(function(resolve,reject){
			db.collection('country').find({ '_id' : id }).toArray(function(err,result){
				if(err) reject(err);
				else {
					for(let i = 0; i < result.length; i++){
						let image_url = "http://"+constant.ip_address+':'+constant.port+"/"+result[i]['image'];
						result[i]['image'] = image_url;
					}
					resolve(result);
				}
			})
		})
	}
}