import { DataTypes } from 'sequelize';
import db from '../utilities/database.js';

const Post = db.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    steps: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, { timestamps: true, });

Post.associate = models => {
    Post.belongsTo(models.User);
    Post.hasMany(models.Post_Image);
    Post.hasMany(models.Comment);
};

export default Post;