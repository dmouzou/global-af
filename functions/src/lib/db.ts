import {getApps, initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";

export const DATABASE_ID = "global-af-database";

const app = getApps()[0] ?? initializeApp();

/** Base Firestore nommée du projet (firebase.json → firestore.database). */
export const db = getFirestore(app, DATABASE_ID);
export const auth = getAuth(app);
