const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");


const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});


userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        let salt = await bcrypt.genSalt(12); // generating random string of size 12

        let hashedPassword = await bcrypt.hash(this.password, salt);

        this.password = hashedPassword;
    }
    next();
});

userSchema.methods.verifyPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = model("User", userSchema);