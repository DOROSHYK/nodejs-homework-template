const mongoose = require('mongoose');

const app = require('../app');

// const DB_HOST = 'mongodb+srv://olala:0970187156@cluster0.0qy5z.mongodb.net/phoneBook?retryWrites=true&w=majority'

const {DB_HOST,PORT = 3000} = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`)
})
    console.log("database connect success")
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })



