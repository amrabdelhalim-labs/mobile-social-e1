import models from "../models/index.js";
import { imgDirectory } from "../utilities/files.js";
import fs from "node:fs";
import path from "node:path";

const newPost = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        const { title, content, steps, country, region } = req.body;

        // التحقق من الحقول المطلوبة
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: "العنوان مطلوب" });
        }

        if (!content || typeof content !== 'string' || !content.trim()) {
            return res.status(400).json({ message: "المحتوى مطلوب" });
        }

        // معالجة الخطوات (steps) - يمكن أن تكون JSON string أو array
        let parsedSteps = null;
        if (steps !== undefined && steps !== null && steps !== '') {
            if (typeof steps === 'string') {
                try {
                    parsedSteps = JSON.parse(steps);
                } catch {
                    return res.status(400).json({ message: "صيغة الخطوات غير صحيحة" });
                }
            } else if (Array.isArray(steps)) {
                parsedSteps = steps;
            } else {
                return res.status(400).json({ message: "الخطوات يجب أن تكون مصفوفة" });
            }

            // التحقق من أن كل عنصر في الخطوات صالح
            if (!Array.isArray(parsedSteps)) {
                return res.status(400).json({ message: "الخطوات يجب أن تكون مصفوفة" });
            }
        }

        // معالجة الحقول الاختيارية
        const sanitizedCountry = country && typeof country === 'string' ? country.trim() : null;
        const sanitizedRegion = region && typeof region === 'string' ? region.trim() : null;

        // إنشاء المنشور
        const post = await models.Post.create({
            title: title.trim(),
            content: content.trim(),
            steps: parsedSteps,
            country: sanitizedCountry,
            region: sanitizedRegion,
            UserId: userId,
        });

        // معالجة الصور المرفقة
        const uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imageUrl = `/images/${file.filename}`;
                const postImage = await models.Post_Image.create({
                    imageUrl,
                    PostId: post.id,
                });
                uploadedImages.push(postImage);
            }
        }

        // جلب المنشور مع الصور والمستخدم
        const fullPost = await models.Post.findByPk(post.id, {
            include: [
                {
                    model: models.Post_Image,
                    attributes: ['id', 'imageUrl'],
                },
                {
                    model: models.User,
                    attributes: ['id', 'name', 'ImageUrl'],
                },
            ],
        });

        return res.status(201).json({ message: "تم إنشاء المنشور بنجاح", post: fullPost });
    } catch (error) {
        console.error(error);

        // حذف الصور المرفوعة في حالة حدوث خطأ
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const filePath = path.resolve(process.cwd(), imgDirectory, file.filename);
                fs.promises.unlink(filePath).catch((err) => {
                    if (err?.code !== 'ENOENT') {
                        console.error('Failed to delete uploaded image:', err.message);
                    }
                });
            }
        }

        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
        const offset = (page - 1) * limit;

        const { count, rows: posts } = await models.Post.findAndCountAll({
            distinct: true,
            col: 'id',
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: models.User,
                    attributes: ['id', 'name', 'ImageUrl'],
                },
                {
                    model: models.Post_Image,
                    attributes: ['id', 'imageUrl'],
                },
                {
                    model: models.Comment,
                    attributes: ['id'],
                },
            ],
        });

        const postIds = posts.map((post) => post.id);
        let likesMap = {};

        if (postIds.length > 0) {
            const likeRows = await models.Like.findAll({
                attributes: [
                    'PostId',
                    [
                        models.Like.sequelize.fn('COUNT', models.Like.sequelize.col('id')),
                        'count',
                    ],
                ],
                where: { PostId: postIds },
                group: ['PostId'],
                raw: true,
            });

            likesMap = likeRows.reduce((acc, row) => {
                acc[row.PostId] = Number(row.count) || 0;
                return acc;
            }, {});
        }

        const postsWithLikes = posts.map((post) => ({
            ...post.toJSON(),
            likesCount: likesMap[post.id] || 0,
        }));

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            posts: postsWithLikes,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts: count,
                limit,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const getMyPosts = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
        const offset = (page - 1) * limit;

        const { count, rows: posts } = await models.Post.findAndCountAll({
            distinct: true,
            col: 'id',
            where: { UserId: userId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: models.User,
                    attributes: ['id', 'name', 'ImageUrl'],
                },
                {
                    model: models.Post_Image,
                    attributes: ['id', 'imageUrl'],
                },
                {
                    model: models.Comment,
                    attributes: ['id'],
                },
            ],
        });

        const postIds = posts.map((post) => post.id);
        let likesMap = {};

        if (postIds.length > 0) {
            const likeRows = await models.Like.findAll({
                attributes: [
                    'PostId',
                    [
                        models.Like.sequelize.fn('COUNT', models.Like.sequelize.col('id')),
                        'count',
                    ],
                ],
                where: { PostId: postIds },
                group: ['PostId'],
                raw: true,
            });

            likesMap = likeRows.reduce((acc, row) => {
                acc[row.PostId] = Number(row.count) || 0;
                return acc;
            }, {});
        }

        const postsWithLikes = posts.map((post) => ({
            ...post.toJSON(),
            likesCount: likesMap[post.id] || 0,
        }));

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            posts: postsWithLikes,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts: count,
                limit,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        if (!postId || isNaN(postId)) {
            return res.status(400).json({ message: "معرف المنشور غير صالح" });
        }

        const post = await models.Post.findByPk(postId, {
            include: [
                {
                    model: models.User,
                    attributes: ['id', 'name', 'ImageUrl'],
                },
                {
                    model: models.Post_Image,
                    attributes: ['id', 'imageUrl'],
                },
                {
                    model: models.Comment,
                    attributes: ['id', 'text', 'createdAt'],
                    include: [
                        {
                            model: models.User,
                            attributes: ['id', 'name', 'ImageUrl'],
                        },
                    ],
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: "المنشور غير موجود" });
        }

        const likesCount = await models.Like.count({ where: { PostId: postId } });

        return res.status(200).json({
            post: {
                ...post.toJSON(),
                likesCount,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const updatePost = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const postId = parseInt(req.params.id);
        if (!postId || isNaN(postId)) {
            return res.status(400).json({ message: "معرف المنشور غير صالح" });
        }

        const post = await models.Post.findByPk(postId, {
            include: [{ model: models.Post_Image }],
        });
        if (!post) {
            return res.status(404).json({ message: "المنشور غير موجود" });
        }

        if (post.UserId !== userId) {
            return res.status(403).json({ message: "غير مسموح بتعديل هذا المنشور" });
        }

        const { title, content, steps, country, region, deletedImages } = req.body;
        const updates = {};

        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ message: "العنوان غير صالح" });
            }
            updates.title = title.trim();
        }

        if (content !== undefined) {
            if (typeof content !== 'string' || !content.trim()) {
                return res.status(400).json({ message: "المحتوى غير صالح" });
            }
            updates.content = content.trim();
        }

        if (steps !== undefined) {
            if (steps === null || steps === '') {
                updates.steps = null;
            } else if (typeof steps === 'string') {
                try {
                    const parsed = JSON.parse(steps);
                    if (!Array.isArray(parsed)) {
                        return res.status(400).json({ message: "الخطوات يجب أن تكون مصفوفة" });
                    }
                    updates.steps = parsed;
                } catch {
                    return res.status(400).json({ message: "صيغة الخطوات غير صحيحة" });
                }
            } else if (Array.isArray(steps)) {
                updates.steps = steps;
            } else {
                return res.status(400).json({ message: "الخطوات يجب أن تكون مصفوفة" });
            }
        }

        if (country !== undefined) {
            updates.country = country && typeof country === 'string' ? country.trim() : null;
        }

        if (region !== undefined) {
            updates.region = region && typeof region === 'string' ? region.trim() : null;
        }

        // حذف صور محددة
        let imagesToDelete = [];
        if (deletedImages !== undefined && deletedImages !== null && deletedImages !== '') {
            if (typeof deletedImages === 'string') {
                try {
                    imagesToDelete = JSON.parse(deletedImages);
                } catch {
                    return res.status(400).json({ message: "صيغة الصور المحذوفة غير صحيحة" });
                }
            } else if (Array.isArray(deletedImages)) {
                imagesToDelete = deletedImages;
            }

            if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
                const existingImages = await models.Post_Image.findAll({
                    where: { id: imagesToDelete, PostId: postId },
                });

                for (const img of existingImages) {
                    const fileName = path.basename(img.imageUrl);
                    const filePath = path.resolve(process.cwd(), imgDirectory, fileName);

                    await fs.promises.unlink(filePath).catch((err) => {
                        if (err?.code !== 'ENOENT') {
                            console.error('Failed to delete post image:', err.message);
                        }
                    });

                    await img.destroy();
                }
            }
        }

        // إضافة صور جديدة
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imageUrl = `/images/${file.filename}`;
                await models.Post_Image.create({
                    imageUrl,
                    PostId: postId,
                });
            }
        }

        // تحديث المنشور
        if (Object.keys(updates).length > 0) {
            await post.update(updates);
        }

        // جلب المنشور المحدث
        const updatedPost = await models.Post.findByPk(postId, {
            include: [
                {
                    model: models.Post_Image,
                    attributes: ['id', 'imageUrl'],
                },
                {
                    model: models.User,
                    attributes: ['id', 'name', 'ImageUrl'],
                },
            ],
        });

        const likesCount = await models.Like.count({ where: { PostId: postId } });

        return res.status(200).json({
            message: "تم تحديث المنشور بنجاح",
            post: {
                ...updatedPost.toJSON(),
                likesCount,
            },
        });
    } catch (error) {
        console.error(error);

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const filePath = path.resolve(process.cwd(), imgDirectory, file.filename);
                fs.promises.unlink(filePath).catch((err) => {
                    if (err?.code !== 'ENOENT') {
                        console.error('Failed to delete uploaded image:', err.message);
                    }
                });
            }
        }

        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const deletePost = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const postId = parseInt(req.params.id);
        if (!postId || isNaN(postId)) {
            return res.status(400).json({ message: "معرف المنشور غير صالح" });
        }

        const post = await models.Post.findByPk(postId, {
            include: [{ model: models.Post_Image }],
        });
        if (!post) {
            return res.status(404).json({ message: "المنشور غير موجود" });
        }

        if (post.UserId !== userId) {
            return res.status(403).json({ message: "غير مسموح بحذف هذا المنشور" });
        }

        // حذف صور المنشور من السيرفر
        if (post.Post_Images && post.Post_Images.length > 0) {
            for (const img of post.Post_Images) {
                const fileName = path.basename(img.imageUrl);
                const filePath = path.resolve(process.cwd(), imgDirectory, fileName);

                await fs.promises.unlink(filePath).catch((err) => {
                    if (err?.code !== 'ENOENT') {
                        console.error('Failed to delete post image:', err.message);
                    }
                });
            }
        }

        await models.Comment.destroy({ where: { PostId: postId } });
        await models.Like.destroy({ where: { PostId: postId } });
        await models.Post_Image.destroy({ where: { PostId: postId } });

        await post.destroy();

        return res.status(200).json({ message: "تم حذف المنشور بنجاح" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

export { newPost, getAllPosts, getMyPosts, getPostById, updatePost, deletePost };
