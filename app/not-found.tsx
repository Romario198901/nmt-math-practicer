import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <p>Сторінку не знайдено.</p>

      <Link href="/">Повернутися на головну</Link>
    </main>
  );
}
