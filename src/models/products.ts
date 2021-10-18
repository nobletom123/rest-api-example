import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new product
interface ProductAttrs {
  title: string;
  description: string;
  image?: string;
  price?: number;
  published?: boolean;
  stripeProductId: string;
}

// An interface that describes the properties
// that a Product Model has
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

// An interface that describes the properties
// that a Product Document has
interface ProductDoc extends mongoose.Document {
  title: string;
  description: string;
  image?: string;
  price?: number;
  published?: boolean;
  stripeProductId: string;
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
    image: {
      type: String,
    },
    published: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stripeProductId: {
      type: String,
      required: true,
    },
    stripePriceId: {
      type: String,
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

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "product",
  productSchema
);

export { Product };
