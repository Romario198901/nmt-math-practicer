export interface Theme {
  id: string;
  title: string;
  description?: string;
  prerequisites: string[];
  level: number;
  order: number;
  isActive: boolean;
}
