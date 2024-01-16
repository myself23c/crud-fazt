import { MongoClient, GridFSBucket } from 'mongodb';

const mongoURI = 'mongodb://127.0.0.1:27017/database';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let videoBucketNew, musicBucketNew;

const connectMongo = async () => {
    try {
        await client.connect();
        const db = client.db('database');
        videoBucketNew = new GridFSBucket(db, { bucketName: 'videos' });
        musicBucketNew = new GridFSBucket(db, { bucketName: 'music' });
        console.log('Conectado a MongoDB local del server');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
        throw error;
    }
};

const getBuckets = () => {
    return { videoBucketNew, musicBucketNew };
};

export { connectMongo, getBuckets };
