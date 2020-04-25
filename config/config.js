var dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT,
    user: process.env.MDB_USER,
    pwd: process.env.MDB_PWD,
    ip: process.env.MDB_IP,
    db: process.env.MDB_NAME,
    secret: process.env.JWT_SECRET,
    origin: process.env.ORIGIN
};

