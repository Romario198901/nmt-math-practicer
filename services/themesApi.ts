import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";

import type { Theme } from "@/types/theme";

export const getThemes = async (): Promise<Theme[]> => {
  const themesQuery = query(collection(db, "themes"), orderBy("order", "asc"));

  const querySnapshot = await getDocs(themesQuery);

  return querySnapshot.docs.map((document) => document.data() as Theme);
};
