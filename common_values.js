var ip = require("ip");
const path = require("path");
const multer = require("multer");

const ip_address = ip.address();

const pass = 1;
const fail = 0;
const invalid = 3;
const already_exits = 4;
const port = 5005;
const system_error_status_code = 2;
const system_error_message = {
	status : system_error_status_code,
	data : {
		message : "Server is busy"
	}
}

// Multer object for all image upload process.
const storage = multer.diskStorage({
   	destination: function (req, file, cb) {
    	cb(null, './uploads/')
  	},
   	filename: function(req, file, cb){
      	cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   	}
});

const fileFilter  = (req,file,cb) =>{
	if(file !== undefined && file.originalname !== undefined){
		cb(null,true);
	} else {
		cb(null,false)
	}
}

const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
   fileFilter : fileFilter
});
// End of Multer object..

exports.pass = pass;
exports.fail = fail;
exports.port = port;
exports.ip_address = ip_address;
exports.upload = upload;
exports.system_error_message = system_error_message;
exports.system_error_status_code = system_error_status_code;
exports.system_error_status_code = system_error_status_code;
exports.already_exits = already_exits;
