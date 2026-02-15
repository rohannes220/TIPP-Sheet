//mongodDB driver
import {MongoClient, ObjectId} from "mongodb";


function MongoDB() {
  const URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
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
    console.log("MongoDB driver InsertOne query: ", record);
    const {client, sessionLogsCollection} = connect();
    let result = {};
    try {
      result = await sessionLogsCollection.insertOne(record);
      return result;
    }  catch (err) {
      console.error("ERROR fetching session logs from MongoDB: ", err);
    } finally {
      client.close();
    }
  }

  return me;
}
const mongoDB = MongoDB();
export default mongoDB;