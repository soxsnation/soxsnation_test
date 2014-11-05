/* Mailer.js
 *
 * Author(s):  Andrew Brown
 * Date:       10/31/2014
 *
 */

var nodemailer = require('nodemailer');


function generateEmailMessage(data) {
	var currentdate = new Date();
	var message = 'Email from: ' + data.firstname + ' ' + data.lastname + "\n";
	message += 'Received at: ' + currentdate.toDateString() + "\n";
	message += 'Email Address: ' + data.email  + "\n";
	message += 'Phone: ' + data.phonenumber  + "\n";
	message += 'Comments: ' + data.comments  + "\n";
	return message;
}

function generateEmailSubject(data) {
	var subject = 'Email from ' + data.firstname + ' ' + data.lastname;
	return subject;
}

exports.sendMail = function(subject, message, cb) {
// exports.sendMail = function(data, cb) {
	console.log('sendMail');
	// var subject = generateEmailSubject(data);
	// var message = generateEmailMessage(data);
	console.log(subject);
	console.log(message);
	var smtpTransport = nodemailer.createTransport("SMTP", {
		host: "smtp.gmail.com",
		secureConnection: false,
		port: 587,
		auth: {
			user: "soxsnationnotifications@gmail.com",
			pass: "4GJo7xzoVrSl9dbL2lit"
		}
	});

	var mailOptions = {
		from: "soxsnationnotifications@gmail.com", // sender address
		to: "soxsnation@gmail.com", // list of receivers
		subject: subject, // Subject line
		text: message // plaintext body
		//html: "<b>Hello world</b>" // html body
	}

	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}
	});

	smtpTransport.close();
	cb(true);
}