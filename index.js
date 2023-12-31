import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { config } from "dotenv";
import fs from "fs";

import handleValid from "./utils/handleValid.js";
import { registerValidation, loginValidation, postCreateValidation, CommentCreateValidation } from "./validation/validation.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import * as CommentController from "./controllers/CommentConrtoller.js";
import checkAuth from "./utils/checkAuth.js";
import cors from 'cors'



const app = express();
const PORT = '4444'
app.use(express.json());
app.use(cors());
config();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://fs-blog-ft.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
mongoose.connect(process.env.MONGODB_URL).then(
    console.log('DB OK')).catch(
        err => console.log('DB erroe', err));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('storage')) {
            fs.mkdirSync('storage');
        }
        cb(null, 'storage')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })


app.use('/uploads', express.static('storage'))


app.listen(process.env.PORT || PORT, (err) => {
    if (err) { return console.log(err); }
    console.log('Server OK')
});

app.post('/uploads', upload.single('image'), (req, res) => {
    try {
        res.json({
            url: `/uploads/${req.file.originalname}`,
        });
    } catch (error) {
        console.log(error)
        res.json({ message: 'error download image' })
    }

});
app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/auth/register', registerValidation, handleValid, UserController.register);
app.post('/auth/login', loginValidation, handleValid, UserController.login);
app.patch('/auth/login', checkAuth, handleValid, UserController.update);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/posts', checkAuth, postCreateValidation, handleValid, PostController.create)
app.get('/posts', PostController.getPosts);
app.get('/posts/populate', PostController.getPopulatePosts);
app.get('/posts/last/populate', PostController.getLastPosts);
app.get('/posts/user/:id', PostController.getUserPost);
app.get('/posts/:id', PostController.getOne);
app.patch('/posts/:id', checkAuth, PostController.update);
app.delete('/posts/:id', PostController.remove);

app.get('/tags', PostController.getLastTags);
app.get('/searchtags', PostController.getTagsPosts);

app.post('/posts/:postId/comments', CommentCreateValidation, checkAuth, handleValid, CommentController.create);
app.get('/posts/:postId/comments', CommentController.getAll);
app.delete('/posts/comments/:id', checkAuth, CommentController.remove);

