export const data: any = {
  "MRI SCAN": 900,
  "CT SCAN": 750,
  "BLOOD TEST": 200,
  "X-RAY": 10,
  ULTRASOUND: 500,
  "Full Check Up": 500,
  "ER Visit": 1000,
  "Ear & Throat": 200,
};

export type BillItem = {
  description: string;
  billed: number;
  cms?: number;
};
