module.exports = {
	server: 'server.soxsnation.com',
	port: 27017,
	development: {
		db: 'soxsnation2',
		app: {
			name: 'soxsnation DEV'
		}
	},
  	production: {
    	db: 'soxsnation',
		app: {
			name: 'soxsnation'
		}
 	}
}