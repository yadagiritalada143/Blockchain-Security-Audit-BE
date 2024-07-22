import mongoose from 'mongoose';

const BsaSchema = new mongoose.Schema({
    email: { type: mongoose.Schema.Types.String },
    data: { type: mongoose.Schema.Types.Mixed },
    preceding_hash: { type: mongoose.Schema.Types.String },
    hash: { type: mongoose.Schema.Types.String },
    iterations: { type: mongoose.Schema.Types.Number },
    created_on: { type: Number }
}, {
    collection: 'audit_log_chain',
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
BsaSchema.virtual('id').get(function () {
    return String(this._id);
});

const BsaModel = mongoose.model('BsaSchema', BsaSchema);
export default { BsaModel };
