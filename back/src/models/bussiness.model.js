import mongoose from "mongoose"

const bussinessSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
        },
        businessName: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            trim: true
        },
        streetAddress: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        phoneNumber: {
            type: String,
            required: true,
            match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"]
        },
        website: {
            type: String,
            validate: {
                validator: (v) => !v || /^https?:\/\/.+\..+/.test(v),
                message: "Invalid URL"
            }
        },
        rating: {
            type: Number,
            min: 0,
            max: 5
        },
    },
    { timestamps: true }
)

export const Business = mongoose.model("Business", bussinessSchema);