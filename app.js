//import
require('dotenv').config();
const express = require('express');
const path = require('path');
const {
  contactValidators,
  validationResult,
  editContactValidators,
} = require('./middleware/validator');

const { Contact } = require('./models/contacts');

// create an express app
const app = express();
const port = 5055;

//body parser
//static folder
//view engine
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

//routes
app.get('/', async (req, res) => {
  let contacts = await Contact.find({});

  res.render('pages/contacts', { contacts: contacts });
});

app.get('/add', (req, res) => {
  res.render('pages/addcontact');
});

app.post('/add', contactValidators, (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('pages/addcontact', {
      errors: errors.array(),
    });
  } else {
    let name = req.body.name;
    let email = req.body.email;

    let myContact = new Contact({
      contactName: name,
      contactEmail: email,
    });

    myContact
      .save()
      .then(() => {
        console.log(`Saved new contact ${name} , ${email}`);
      })
      .catch((error) => {
        console.log(error.message);
      });
    res.redirect('/');
  }
});

app.get('/edit/:id', async (req, res) => {
  let contact = await Contact.findById(req.params.id).exec();
  res.render('pages/editcontact', {
    contact: contact,
  });
});

app.post('/edit/:id', editContactValidators, async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let contact = await Contact.findById(req.params.id).exec();
    res.render('pages/editcontact', {
      errors: errors.array(),
      contact: contact,
    });
  } else {
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;

    Contact.findByIdAndUpdate(id, { contactName: name, contactEmail: email })
      .then(() => {
        console.log('Updated!');
      })
      .catch((error) => {
        console.log(error.message);
      });
    res.redirect('/');
  }
});
//run the app
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
