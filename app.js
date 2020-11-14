const express = require('express');
const mailchimp = require('@mailchimp/mailchimp_marketing');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER_LOCATION,
});

app.get('/', (req, res) => {
  res.redirect('/signup.html');
});

app.post('/', (req, res) => {
  const addUserToMailchimp = async () => {
    try {
      await mailchimp.lists.addListMember(process.env.LIST_ID, {
        email_address: req.body.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: req.body.fName,
          LNAME: req.body.lName,
        },
      });

      res.redirect('/success.html');
    } catch (err) {
      console.log(err);
      res.redirect('/failure.html');
    }
  };

  addUserToMailchimp();
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
