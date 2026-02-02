import { DataTypes } from 'sequelize';
import db from './database.js';

const Comment = db.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, { timestamps: true, });

Comment.associate = models => {
    Comment.belongsTo(models.User);
    Comment.belongsTo(models.Post);
};

export default Comment;