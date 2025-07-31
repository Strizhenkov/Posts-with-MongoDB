import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../source/model/entities/user.ts";

dotenv.config();

async function clearUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const result = await User.deleteMany({});
        console.log(`Удалено: ${result.deletedCount}`);
        process.exit(0);
    } catch (err) {
        console.log('Ошибка: ', err);
        process.exit(1);
    }
}

clearUsers();