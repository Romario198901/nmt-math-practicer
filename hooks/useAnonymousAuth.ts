"use client";

import { useState } from "react";

import { signInAnonymousUser } from "@/services/authApi";

export const useAnonymousAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);

  const ensureAnonymousUser = async () => {
    try {
      setIsAuthLoading(true);
      setAuthError(null);

      const user = await signInAnonymousUser();

      setUserId(user.uid);

      return user.uid;
    } catch (error) {
      console.error(error);

      setAuthError("Не вдалося створити анонімну сесію користувача.");

      return null;
    } finally {
      setIsAuthLoading(false);
    }
  };

  return {
    userId,
    isAuthLoading,
    authError,
    ensureAnonymousUser,
  };
};
