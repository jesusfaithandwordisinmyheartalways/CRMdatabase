


export interface Lead {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    status: 'HOT' | 'COLD' | 'PROSPECT' | 'NATURE';
    notes: string;
  }