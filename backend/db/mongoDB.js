//mongodDB driver
import {MongoClient, ObjectId} from "mongodb";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1"])

function MongoDB() {
  const URI = process.env.MONGODB_URI || "mongodb://localhost:27107"
  const me = {};
  const DB_NAME = "TIPPsheet";
  const LOG_COLLECTION = "sessionLogs";

  const connect = () => {
    const client = new MongoClient(URI);
    const database = client.db(DB_NAME);
    const sessionLogsCollection = database.collection(LOG_COLLECTION)
    return {client, sessionLogsCollection};
  }

  //TODO: future work: maintain connection and restart connection in error recovery
  me.find = async (query = {}) => {
    console.log("trying to get logs");
    const { client, sessionLogsCollection } = connect();
    try {
      const data = await sessionLogsCollection.find(query).toArray();
      console.log("fetched sessionLogs from MongoDB");
      return data;
    } catch (err) {
      console.error("ERROR fetching session logs from MongoDB: ", err);
    } finally {
      client.close();
    }
  };

  me.findOne = async(query = {}) => {
    console.log("MongoDB driver FindOne called with query: ", query);
    const {client, sessionLogsCollection} = connect();
    try {
      const data = await sessionLogsCollection.findOne({
        "_id" : new ObjectId("698f4babf24087f6e5cbcb16")
        }).toArray();
      return data;
    }  catch (err) {
      console.error("ERROR fetching session logs from MongoDB: ", err);
    } finally {
      client.close();
    }
  }

  me.insertOne = async(record) => {
    const {client, sessionLogsCollection} = connect();
    let result = {};
    try {
      result = await sessionLogsCollection.insertOne(record);
      console.log("MongoDB insert: " , record, "result: ", result);
      return result;
    }  catch (err) {
      console.error("ERROR inserting session log to MongoDB: ", err, 
        "record: ", record);
      return result;
    } finally {
      client.close();
    }
  }

  me.updateOne = async(idString, record) => {
    console.log("MongoDB UpdateOne idString:", idString, "record:", record);
    const {client, sessionLogsCollection} = connect();
    try {
      return await sessionLogsCollection.updateOne(
        {_id: new ObjectId(idString)}, 
        record
      );
    }  catch (err) {
      console.error("ERROR updating session log in MongoDB: ", err);
    } finally {
      client.close();
    }
  }

  me.deleteOne = async(idString) => {
    console.log("MongoDB DeleteOne idString:", idString);
        const {client, sessionLogsCollection} = connect();
    try {
      return await sessionLogsCollection.deleteOne(
        {_id: new ObjectId(idString)}, 
      );
    }  catch (err) {
      console.error("ERROR updating session log in MongoDB: ", err);
    } finally {
      client.close();
    }
  }

  return me;
}

// If we want to change the collection being accessed in the backend in the routes
// we will have to get the raw database by name and then we can access different collections
// in different routes. If we use this function, that will work and i would suggest we can keep this
// instead of having two functions because we don't want multiple connections to the db at once.

export async function connectDB() {
  process.loadEnvFile()
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



