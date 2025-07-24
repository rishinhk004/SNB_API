import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin/app";
import serviceAccount from "./snb25-8a890-firebase-adminsdk-fbsvc-464ea94d73.json" assert { type: "json" };

const initializeFirebase = () => {
  if (!admin.apps.length) {
    console.log("Initializing Firebase...");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
    console.log("Firebase initialized successfully.");
  }
};

const getFirebaseAuth = () => {
  if (!admin.apps.length) {
    initializeFirebase();
  }
  return admin.auth();
};

export { getFirebaseAuth };
