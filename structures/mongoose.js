require('dotenv').config()

module.exports.run = async(mongoose) => {
    mongoose.connect(
        `${process.env.MONGO_URL}`,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: true,
        },
        (err) => {
            if (err) return console.log(`An Error occure while trying to connect to the Database.\n ${err}`);
            console.log(`Connected to Mongoose :${mongoose.connection.host} | Ready state: ${mongoose.connection.readyState}`);
            console.log(`Connected to port ${mongoose.connection.port}`)
        }
    );
}