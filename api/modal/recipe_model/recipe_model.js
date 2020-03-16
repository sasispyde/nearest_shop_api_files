/*
	edit_by : "Sasi",
	date : 10/03/2020
*/

const mongodb = require('mongodb');
const database = require('../../../database');
var object_id = require('mongodb').ObjectID;

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
	
}