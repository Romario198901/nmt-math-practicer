'use client';

import { useState } from 'react';

import type { Question } from '@/types/question';

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
  const [shortAnswer, setShortAnswer] = useState('');

  return (
    <section>
      <h2>{question.question}</h2>

      {question.type === 'single' && question.options && (
        <div>
          {question.options.map(option => (
            <button
              key={option}
              type="button"
              disabled={isAnswered}
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === 'short' && (
        <div>
          <input
            type="text"
            value={shortAnswer}
            disabled={isAnswered}
            placeholder="Введіть відповідь"
            onChange={event =>
              setShortAnswer(event.target.value)
            }
          />

          <button
            type="button"
            disabled={!shortAnswer.trim() || isAnswered}
            onClick={() => onAnswer(shortAnswer)}
          >
            Відповісти
          </button>
        </div>
      )}

      {isAnswered && (
        <div>
          <p>
            {isCorrect
              ? 'Правильна відповідь'
              : 'Неправильна відповідь'}
          </p>

          {!isCorrect && (
            <p>
              Правильна відповідь:{' '}
              {question.correctAnswer.join(', ')}
            </p>
          )}

          <p>{question.explanation}</p>
        </div>
      )}

      {selectedAnswer && (
        <p>Ваша відповідь: {selectedAnswer}</p>
      )}
    </section>
  );
}