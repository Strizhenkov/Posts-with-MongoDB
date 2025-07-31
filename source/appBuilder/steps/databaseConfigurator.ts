import mongoose from 'mongoose';

export class DatabaseConfigurator {
    async configure() {
        try {
            await mongoose.connect(process.env.MONGO_URI as string);
            console.log("1) Database connected successfully.");
        } catch (err) {
            console.error("2) Database connection failed:", err);
            throw err;
        }
    }
}