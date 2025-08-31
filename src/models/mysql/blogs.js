export default (sequelize, DataTypes) => {
  const Blogs = sequelize.define(
    "Blogs",
    {
      blog_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.JSON,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      tableName: "blogs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  Blogs.associate = (models) => {
    Blogs.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
  };
  return Blogs
};
