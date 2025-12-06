const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.error("Database cannot be connected ! Error : ", error.message);
    process.exit(1);
  }
};

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

const collection = new mongoose.model("users", LoginSchema);

module.exports = {
    connectDB,
    collection
};