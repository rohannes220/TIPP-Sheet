//mongodDB driver

import {MongoClient, ObjectId, ServerApiVersion} from "mongodb";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1"])

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

  me.findOne = async (collectionName, idString) => {
    console.log("MongoDB findOne by idString: ", idString);
    const { client, collection } = await connect(collectionName);
    try {
      const data = await collection.findOne(
          { _id: new ObjectId(idString)}
        );
      console.log(data);
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

// If we want to change the collection being accessed in the backend in the routes
// we will have to get the raw database by name and then we can access different collections
// in different routes. If we use this function, that will work and i would suggest we can keep this
// instead of having two functions because we don't want multiple connections to the db at once.

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27107";
  const client = new MongoClient(uri, {
    family: 4
  });

  console.log(process.env.MONGODB_URI)

  try {
    await client.connect();
    console.log("MongoDB connection estabilished");
    const db = client.db("TIPPSheet");
    return db;
  } catch(error) {
    console.error("Failed to connect to database", error);
    throw error;
  }
}

export const mongoDB = MongoDB();

// future work: we should keep one (which can be used to access multiple collections depeding on route)



