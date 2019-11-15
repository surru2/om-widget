import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

let db = null;

export default async () => {

  if (db != null) return db;

  const connestionString = process.env.EXPRESS_MONGO_URL || 'mongodb://localhost/express';
  const dbName = process.env.DB_NAME || 'express';
  const client = await MongoClient.connect(
    connestionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  db = client.db(dbName);

  return db;

}
