import mongoose from "mongoose";
import environment from "./env.js";

async function connect() {
  try {
    mongoose.set("strictQuery", true);
    const db = await mongoose.connect(environment.database);

    console.log(`🟢 => Connected to ${db.connection.name} database.`);
  } catch (error) {
    console.error(`🚫 => Error connecting to database: ${error.message}`);
    process.exit(1);
  }
}

export default { connect };
