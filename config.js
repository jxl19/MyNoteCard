exports.DATABASE_URL =  process.env.DATABASE_URL ||
                        process.env.MONGODB_URI ||
                        'mongodb://localhost/notecard-app';

exports.PORT = process.env.PORT || 8080;