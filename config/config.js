module.exports = {
	server: 'server.soxsnation.com',
	// server: '54.201.189.1',
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