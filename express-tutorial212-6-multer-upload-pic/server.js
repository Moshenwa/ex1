const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = require ('./app');

dotenv.config({path:'./config.env'});

const db = process.env.DATABASE_ATLAS
.replace('<USER>', process.env.DB_USER)
.replace('<PASSWORD>', process.env.DB_PASSWORD)
.replace('<DB_NAME>', process.env.DB_NAME);
console.log(db);
mongoose.connect(db).then(con => console.log('DB has been connected successfully'));




const port = process.env.PORT;
app.listen(port, '127.0.0.1', () =>{
    console.log(`The app is running on port ${port} `)
})