import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    otp: {
      type: String,
      require: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 },
    },
  },
  { timestamps: true, collection: "OTPs" }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
