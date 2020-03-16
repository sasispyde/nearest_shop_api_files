const pass = 1;
const fail = 0;
const invalid = 3;
const port = 5005;
const system_error_status_code = 2;
const system_error_message = {
	status : system_error_status_code,
	data : {
		message : "Server is busy"
	}
}

exports.pass = pass;
exports.fail = fail;
exports.port = port;
exports.system_error_message = system_error_message;
exports.system_error_status_code = system_error_status_code;