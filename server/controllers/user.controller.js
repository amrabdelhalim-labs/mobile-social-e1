import models from "../models/index.js";
import bcrypt from "bcrypt";
import * as jwt from "../utilities/jwt.js";
import { imgDirectory, extractFileName } from "../utilities/files.js";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_PROFILE_IMAGE = 'default-profile.svg';

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "الإيميل مستخدم بالفعل" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await models.User.create({
            name,
            email,
            password: hashedPassword,
        });

        console.log(`User registered: ${name} ${email}`);
        return res.status(201).json({ message: "تم إنشاء الحساب بنجاح" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "الإيميل أو كلمة المرور غير صحيحة" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "الإيميل أو كلمة المرور غير صحيحة" });
        }

        const token = jwt.generate({ id: user.id, email: user.email });
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const user = await models.User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const updateImage = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "لم يتم تحميل صورة" });
        }

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        const previousImageUrl = user.ImageUrl;
        const newImageUrl = `/images/${req.file.filename}`;

        await user.update({ ImageUrl: newImageUrl });

        const sanitizeUser = user.toJSON();
        delete sanitizeUser.password;

        try {
            const oldFileName = extractFileName(previousImageUrl);
            if (oldFileName && oldFileName !== req.file.filename && oldFileName !== DEFAULT_PROFILE_IMAGE) {
                const imagesRoot = path.resolve(process.cwd(), imgDirectory);
                const oldFilePath = path.join(imagesRoot, oldFileName);

                await fs.promises.unlink(oldFilePath).catch((err) => {
                    if (err?.code !== 'ENOENT') {
                        console.error('Failed to delete old profile picture:', err.message);
                    }
                });
            }
        } catch (err) {
            console.error('Error while cleaning old profile picture:', err?.message || err);
        }

        return res.status(200).json({ message: "تم تحديث صورة الملف الشخصي بنجاح", user: sanitizeUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const resetImage = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        const previousImageUrl = user.ImageUrl;
        const newImageUrl = `/images/${DEFAULT_PROFILE_IMAGE}`;

        await user.update({ ImageUrl: newImageUrl });

        const sanitizeUser = user.toJSON();
        delete sanitizeUser.password;

        try {
            const oldFileName = extractFileName(previousImageUrl);
            if (oldFileName && oldFileName !== DEFAULT_PROFILE_IMAGE) {
                const imagesRoot = path.resolve(process.cwd(), imgDirectory);
                const oldFilePath = path.join(imagesRoot, oldFileName);

                await fs.promises.unlink(oldFilePath).catch((err) => {
                    if (err?.code !== 'ENOENT') {
                        console.error('Failed to delete old profile picture:', err.message);
                    }
                });
            }
        } catch (err) {
            console.error('Error while cleaning old profile picture:', err?.message || err);
        }

        return res.status(200).json({ message: "تمت إعادة الصورة الافتراضية بنجاح", user: sanitizeUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const updateInfo = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const payload = req.body || {};
        const updates = {};

        if (payload.name !== undefined) {
            if (typeof payload.name !== 'string' || !payload.name.trim()) {
                return res.status(400).json({ message: "الاسم غير صالح" });
            }

            updates.name = payload.name.trim();
        }

        if (payload.password !== undefined) {
            if (typeof payload.password !== 'string' || !payload.password) {
                return res.status(400).json({ message: "كلمة المرور غير صالحة" });
            }

            const hashedPassword = await bcrypt.hash(payload.password, 10);
            updates.password = hashedPassword;
        }

        if (!updates.name && !updates.password) {
            return res.status(400).json({ message: "لا توجد بيانات لتحديثها" });
        }

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        await user.update(updates);

        const sanitizeUser = user.toJSON();
        delete sanitizeUser.password;

        return res.status(200).json({ message: "تم تحديث بيانات المستخدم بنجاح", user: sanitizeUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        const userImageUrl = user.ImageUrl;

        // جمع صور منشورات المستخدم لحذفها من القرص
        const userPosts = await models.Post.findAll({
            where: { UserId: userId },
            include: [{ model: models.Post_Image }]
        });

        const filesToDelete = [];

        for (const post of userPosts) {
            if (post.Post_Images) {
                for (const img of post.Post_Images) {
                    const fileName = extractFileName(img.imageUrl);
                    if (fileName) {
                        filesToDelete.push(fileName);
                    }
                }
            }
        }

        // حذف صورة الملف الشخصي
        const profileFileName = extractFileName(userImageUrl);
        if (profileFileName && profileFileName !== DEFAULT_PROFILE_IMAGE) {
            filesToDelete.push(profileFileName);
        }

        // حذف المستخدم (CASCADE سيحذف المنشورات والتعليقات والإعجابات)
        await user.destroy();

        // تنظيف الملفات من القرص
        const imagesRoot = path.resolve(process.cwd(), imgDirectory);
        for (const fileName of filesToDelete) {
            try {
                await fs.promises.unlink(path.join(imagesRoot, fileName));
            } catch (err) {
                if (err?.code !== 'ENOENT') {
                    console.error('Failed to delete file:', fileName, err.message);
                }
            }
        }

        return res.status(200).json({ message: "تم حذف الحساب بنجاح" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

export { register, login, getProfile, updateImage, resetImage, updateInfo, deleteUser };