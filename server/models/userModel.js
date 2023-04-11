const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("react_social_media", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// const sequelize = new Sequelize("azzy_social", "azzy_admin", "azzy@1301", {
//   host: "azzy_social.db4free.net",
//   dialect: "mysql",
//   port: 3306,
//   logging: false,
// });

const User = sequelize.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bg_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Exclude createdAt and updatedAt fields from all queries
  }
);

const Post = sequelize.define(
  "posts",
  {
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    upload_datetime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Exclude createdAt and updatedAt fields from all queries
  }
);

const Activity = sequelize.define(
  "activity_log",
  {
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Exclude createdAt and updatedAt fields from all queries
  }
);

const PostLikes = sequelize.define(
  "post_likes",
  {
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    is_liked: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Exclude createdAt and updatedAt fields from all queries
  }
);

const PostComments = sequelize.define(
  "post_comments",
  {
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false, // Exclude createdAt and updatedAt fields from all queries
  }
);
//  User - Post Relation
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

//  User - Activity Relation
User.hasMany(Activity, { foreignKey: "user_id" });
Activity.belongsTo(User, { foreignKey: "user_id" });

//  Post - Post Likes - User   Relation
Post.hasMany(PostLikes, { foreignKey: "post_id" });
PostLikes.belongsTo(Post, { foreignKey: "post_id" });
PostLikes.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(PostLikes, { foreignKey: "user_id" });

//  Post - Comments - User Relation
Post.hasMany(PostComments, { foreignKey: "post_id" });
PostComments.belongsTo(Post, { foreignKey: "post_id" });
PostComments.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(PostComments, { foreignKey: "user_id" });

module.exports = { User, Post, Activity, PostLikes, PostComments, Sequelize };
