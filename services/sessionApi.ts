import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { Session } from "@/types/session";

type CreateSessionData = Omit<Session, "id">;

export const createSession = async (
  data: CreateSessionData,
): Promise<string> => {
  const sessionRef = await addDoc(collection(db, "sessions"), data);

  return sessionRef.id;
};

export const completeSession = async (
  sessionId: string,
  data: Pick<
    Session,
    | "finishedAt"
    | "completedTasksCount"
    | "correctAnswersCount"
    | "accuracy"
    | "totalTime"
    | "averageTime"
    | "status"
  >,
): Promise<void> => {
  const sessionRef = doc(db, "sessions", sessionId);

  await updateDoc(sessionRef, data);
};
