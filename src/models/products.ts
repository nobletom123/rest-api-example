import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new product
interface productAttrs {
  title: string;
  description: string;
  headerImage?: string;
  price?: string;
  published?: boolean;
}

// An interface that describes the properties
// that a product Model has
interface productModel extends mongoose.Model<productDoc> {
  build(attrs: productAttrs): productDoc;
}

// An interface that describes the properties
// that a product Document has
interface productDoc extends mongoose.Document {
  title: string;
  description: string;
  headerImage?: string;
  price?: string;
  published?: boolean;
  version: number;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    headerImage: {
      type: String,
    },
    published: {
      type: Boolean,
      required: true,
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

productSchema.set("versionKey", "version");

productSchema.statics.build = (attrs: productAttrs) => {
  return new product(attrs);
};

const product = mongoose.model<productDoc, productModel>(
  "product",
  productSchema
);

export { product };
