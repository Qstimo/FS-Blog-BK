import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from '../models/User.js'


export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save();
        const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' })
        const { passwordHash, ...userData } = user._doc
        res.json({ ...userData, token })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Не удалось создать аккаунт" })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) { return res.status(404).json({ message: "user not found" }) }
        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPassword) { return res.status(404).json({ message: "user not found" }) };
        const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' })
        const { passwordHash, ...userData } = user._doc
        res.json({ ...userData, token })
    } catch (error) {
        return res.status(404).json({ message: "user not found" })
    }
};

export const update = async (req, res) => {
    try {
        const userid = req.userId

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        await UserModel.updateOne(
            { _id: userid },
            {
                email: req.body.email,
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash,
            }
        )
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "user not update" })
    }
};


export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const { passwordHash, ...userData } = user._doc
        res.json({ ...userData })
    } catch (error) {
        return res.status(404).json({ message: "user not found" })
    }
};