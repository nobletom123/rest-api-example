import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new Blog
interface BlogAttrs {
  title: string;
  description: string;
  body: string;
  published?: boolean;
}

// An interface that describes the properties
// that a Blog Model has
interface BlogModel extends mongoose.Model<BlogDoc> {
  build(attrs: BlogAttrs): BlogDoc;
}

// An interface that describes the properties
// that a Blog Document has
interface BlogDoc extends mongoose.Document {
  title: string;
  description: string;
  body: string;
  published: boolean;
  version: number;
}

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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

blogSchema.set("versionKey", "version");

blogSchema.statics.build = (attrs: BlogAttrs) => {
  return new Blog(attrs);
};

const Blog = mongoose.model<BlogDoc, BlogModel>("Blog", blogSchema);

export { Blog };
