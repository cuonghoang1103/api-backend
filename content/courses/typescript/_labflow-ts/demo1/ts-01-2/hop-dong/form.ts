import { needsApproval } from './approval.ts';

// Booking form: still written for the OLD signature.
export const formNeedsApproval = needsApproval(31, 'STUDENT');
