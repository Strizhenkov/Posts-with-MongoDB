import bcrypt from 'bcrypt';
import mongoose, {Schema} from 'mongoose';
import {USER_ROLE_VALUES, UserType} from '../helpers/roles.ts';
import type {Document, Types} from 'mongoose';

export interface IUser extends Document {
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
            ref: 'User',
            default: []
        }
    ]
});

UserSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password'))
    {return next();}
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

UserSchema.methods.comparePassword = async function (password : string) : Promise<boolean> {
    return await bcrypt.compare(password.trim(), this.password);
};

UserSchema.virtual('id').get(function (this: {_id: Types.ObjectId}) {
    return this._id.toString();
});

UserSchema.set('toObject', {virtuals: true});
UserSchema.set('toJSON',   {virtuals: true});

export default mongoose.model<IUser>('User', UserSchema);