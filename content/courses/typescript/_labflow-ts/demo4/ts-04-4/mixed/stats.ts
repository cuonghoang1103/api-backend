// Known properties and an index signature in one type must agree.
export type SeatStats = {
  [lab: string]: number;
  updatedAt: string;
};
