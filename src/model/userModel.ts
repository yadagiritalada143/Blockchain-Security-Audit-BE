import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema({
    firstName: { type: mongoose.Schema.Types.String },
    lastName: { type: mongoose.Schema.Types.String },
    userName: { type: mongoose.Schema.Types.String },
    email: { type: mongoose.Schema.Types.String, required: true, unique: true },
    password: { type: mongoose.Schema.Types.String },
    mobileNumber: { type: mongoose.Schema.Types.Number },
    userRole: { type: mongoose.Schema.Types.String },
    created_on: { type: mongoose.Schema.Types.Date }
}, {
    collection: 'user_details',
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

UserSchema.plugin(uniqueValidator);

UserSchema.virtual('id').get(function () {
    return String(this._id);
});

const UserModel = mongoose.model('UserSchema', UserSchema);
export default { UserModel };
