// var Buffer = require('buffer');

var obj = {
	name: 'Andrew',
	age: 28,
	work: '.decimal'
};

var objstring = JSON.stringify(obj);

console.log(objstring);
console.log(obj);

var buf = new Buffer(obj).toString('base64');
// var str = buf.write(objstring, 'base64');
console.log(buf);
var buf2 = new Buffer(buf, 'base64');
console.log(buf2.toString('utf8'));