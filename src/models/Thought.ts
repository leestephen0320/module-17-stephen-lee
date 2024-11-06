import { Schema, model, Types, type Document } from 'mongoose';

interface IThought extends Document {
    thoughtText: string,
    createdAt: Date,
    username: string,
    reactions: Schema.Types.ObjectId[]
}

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
          },
          reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
          },
          username: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: Date | undefined) => timestamp ? timestamp.toLocaleString() : '',
          },
    },
    {
        toJSON: {
            getters: true
        }
    }
)

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
            default: Date.now,

        },
        username: {
                type: String,
                required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
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
