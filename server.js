const mongoose = require('mongoose');
const dotenv = require('dotenv');
// configure the dotenv path
dotenv.config({ path: './config.env' });

//connect to database
// const database = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );
// mongoose
//     .connect(database, {
//         //useNewUrlParser: true,
//     })
//     .then((con) => {
//         //console.log(con.connection)
//         console.log('DB CONNECTION SUCCESS');
//     });

const app = require('./app');

// start the server on port 3000
const PORT = process.env.port || 3000;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONG_URI);
        console.log(`Mongo Db Connected ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
};
// app.listen(PORT, () => {
//     console.log(`listening for requests ${PORT}`);
// });

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`listening for requests ${PORT}`);
    });
});
