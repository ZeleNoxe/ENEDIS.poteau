export interface Pole {
  id: string;
  name: string;
  height: number;
  class: string;
  value: number;
  remarks: string;
  elements: PoleElement[];
}

export interface PoleElement {
  id: string;
  name: string;
  quantity: number;
  isCustom?: boolean;
  status?: 'pose' | 'depose' | 'conserve';
}

export interface Session {
  id: string;
  name: string;
  createdAt: string;
  poles: Pole[];
}

export const PREDEFINED_ELEMENTS = [
  'EAS 35Alu',
  'EAS 70Alu',
  'EAS 150Alu',
  'ES 35Alu',
  'ES 70Alu',
  'ES 150Alu',
  'RAS BT',
  'BRN2',
  'BRN4',
  'BBN',
  'BRNAS 2 35.Alu',
  'BRNAS 4 35.Alu',
  'BRNAS 2 25T.Alu',
  'BRNAS 4 25T.Alu',
  'MALT isolée',
  'MALT non isolée',
  'EP FOY',
  'Console télécom',
  'RAS télécom',
  'Coffret télécom'
] as const;