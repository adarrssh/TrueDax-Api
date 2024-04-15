const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import mongoose

const cors = require('cors')
const { Resend } = require('resend');
const app = express();
const port = process.env.PORT || 8000;
require('dotenv').config();

const resend = new Resend(process.env.API_KEY);

// connect mongodb
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    companyName: String,
    message: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors())
app.use(bodyParser.json());

app.post('/user', async (req, res) => {

    try {
        const userDetails = req.body;
        console.log('Received userDetails:', userDetails);
        const { name, email, companyName, message } = userDetails

        if (!name || !email || !companyName || !message) {
            res.status(400).send('Empty fields')
        }

        const newUser = new User({
            name,
            email,
            companyName,
            message,
        });

        const getUser = await User.findOne({ email })


        if (getUser) {

            res.status(200).send('You have already sent a message')

        } else {

            await newUser.save();
            resend.emails.send({
                from: 'onboarding@resend.dev',
                to: [email],
                subject: 'TrueDax',
                html: `<p>${message}</p>`
            });

            res.status(200).send('Success')

        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
});

app.listen(port, () => {
    console.log(`Server is running on :${port}`);
});
