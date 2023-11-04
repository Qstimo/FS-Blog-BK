import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('fullName', 'Неверный формат имени').isLength({ min: 2 }),
    body('password', 'Неверный формат пароля').isLength({ min: 5 }),
    body('avatarUrl', 'Неверный формат изображения').optional().isString(),

]
export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тэгов(укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),

]
export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Неверный формат пароля').isLength({ min: 5 }),

]
export const CommentCreateValidation = [
    body('text', 'Введите текст').isLength({ min: 5 }).isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),

]