const fs = require('fs');

module.exports = {
	delete_file : function(fileName){
		return new Promise((resolve,reject)=>{
			let path = "./uploads/"+fileName;
		  	fs.stat(path, function (err, stats) {
			   	if (err) {
			       	reject(err);
			   	} else {
				   	fs.unlink(path,function(err){
				        if(err) reject(err);
				        else resolve(true);
				   	});  
			   	}
			});
		})
	}
}