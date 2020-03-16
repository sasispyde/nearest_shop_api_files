const MongoClient = require('mongodb').MongoClient;
const database = require('../../../database');

const url = database.db_connection_url;
const dbName = database.db_name;
var db;

MongoClient.connect(url,{useUnifiedTopology: true},function(err, client) {
  db = client.db(dbName);
});

module.exports = {
	validate_login:function(obj){
		return new Promise(function(resolve,reject){
			let username = obj.username;
			let password = obj.password;
			db.collection('users').find({username : username,password : password}).toArray(function(err,result){
				if(err) throw err;
				resolve(result)
			})
		})
	},
	insert_new_user:function(obj){
		return new Promise(function(resolve,reject){
			db.collection('users').insertOne(obj,function(err,result){
				if(err) throw err;
				resolve(result);
			})			
		})
	},
	chack_if_email_already_exits : function(email){
		return new Promise(function(resolve,reject){
			db.collection('users').find({email : email}).toArray(function(err,result){
				if(err) throw err;
				resolve(result);
			})
		})
	}

}