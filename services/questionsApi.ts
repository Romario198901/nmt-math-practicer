import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Question } from "@/types/question";

export const getQuestions = async (): Promise<Question[]> => {
  const querySnapshot = await getDocs(collection(db, "questions"));
  return querySnapshot.docs.map((doc) => doc.data() as Question);
};
