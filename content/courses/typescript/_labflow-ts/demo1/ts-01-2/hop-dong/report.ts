import { needsApproval } from './approval.ts';

// Monthly report: also written for the OLD signature.
export function countPending(seatsList: number[]): number {
  return seatsList.filter((seats) => needsApproval(seats, 'STUDENT')).length;
}
