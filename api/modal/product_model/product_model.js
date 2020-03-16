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

// modal function
module.exports = {
	add_product : function(data){
		return new Promise(function(resolve,reject){
			db.collection('product').insertOne(data,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	get_product_by_id : function(id){
		id = new ObjectId(id);
		return new Promise(function(resolve,reject){
			db.collection('product').find({'_id' : id}).toArray(function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	update_product : function(id,data){
		id = new ObjectId(id);
		let new_data = { $set : data }
		return new Promise(function(resolve,reject){
			db.collection('product').updateOne({'_id' : id},new_data,function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	delete_product : function(id){
		id = new ObjectId(id);
		return new Promise(function(resolve,reject){
			db.collection('product').deleteOne({_id : id},function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	},
	get_all_product : function(){
		return new Promise(function(resolve,reject){
			db.collection('product').find({}).toArray(function(err,result){
				if(err) reject(err);
				else resolve(result);
			})
		})
	}
}