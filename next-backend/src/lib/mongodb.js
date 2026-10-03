import { MongoClient } from "mongodb";

const options = {};
let globalClientPromise;

/**
 * Opens MongoDB only when a route calls this function.
 * In development, the resolved connection promise is reused by later requests.
 */
export function getClientPromise() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Please add your Mongo URI to .env.local or set MONGODB_URI env variable",
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalClientPromise) {
      const client = new MongoClient(uri, options);
      globalClientPromise = client.connect();
    }

    return globalClientPromise;
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}
