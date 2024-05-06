const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`mongoDb Connected: ${conn.connection.host}`)
    } catch (error) {
        process.exit();
    }
}

module.exports = connectDB;