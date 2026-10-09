import type { agents as En } from '../en/agents';
import type { Strings } from '../core';

export const agents: Strings<typeof En> = {
  secAgo: '{n} giây trước',
  stalled: 'đứng',
  agentStalled: 'agent bị đứng',
  working: 'đang làm',
  stalledTip: 'Agent ngừng gửi tín hiệu (lần cuối {when}). Thẻ được đánh dấu bị chặn cho tới khi có người xem.',
  workingTip: 'Một AI agent đang làm thẻ này{progress} · tín hiệu cuối {when}',
  people: 'Người',
  agents: 'Agent',
  assigneeKind: 'Loại người thực hiện',
  kindAll: 'Người và AI agent',
  kindHuman: 'Chỉ thẻ giao cho người',
  kindAgent: 'Chỉ thẻ giao cho AI agent',
};
