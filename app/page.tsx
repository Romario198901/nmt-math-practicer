"use client";

import { useEffect, useState } from "react";
import { getQuestions } from "@/services/questionsApi";
import { Question } from "@/types/question";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();

        setQuestions(data);
        console.log("Questions:", data);
      } catch (error) {
        console.error(error);
        setError("Не вдалося завантажити задачі");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (isLoading) {
    return <main>Завантаження...</main>;
  }

  if (error) {
    return <main>{error}</main>;
  }

  return (
    <main>
      <h1>NMT Math Practicer</h1>

      <p>Отримано задач: {questions.length}</p>

      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.id} — {question.question}
          </li>
        ))}
      </ul>
    </main>
  );
}
