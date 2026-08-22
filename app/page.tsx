import type { Metadata } from "next";

import Container from "@/components/Container/Container";
import PracticeSetup from "@/components/PracticeSetup/PracticeSetup";

export const metadata: Metadata = {
  title: "НМТ Математика — тренажер",
  description:
    "Налаштуйте тренування з математики для підготовки до НМТ: оберіть тему, складність, тип і кількість завдань.",
};

interface HomePageProps {
  searchParams: Promise<{
    theme?: string | string[];
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const initialThemeId =
    typeof params.theme === "string" ? params.theme : undefined;

  return (
    <main>
      <Container>
        <PracticeSetup initialThemeId={initialThemeId} />
      </Container>
    </main>
  );
}
