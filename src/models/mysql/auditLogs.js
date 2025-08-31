export default (sequelize, DataTypes) => {
  const AuditLogs = sequelize.define("AuditLogs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    request: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    response: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "audit_logs",
    timestamps: false,
    underscored: true
  });

  // Associations (optional)
  AuditLogs.associate = (models) => {
    AuditLogs.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
  };

  return AuditLogs;
};
