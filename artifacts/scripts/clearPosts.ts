import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../../source/model/entities/post.ts";

dotenv.config();

async function clearPosts() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const result = await Post.deleteMany({});
        console.log(`Удалено: ${result.deletedCount}`);
        process.exit(0);
    } catch (err) {
        console.log('Ошибка: ', err);
        process.exit(1);
    }
}

clearPosts();