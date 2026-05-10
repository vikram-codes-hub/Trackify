const { Sequelize } = require("sequelize");

// Sequelize instance — created lazily so dotenv.config() runs first in index.js
let sequelize;

const getSequelize = () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: process.env.NODE_ENV === "development" ? console.log : false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // needed for Supabase pooler
          },
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }
  return sequelize;
};

const connectDB = async () => {
  try {
    const db = getSequelize();
    await db.authenticate();
    console.log("✅ PostgreSQL Connected");

    // Import models here so they register on the same sequelize instance
    require("../models");

    await db.sync({ alter: true });
    console.log("✅ Models synced");
  } catch (error) {
    console.error("❌ PostgreSQL Error:", error.message);
    process.exit(1);
  }
};

module.exports = { getSequelize, connectDB };