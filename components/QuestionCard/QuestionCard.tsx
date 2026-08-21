"use client";

import { useState } from "react";

import type { Question } from "@/types/question";

import { getCategoryLabel } from "@/utils/getCategoryLabel";

import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean | null;
  onAnswer: (answer: string) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  isCorrect,
  onAnswer,
}: QuestionCardProps) {
  const [shortAnswer, setShortAnswer] = useState("");

  const handleShortAnswer = () => {
    if (!shortAnswer.trim()) {
      return;
    }

    onAnswer(shortAnswer);
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <p className={styles.category}>{getCategoryLabel(question.category)}</p>

        <h1 className={styles.question}>{question.question}</h1>
      </div>

      {question.type === "single" && question.options && (
        <div className={styles.answers}>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={option}
                className={`${styles.answerButton} ${
                  isSelected ? styles.selectedAnswer : ""
                }`}
                type="button"
                disabled={isAnswered}
                onClick={() => onAnswer(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {question.type === "short" && (
        <div className={styles.shortAnswer}>
          <input
            className={styles.input}
            type="text"
            value={shortAnswer}
            disabled={isAnswered}
            placeholder="Введіть відповідь"
            onChange={(event) => setShortAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleShortAnswer();
              }
            }}
          />

          <button
            className={styles.submitButton}
            type="button"
            disabled={!shortAnswer.trim() || isAnswered}
            onClick={handleShortAnswer}
          >
            Відповісти
          </button>
        </div>
      )}

      {isAnswered && (
        <div
          className={`${styles.feedback} ${
            isCorrect ? styles.success : styles.error
          }`}
        >
          <strong>
            {isCorrect ? "Правильна відповідь" : "Неправильна відповідь"}
          </strong>

          {!isCorrect && (
            <p>Правильна відповідь: {question.correctAnswer.join(", ")}</p>
          )}

          <p>{question.explanation}</p>
        </div>
      )}
    </article>
  );
}
