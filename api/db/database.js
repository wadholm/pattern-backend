const mongoose = require("mongoose");

let dsn;

const db = {
    getDb: async function getDb() {
        // Test db
        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        } else {
            // MongoDB Atlas
            dsn = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}` +
            `@${process.env.DB_CLUSTER}.jr7l8.mongodb.net/${process.env.DB_NAME}` +
            `?retryWrites=true&w=majority`;
        }

        // Connect Mongoose
        const client = await mongoose.connect(
            dsn,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );


        return {
            client: client,
        };
    }
};

module.exports = db;
