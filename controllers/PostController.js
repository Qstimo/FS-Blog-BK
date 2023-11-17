import PostModel from '../models/Post.js'
import { Types } from 'mongoose';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(' ').filter(i => i !== " "),
            imageUrl: req.body.imageUrl,
            user: req.userId
        })
        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "post not create" })
    }
}
export const getPopulatePosts = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        let query = {};
        if (searchTerm) {
            query = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { text: { $regex: searchTerm, $options: 'i' } },
                ]
            }
        }
        const posts = await PostModel.find(query)
            .populate('user')
            .sort({ viewsCount: 'desc' })
            .exec();
        res.json(posts)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not find" })
    }
}
export const getPosts = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        let query = {};
        if (searchTerm) {
            query = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    //поиск по тайтлу
                    { text: { $regex: searchTerm, $options: 'i' } },
                    //поиск по тексту
                    { tags: { $regex: searchTerm, $options: 'i' } }
                ]
            }
        }

        const posts = await PostModel.find(query)
            .populate('user')
            .sort({ createdAt: 'desc' })
            .exec();
        res.json(posts);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not find" })
    }
}
export const getTagsPosts = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        let query = {};
        if (searchTerm) {
            query = {
                $or: [
                    { tags: { $regex: searchTerm, $options: 'i' } },
                    //поиск по tag
                ]
            }
        }

        const posts = await PostModel.find(query)
            .populate('user')
            .sort({ createdAt: 'desc' })
            .exec();
        res.json(posts);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "tags not find" })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).populate('user').populate('comments').populate('user')
        if (!post) { return res.status(500).json({ message: "posts not find" }) }
        res.json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not find" })
    }
};

export const getUserPost = async (req, res) => {
    try {
        const userId = req.params.id;
        const userIdObject = new Types.ObjectId(userId);
        const posts = await PostModel.find(
            { user: userIdObject }
        ).populate('user');

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for the user" },);
        }
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                tags: (req.body.tags?.split(' ').filter(i => i !== "") || []),
                imageUrl: req.body.imageUrl,
            },
        );
        res.json({ success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not update" })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = await PostModel.findByIdAndDelete({ _id: postId })
        if (!doc) { res.status(500).json({ message: "posts not delete" }) }
        res.json({ success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not delete" })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tagsArray = posts.map((post) => post.tags).flat(1)
        if (tagsArray.length < 1) { res.status(500).json({ message: "Не удалось получить тэги" }) }
        const tags = [...new Set(tagsArray)]
        res.json(tags);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Не удалось получить тэги" })
    }
}
export const getLastPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ viewsCount: 'desc' }).limit(5).exec();
        res.json(posts);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Не удалось получить посты" })
    }
}