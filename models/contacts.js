const mongoose = require('mongoose');

const uri = process.env.MONGODB_CONNECTION_STRING;

mongoose
  .connect(uri)
  .then(() => {
    console.log('we are connected');
  })
  .catch((error) => {
    console.log(error.message);
  });

const contactSchema = new mongoose.Schema({
  contactName: { type: String },
  contactEmail: { type: String, lowercase: true, unique: true },
});

const Contact = mongoose.model('contacts', contactSchema);

module.exports = {
  Contact,
};
