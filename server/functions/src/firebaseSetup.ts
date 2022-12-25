import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const admin = initializeApp();
export const auth = getAuth(admin);
export const db = getFirestore(admin);
