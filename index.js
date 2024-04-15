const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const { Resend } = require('resend');
const app = express();
const port = process.env.PORT ||  8000;
require('dotenv').config();

const resend = new Resend(process.env.API_KEY);

app.use(cors())
app.use(bodyParser.json());

app.post('/user', (req, res) => {

    try {
        const userDetails = req.body;
        console.log('Received userDetails:', userDetails);
        const {name,email,companyName,query} = userDetails

        if(!name || !email || !companyName || !query){
            res.status(400).send('Empty fields')
        }
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'TrueDax',
            html: `<p>${query}</p>`
          });
          res.status(200).send('Success')

    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
});

app.listen(port, () => {
    console.log(`Server is running on :${port}`);
});
