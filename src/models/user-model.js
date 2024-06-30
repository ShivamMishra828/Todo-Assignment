const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the schema for a User
const userSchema = new mongoose.Schema(
    {
        // The full name of the user
        fullName: {
            type: String,
            required: true,
        },
        // The email address of the user
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                // Regular expression to validate email format
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please enter a valid email",
            ],
        },
        // The password of the user
        password: {
            type: String,
            required: true,
        },
        // References to todos created by the user
        todos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Todo",
            },
        ],
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Middleware to hash the password before saving the user document
userSchema.pre("save", async function hashPassword(next) {
    if (!this.isModified("password")) return next(); // If the password is not modified, move to the next middleware

    this.password = await bcrypt.hashSync(this.password, 10); // Hash the password with a salt round of 10
    next();
});

// Method to compare provided password with the hashed password in the database
userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
};

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
