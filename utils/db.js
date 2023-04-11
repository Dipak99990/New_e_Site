import mongoose from "mongoose";

const connection = { isConnected: false };

async function connect() {
  if (connection.isConnected) {
    return;
  }

  await mongoose.connect(
    "mongodb+srv://dpksrm:123@e-site.wfbudmw.mongodb.net/?retryWrites=true&w=majority"
  );
  connection.isConnected = true;
}

async function disconnect() {
  if (connection.isConnected) {
    await mongoose.disconnect();
    connection.isConnected = false;
  }
}
const convertdoctoobj = (doc) => {
  if (doc._id) {
    doc._id = doc._id.toString();
  }
  if (doc.createdAt) {
    doc.createdAt = doc.createdAt.toString();
  }

  if (doc.updatedAt) {
    doc.updatedAt = doc.updatedAt.toString();
  }

  return doc;
};
const db = { connect, disconnect, convertdoctoobj };
export default db;
