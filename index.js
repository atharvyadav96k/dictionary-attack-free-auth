const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {loginFails, isAccountFreeze} = require('./redis/loginFails')
require('dotenv').config();
require('./db/connectDb').connectDb();

const userSchema = require('./schema/userSchema');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const freezeStatus = await isAccountFreeze(username)
        if(freezeStatus){
            return res.status(300).json({
                message: "You can't login due to multiple failed attempts please wait for 15min!!",
                success: false
            });
        }
        const user = await userSchema.findOne({ username: username, password: password });
        console.log(user)
        if (!user){
            await loginFails(username);
            return res.status(403).json({ success: false, message: "Incorrect Username or password" });
        }

        return res.status(200).json({
            success: true,
            message: "Login Successful"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error: ${err.message}`
        });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password)
        const newUser = new userSchema({
            username: username,
            password: password
        });
        await newUser.save();
        return res.status(200).json({
            success: true,
            message: "Account created successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to create account"
        });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});