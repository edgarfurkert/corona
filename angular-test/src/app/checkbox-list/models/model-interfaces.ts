export interface CheckboxItem {
  id: string;
  label: string;
  state?: boolean;
}

export function createInitialItem(): CheckboxItem {
  return {
    id: '',
    label: '',
    state: false
  };
}