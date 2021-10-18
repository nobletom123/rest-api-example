import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new ProductCategory
interface ProductCategoryAttrs {
  title: string;
  description: string;
  image?: string;
  published?: boolean;
}

// An interface that describes the properties
// that a ProductCategory Model has
interface ProductCategoryModel extends mongoose.Model<ProductCategoryDoc> {
  build(attrs: ProductCategoryAttrs): ProductCategoryDoc;
}

// An interface that describes the properties
// that a ProductCategory Document has
interface ProductCategoryDoc extends mongoose.Document {
  title: string;
  description: string;
  image?: string;
  version: number;
}

const productCategorySchema = new mongoose.Schema(
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

productCategorySchema.set("versionKey", "version");

productCategorySchema.statics.build = (attrs: ProductCategoryAttrs) => {
  return new ProductCategory(attrs);
};

const ProductCategory = mongoose.model<
  ProductCategoryDoc,
  ProductCategoryModel
>("ProductCategory", productCategorySchema);

export { ProductCategory };
