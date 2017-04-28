exports.DATABASE_URL =  process.env.DATABASE_URL ||
                        process.env.MONGODB_URI ||
                        'mongodb://localhost/notecard-app';

exports.TEST_DATABASE_URL =  process.env.TEST_DATABASE_URL ||
                            'mongodb://localhost/test-notecard-app';
exports.PORT = process.env.PORT || 8080;