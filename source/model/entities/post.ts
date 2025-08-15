import mongoose, {Document, Schema, Types} from "mongoose";

export interface IPost extends Document {
    title: string[];
    content: string[];
    version: number; 
    author: Types.ObjectId;
    likes: Types.ObjectId[];
}

const PostSchema = new Schema<IPost>({
    title:   {type: [String], required: true},
    content: {type: [String], required: true},
    version: {type: Number,  required: true, default: 0, min: 0},
    author:  {type: Schema.Types.ObjectId, ref: "User", required: true},
    likes:   {type: [Schema.Types.ObjectId], ref: "User", default: []},
});

PostSchema.virtual("id").get(function (this: {_id: Types.ObjectId}) {
    return this._id.toString();
});

PostSchema.set("toObject", {virtuals: true});
PostSchema.set("toJSON",   {virtuals: true});

export default mongoose.model<IPost>("Post", PostSchema);