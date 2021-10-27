import * as dotenv from "dotenv";
import { toString } from "lodash";
import * as admin from "firebase-admin";

const config = require("../config.json");

admin.initializeApp({
  credential: admin.credential.cert(config),
  databaseURL: "https://data-management-01-default-rtdb.firebaseio.com",
});
console.log("connect firebase is successfully");

export const db = admin.firestore();
