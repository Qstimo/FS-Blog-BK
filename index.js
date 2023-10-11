import express from "express";
import mongoose from "mongoose";

import handleValid from "./utils/handleValid.js";
import { registerValidation, loginValidation } from "./validation/validation.js";

import * as UserController from "./controllers/UserController.js";
import checkAuth from "./utils/checkAuth.js";


const app = express();

mongoose.connect('mongodb+srv://admin:888888@cluster0.mlaiqal.mongodb.net/myblog?retryWrites=true&w=majority').then(
    console.log('DB OK')).catch(
        err => console.log('DB erroe', err));

app.use(express.json());
const port = '4444'

app.listen(port, (err) => {
    if (err) { return console.log(err); }
    console.log('Server OK')
});

app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/auth/register', registerValidation, handleValid, UserController.register);
app.post('/auth/login', loginValidation, handleValid, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);