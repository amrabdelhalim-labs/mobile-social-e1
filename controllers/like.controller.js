import models from "../models/index.js";

const toggleLike = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const postId = parseInt(req.params.postId);
        if (!postId || isNaN(postId)) {
            return res.status(400).json({ message: "معرف المنشور غير صالح" });
        }

        const post = await models.Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "المنشور غير موجود" });
        }

        const existingLike = await models.Like.findOne({
            where: { UserId: userId, PostId: postId },
        });

        let isLiked;

        if (existingLike) {
            await existingLike.destroy();
            isLiked = false;
        } else {
            await models.Like.create({ UserId: userId, PostId: postId });
            isLiked = true;
        }

        const likesCount = await models.Like.count({ where: { PostId: postId } });

        return res.status(200).json({
            message: isLiked ? "تم تسجيل الإعجاب" : "تم إلغاء الإعجاب",
            isLiked,
            likesCount,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const getPostLikes = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        if (!postId || isNaN(postId)) {
            return res.status(400).json({ message: "معرف المنشور غير صالح" });
        }

        const post = await models.Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "المنشور غير موجود" });
        }

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);
        const offset = (page - 1) * limit;

        const { count, rows: likes } = await models.Like.findAndCountAll({
            where: { PostId: postId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: models.User,
                    attributes: ['id', 'name', 'ImageUrl'],
                },
            ],
        });

        const users = likes.map((like) => like.User);
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalLikes: count,
                limit,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

const getMyLikes = async (req, res) => {
    try {
        const userId = req.currentUser?.id;
        if (!userId) {
            return res.status(401).json({ message: "غير مصرح" });
        }

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
        const offset = (page - 1) * limit;

        const { count, rows: likes } = await models.Like.findAndCountAll({
            where: { UserId: userId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            distinct: true,
            col: 'id',
            include: [
                {
                    model: models.Post,
                    attributes: ['id', 'title', 'content', 'createdAt'],
                    include: [
                        {
                            model: models.User,
                            attributes: ['id', 'name', 'ImageUrl'],
                        },
                        {
                            model: models.Post_Image,
                            attributes: ['id', 'imageUrl'],
                        },
                    ],
                },
            ],
        });

        const posts = likes.map((like) => like.Post);
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalLikes: count,
                limit,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطأ في الخادم" });
    }
};

export { toggleLike, getPostLikes, getMyLikes };
