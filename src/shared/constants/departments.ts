import type { Department } from '@/shared/types';

export interface DepartmentOption {
  value: Department;
  label: string;
}

export const DEPARTMENTS: DepartmentOption[] = [
  { value: 'strategy', label: '전략기획실' },
  { value: 'dev', label: '개발실' },
];
