import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already taken"],
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
        },

        forgotPasswordOtp: {
            otp: {
                type: String,
                default: "",
            },
            isOtpVarified: {
                type: Boolean,
                default: false,
            },
        },

        role: {
            type: String,
            trim: true,
            lowercase: true,
            enum: ["admin", "accountant"],
            default: "admin",
        },

        permanentDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, collection: "Users" }
);

/** password hashing */
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        console.log(error);
    }
});

/** compare passwords */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/** generate access token */
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            userId: this._id,
            userRole: this.role,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

/** create forgot password otp hash */
userSchema.methods.generateForgotPasswordOtpHash = async function (
    forgotPasswordOtp
) {
    try {
        const salt = await bcrypt.genSalt(10);

        const hashedOtp = await bcrypt.hash(forgotPasswordOtp, salt);

        return hashedOtp;
    } catch (error) {
        console.log(error);
    }
};

/** compare forgot password otp */
userSchema.methods.compareForgotPasswordOtp = async function (candidateOtp) {
    try {
        return await bcrypt.compare(candidateOtp, this.forgotPasswordOtp.otp);
    } catch (error) {
        console.log(error);
    }
};

const User = mongoose.model("User", userSchema);

export default User;
