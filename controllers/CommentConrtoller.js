import CommentsModel from '../models/Comment.js';
import PostModel from '../models/Post.js';


// Получить комментарии для определенного поста
export const getAll = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!postId) { res.status(500).json({ error: 'Ошибка сервера' }) }
        const comments = await CommentsModel.find({ post: postId }).populate('user');
        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};


export const create = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Пост не найден' });
        }

        const doc = new CommentsModel({
            post: post._id,
            text: req.body.text,
            user: req.userId,
            imageUrl: req.body.imageUrl
        });
        const comment = await doc.save();

        post.comments.push(comment);
        await post.save();

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const remove = async (req, res) => {
    try {
        const _id = req.params.id;
        console.log(_id);
        const doc = await CommentsModel.findByIdAndDelete({ _id })
        if (!doc) { res.status(500).json({ message: "posts not delete" }) }
        res.json({ success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not delete" })
    }
}