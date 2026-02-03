import type { Department } from '@/shared/types';

export interface DepartmentOption {
  value: Department;
  label: string;
}

export const DEPARTMENTS: DepartmentOption[] = [
  { value: 'dev', label: '개발팀' },
  { value: 'design', label: '디자인팀' },
  { value: 'marketing', label: '마케팅팀' },
  { value: 'sales', label: '영업팀' },
  { value: 'hr', label: '인사팀' },
  { value: 'finance', label: '재무팀' },
];
