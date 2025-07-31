import mongoose, {Document, Schema, Types} from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    author: Types.ObjectId;
    likes: Types.ObjectId[];
}

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
});

export default mongoose.model<IPost>("Post", PostSchema);