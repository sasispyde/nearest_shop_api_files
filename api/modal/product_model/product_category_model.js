/*
	edited by : sasi;
	data : 6/03/2020
*/

const mongodb = require('mongodb').MongoClient;
const database = require("../../../database");
var ObjectId = require('mongodb').ObjectID;

// database connection
const url = database.db_connection_url;
const db_name = database.db_name;
var db;

mongodb.connect(url,{useUnifiedTopology : true},function(err,client){
	if(err) throw err;
	db = client.db(db_name);
});

// modal functions
module.exports = {
	get_all_product_category : function(){
		return new Promise(function(resolve,reject){
			// db.collection('product_category').find({ status : { $ne : "D" } , type : { $ne : "MC" } }).toArray(function(err,result){
			// 	if(err) throw err;
			// 	else resolve(result);
			// })
			db.collection('product_category').aggregate([
				{ 
					$lookup:
				    {
				        from: 'product_category',
				        localField: 'main_category',
				        foreignField: '_id',
				        as: 'category_details'
				    }
		     	},
		     	{
		     		$match : { $and : [ { 'type' : { $ne : 'MC' } }, { 'status' : { $ne : 'D' } }  ] }
		     	}
		    ]).toArray(function(err,result){
		    	if(err) reject(err);
		    	else resolve(result)
		    })

		})
	},
	get_product_category_id : function(product_category_id){
		let id = new ObjectId(product_category_id);
		return new Promise(function(resolve,reject){
			// db.collection('product_category').find({_id : id}).toArray(function(err,result){
			// 	if(err) reject(err);
			// 	else resolve(result);
			// })
			db.collection('product_category').aggregate([
				{
					$lookup : {
						from : 'product_category',
						localField : 'main_category',
						foreignField : '_id',
						as : 'main_category_name'
					}	
				},
				{
					$match : { _id : id }
				}
			]).toArray(function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	update_product_category : function(product_id,data){
		let id = new ObjectId(product_id);
		data['main_category'] = new ObjectId(data['main_category']);
		let new_values = { $set: data };
		return new Promise(function(resolve,reject){
			db.collection('product_category').updateOne({_id : id},new_values,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	add_product_category : function(data){
		return new Promise(function(resolve,reject){
			db.collection('product_category').insertOne(data,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	delete_product_category : function(id){
		id = new ObjectId(id);
		let new_values = { $set : { status : 'D' } };
		return new Promise(function(resolve,reject){
			db.collection('product_category').updateOne({_id : id},new_values,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	chack_if_category_name_is_already_exits(category_name,id){
		return new Promise(function(resolve,reject){
			let query = {};
			if(id !== ''){
				id = new ObjectId(id);
				query = { 
					category_name : category_name,
					_id : { $ne : id  }
				}
			} else {
				query = { 
					category_name : category_name,
				}
			}
			db.collection('product_category').find(query).toArray(function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	get_all_product_category_name : ()=>{
		return new Promise((resolve,reject)=>{
			db.collection('product_category').find({ status : { $ne : 'D' } , type : { $ne : 'MC' } }, { projection : { _id : 1 , category_name : 1 } }).toArray(function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	get_sub_category_by_using_category_name : (category_name) => {
		return new Promise((resolve,reject)=>{
			db.collection('product_category').find({ category_name : category_name }).toArray((err,result)=>{
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	get_main_category_by_using_category_name : (category_name) => {
		return new Promise((resolve,reject)=>{
			db.collection('product_category').find({ main_category : category_name }).toArray((err,result)=>{
				if(err) reject(err);
				else resolve(result);
			})
		})
	}
}