    import mongoose from "mongoose";
    const userSchema = new mongoose.Schema({
        nama: {   
            type: String,
            required: [true, 'Nama diperlukan'],
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, 'Email diperlukan'],
            trim: true,
            unique: true,
            lowercase: true,
            minlength: 5,
            maxlength: 255,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password diperlukan'],
            minlength: 6,
            maxlength: 1024,
        },   
    }, { timestamps: true });


    const User = mongoose.model('User', userSchema);
    export default User;