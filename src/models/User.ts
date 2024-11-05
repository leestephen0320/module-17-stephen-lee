import { Schema, model, type Document } from 'mongoose';

interface IUser extends Document {
    username: string,
    email: string,
    thoughts: Schema.Types.ObjectId[],
    friends: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/,

        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'student',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        timestamps: true
    },
);

userSchema
    .virtual('friendCount')
    .get(function (this: any) {
        return this.friends.length;
    });

const User = model<IUser>('User', userSchema);

export default User;
