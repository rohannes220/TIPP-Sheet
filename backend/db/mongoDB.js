//mongodDB driver

import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

export const collections = Object.freeze({
  SESSION_LOGS: "sessionLogs",
});

const me = {};
const DB_NAME = "TIPPsheet";

function MongoDB() {
  const connect = async (collectionName) => {
    const URI = process.env.MONGODB_URI;
    if (!URI) {
      throw new Error("could not find MONGODB_URI in .env!");
    }
    const client = new MongoClient(URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    const database = client.db(DB_NAME);
    const collection = database.collection(collectionName);
    return { client, collection };
  };

  //TODO: future work: maintain connection and restart connection in error recovery
  me.find = async (collectionName, query = {}) => {
    console.log("trying to get logs");
    const { client, collection } = await connect(collectionName);
    try {
      const data = await collection.find(query).toArray();
      console.log("fetched sessionLogs from MongoDB");
      return data;
    } catch (err) {
      console.error("ERROR fetching session logs from MongoDB: ", err);
    } finally {
      client.close();
    }
  };

  me.findOne = async (collectionName, query = {}) => {
    console.log("MongoDB driver FindOne called with query: ", query);
    const { client, collection } = await connect(collectionName);
    try {
      const data = await collection.findOne(query);
      return data;
    } catch (err) {
      console.error("ERROR fetching session logs from MongoDB: ", err);
    } finally {
      client.close();
    }
  };

  me.insertOne = async (collectionName, record) => {
    const { client, collection } = await connect(collectionName);
    let result = {};
    try {
      result = await collection.insertOne(record);
      console.log("MongoDB insert: ", record, "result: ", result);
      return result;
    } catch (err) {
      console.error(
        "ERROR inserting session log to MongoDB: ",
        err,
        "record: ",
        record,
      );
      return result;
    } finally {
      client.close();
    }
  };

  me.updateOne = async (collectionName, idString, record) => {
    console.log("MongoDB UpdateOne idString:", idString, "record:", record);
    const { client, collection } = await connect(collectionName);
    try {
      return await collection.updateOne(
        { _id: new ObjectId(idString) },
        { $set: record },
      );
    } catch (err) {
      console.error("ERROR updating session log in MongoDB: ", err);
    } finally {
      client.close();
    }
  };

  me.deleteOne = async (collectionName, idString) => {
    console.log("MongoDB DeleteOne idString:", idString);
    const { client, collection } = await connect(collectionName);
    try {
      return await collection.deleteOne({ _id: new ObjectId(idString) });
    } catch (err) {
      console.error("ERROR updating session log in MongoDB: ", err);
    } finally {
      client.close();
    }
  };

  return me;
}
const mongoDB = MongoDB();
export default mongoDB;