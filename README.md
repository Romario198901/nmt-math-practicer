# НМТ Математика

Вебтренажер для підготовки до НМТ з математики. Користувач налаштовує тренування, проходить завдання з таймером і наприкінці отримує відсоток правильних відповідей та статистику часу.

## Можливості

- вибір теми: числа, відсотки, алгебра, степені, геометрія, функції, ймовірність і текстові задачі;
- вибір кількості завдань: 5, 10, 20 або 30;
- фільтрація за складністю та типом завдання;
- перемішування завдань і варіантів відповідей;
- режим без паузи між питаннями (Ultimate mode);
- перевірка відповідей, пояснення та формули;
- підсумковий результат із кількістю правильних відповідей, загальним і середнім часом.

## Технології

- [Next.js](https://nextjs.org/) 16 з App Router;
- React 19 і TypeScript;
- Zustand для налаштувань та стану сесії;
- Firebase Firestore для зберігання завдань;
- CSS Modules і `modern-normalize`.

## Запуск локально

Потрібні Node.js 20+ та npm.

1. Встановіть залежності:

   ```bash
   npm install
   ```

2. Створіть файл `.env.local` у корені проєкту та додайте конфігурацію Firebase:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. Запустіть dev-сервер:

   ```bash
   npm run dev
   ```

   Відкрийте [http://localhost:3000](http://localhost:3000).

## Дані Firestore

Застосунок читає документи з колекції `questions`. Приклад документа:

```json
{
  "id": "question-001",
  "category": "algebra",
  "subcategory": "linear-equations",
  "difficulty": "medium",
  "type": "single",
  "question": "Розв'яжіть рівняння...",
  "options": ["1", "2", "3", "4"],
  "correctAnswer": ["2"],
  "explanation": "...",
  "formula": "...",
  "points": 1
}
```

Допустимі значення `difficulty`: `easy`, `medium`, `hard`. Допустимі значення `type`: `single`, `short`, `matching`. Поля `options` і `formula` є необов'язковими, а `correctAnswer` завжди має бути масивом рядків.

## Скрипти

```bash
npm run dev      # локальна розробка
npm run lint     # ESLint
npm run build    # production-збірка
npm run start    # запуск production-збірки
```

## Структура

- `app/` — сторінки налаштування, тренування та результатів;
- `components/` — UI-компоненти та їхні CSS Modules;
- `hooks/` — логіка проходження тренування й таймер;
- `services/` — отримання завдань із Firestore;
- `stores/` — Zustand-стори налаштувань і поточної сесії;
- `types/` — типи завдань і тренування;
- `utils/` — фільтрація сесії та перевірка відповідей.

## Деплой

Проєкт можна розгорнути на [Vercel](https://vercel.com/). Додайте всі `NEXT_PUBLIC_FIREBASE_*` змінні до Environment Variables проєкту перед збіркою.
