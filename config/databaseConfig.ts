import mongoose from 'mongoose';

mongoose.connect("mongodb://0.0.0.0:27017/test_blockchain", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connection successfully !'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


const connectToDb = () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB !!');
    });
}

export default connectToDb;