export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_secret: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      auth_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      refresh_token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      is_2fa_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  User.associate = (models) => {
    User.belongsTo(models.Roles, { foreignKey: "role_id", as: "role" });
    User.hasMany(models.Blogs, { foreignKey: "user_id", as: "blogs" });
    User.hasMany(models.AuditLogs, { foreignKey: "user_id", as: "auditLogs" });
  };
  return User;
};
