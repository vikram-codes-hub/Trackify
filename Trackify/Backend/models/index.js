const { getSequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const sequelize = getSequelize();

// User
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user",
  },
});

//  Project
const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
});

//  Task 
const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      len: [2, 150],
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  status: {
    type: DataTypes.ENUM("todo", "in-progress", "done"),
    defaultValue: "todo",
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "medium",
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

// ProjectMember 
const ProjectMember = sequelize.define("ProjectMember", {}, { timestamps: false });

// Associations 

// Project User (creator)
Project.belongsTo(User, { as: "createdBy", foreignKey: "createdById" });
User.hasMany(Project, { foreignKey: "createdById" });

// Project User (members)
Project.belongsToMany(User, { through: ProjectMember, as: "members", foreignKey: "projectId" });
User.belongsToMany(Project, { through: ProjectMember, as: "projects", foreignKey: "userId" });

// Task Project
Task.belongsTo(Project, { foreignKey: { name: "projectId", allowNull: false } });
Project.hasMany(Task, { foreignKey: "projectId", onDelete: "CASCADE" });

// Task User (assignedTo)
Task.belongsTo(User, { as: "assignedTo", foreignKey: "assignedToId" });
User.hasMany(Task, { as: "assignedTasks", foreignKey: "assignedToId" });

// Task User (createdBy)
Task.belongsTo(User, { as: "createdBy", foreignKey: "createdById" });
User.hasMany(Task, { as: "createdTasks", foreignKey: "createdById" });

module.exports = { sequelize, User, Project, Task, ProjectMember };