import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { TaskResult } from "@/types/taskResult";

type CreateTaskResultData = Omit<TaskResult, "id">;

export const createTaskResult = async (
  data: CreateTaskResultData,
): Promise<string> => {
  const taskResultRef = await addDoc(collection(db, "taskResults"), data);

  return taskResultRef.id;
};

export const getUserTaskResults = async (
  userId: string,
): Promise<TaskResult[]> => {
  const taskResultsQuery = query(
    collection(db, "taskResults"),
    where("userId", "==", userId),
  );

  const querySnapshot = await getDocs(taskResultsQuery);

  return querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as TaskResult[];
};
