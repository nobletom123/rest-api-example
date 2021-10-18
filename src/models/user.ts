import mongoose from "mongoose";
import { Password } from "../services/password";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  emailValidated?: boolean;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  emailValidated: boolean;
  mobileValidated: boolean;
  accountActive: boolean;
  version: number;
  pendingEmail: string | null;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    emailValidated: {
      type: Boolean,
      default: false,
    },
    mobileValidated: {
      type: Boolean,
      default: false,
    },
    accountActive: {
      type: Boolean,
      default: false,
    },
    pendingEmail: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };