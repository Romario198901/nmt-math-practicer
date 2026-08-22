import type { Metadata } from 'next';

import ProgressPageClient from '@/components/ProgressPageClient/ProgressPageClient';

export const metadata: Metadata = {
  title: 'Прогрес навчання',
  description:
    'Перегляньте прогрес підготовки до НМТ з математики: засвоєні, активні та ще не розпочаті теми.',
};

export default function ProgressPage() {
  return <ProgressPageClient />;
}