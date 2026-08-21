"use client";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main>
      <h1>Щось пішло не так</h1>

      <p>
        Під час роботи застосунку сталася помилка. Спробуйте повторити операцію.
      </p>

      {process.env.NODE_ENV === "development" && <p>{error.message}</p>}

      <button type="button" onClick={reset}>
        Спробувати ще раз
      </button>
    </main>
  );
}
