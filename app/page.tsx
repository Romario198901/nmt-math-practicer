import type { Metadata } from "next";

import PracticeSetup from "@/components/PracticeSetup/PracticeSetup";

export const metadata: Metadata = {
  title: "НМТ Математика — тренажер",
  description:
    "Налаштуйте тренування з математики для підготовки до НМТ: оберіть тему, складність, тип і кількість завдань.",
};

export default function HomePage() {
  return (
    <main>
      <PracticeSetup />
    </main>
  );
}
