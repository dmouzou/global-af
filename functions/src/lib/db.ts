import {App, getApps, initializeApp} from "firebase-admin/app";
import {Auth, getAuth} from "firebase-admin/auth";
import {Firestore, getFirestore} from "firebase-admin/firestore";

export const DATABASE_ID = "global-af-database";

let appInstance: App | undefined;
function getApp(): App {
  if (!appInstance) {
    appInstance = getApps()[0] ?? initializeApp();
  }
  return appInstance;
}

let dbInstance: Firestore | undefined;
function getDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getApp(), DATABASE_ID);
  }
  return dbInstance;
}

let authInstance: Auth | undefined;
function getAuthInstance(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getApp());
  }
  return authInstance;
}

/**
 * Base Firestore nommée du projet (firebase.json → firestore.database).
 * Instanciée paresseusement pour éviter tout blocage réseau/gRPC
 * lors de la phase d'analyse de code de Firebase CLI.
 */
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const instance = getAuthInstance();
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

