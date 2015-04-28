module.exports = {
    server: 'server.soxsnation.com',
    // server: '54.201.189.1',
    debug_mode: true,
    port: 27017,
    development: {
        db: 'staging3_soxsnation',
        // db: 'soxsnation2',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            },
            username: 'soxsnation',
            password: 's0xn@t10n'
        },
        app: {
            name: 'soxsnation DEV'
        }
    },
    staging: {
        db: 'staging2_soxsnation',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            },
            username: 'soxsnation',
            password: 's0xn@t10n'
        },
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
