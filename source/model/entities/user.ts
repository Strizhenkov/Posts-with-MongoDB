import mongoose, {Document, Schema, Types} from "mongoose";
import bcrypt from "bcrypt";
import {createRoleFromString, IUserType, USER_ROLE_VALUES, UserType} from "../helpers/roles.ts";

export interface IUser extends Document {
    id : string;
    username : string;
    password : string;
    role: string;
    subscriptions: Types.ObjectId[];
    comparePassword : (password : string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser> ({
    username : {type: String, required : true, unique : true},
    password : {type: String, required : true},
    role : {type: String, enum: USER_ROLE_VALUES, default: new UserType().getRole()},
    subscriptions: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
});

UserSchema.post("init", function (doc: any) {
    doc.role = createRoleFromString(doc.role);
});

UserSchema.pre<IUser>("save", async function(next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as any);
    }
});


UserSchema.methods.comparePassword = async function (password : string) : Promise<boolean> {
    return await bcrypt.compare(password.trim(), this.password);
};

UserSchema.virtual("id").get(function (this: { _id: Types.ObjectId }) {
    return this._id.toString();
});

export default mongoose.model<IUser>("User", UserSchema);