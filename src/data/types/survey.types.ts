type Survey = {
  _id: string;
  name: string;
  description: string;
  greeting: string;
  startDate: string;
  endDate: string;
  owner: string;
  created: string;
  edited: string;
  draft: boolean;
  archived: boolean;
  questions: [];
};

export type { Survey };
