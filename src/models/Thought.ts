import { Schema, model, type Document } from 'mongoose';

interface IThought extends Document {
    thoughtText: string,
    createdAt: Date,
    username: Schema.Types.ObjectId[],
    reactions: Schema.Types.ObjectId[]
}

const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now(),

        },
        username: [
            {
                type: Schema.Types.ObjectId,
                ref: 'student',
            },
        ],
        reactions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
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

thoughtSchema
    .virtual('reactionCount')
    .get(function (this: any) {
        return this.reactions.length;
    });

const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
