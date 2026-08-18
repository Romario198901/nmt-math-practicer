import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const questionsPath = path.join(__dirname, "../data/questions.json");
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

const seedQuestions = async () => {
  try {
    for (const question of questions) {
      const questionRef = doc(db, "questions", question.id);

      await setDoc(questionRef, question);

      console.log(`Added: ${question.id}`);
    }

    console.log("Questions seeded successfully");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedQuestions();
