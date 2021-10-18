import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new Comment
interface CommentAttrs {
  text: string;
  user: string;
  product?: string;
  blog?: string;
}

// An interface that describes the properties
// that a Comment Model has
interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

// An interface that describes the properties
// that a Comment Document has
interface CommentDoc extends mongoose.Document {
  text: string;
  version: number;
}

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

commentSchema.set("versionKey", "version");

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment };
