import { initializeApp,type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getFirestore, Firestore, serverTimestamp } from "firebase/firestore"; // Thêm dòng này

const firebaseConfig = {
  apiKey: "AIzaSyDREuWtCge97TpI0FN3tCGKaBYfLHbL1dg",
  authDomain: "gen-lang-client-0934000042.firebaseapp.com",
  projectId: "gen-lang-client-0934000042",
  storageBucket: "gen-lang-client-0934000042.firebasestorage.app",
  messagingSenderId: "595180731029",
  appId: "1:595180731029:web:7ea041e2ae57837e5fb99c",
  measurementId: "G-GBRGQWF7EJ",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db: Firestore = getFirestore(app); 

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Export db và serverTimestamp để OperatorChat có thể dùng
export { app, analytics, db, serverTimestamp };