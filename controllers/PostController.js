import PostModel from '../models/Post.js'

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(' '),
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
export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not find" })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).populate('user').populate('comments')
        if (!post) { res.status(500).json({ message: "posts not find" }) }
        res.json(post);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "posts not find" })
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
                tags: (req.body.tags?.split(' ') || []),
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