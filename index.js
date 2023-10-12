import express from "express";
import mongoose from "mongoose";

import handleValid from "./utils/handleValid.js";
import { registerValidation, loginValidation, postCreateValidation } from "./validation/validation.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentConrtoller.js";
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

app.post('/posts', checkAuth, postCreateValidation, handleValid, PostController.create)
app.get('/posts', PostController.getPosts);
app.get('/posts/:id', PostController.getOne);
app.patch('/posts/:id', checkAuth, PostController.update);
app.delete('/posts/:id', PostController.remove);
app.get('/tags', PostController.getLastTags);

app.post('/posts/:postId/comments', checkAuth, CommentController.create);
app.get('/posts/:postId/comments', CommentController.getAll);

