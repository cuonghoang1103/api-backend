/**
 * CT Work — iCalendar (RFC 5545) THUẦN: escape, gập dòng, sự kiện có giờ của cuộc họp.
 * Dùng chung cho lịch đăng ký cá nhân (calendar.service.ts) và lời mời họp
 * (meetings.service.ts: tệp đính kèm email + nút tải .ics). Test: governance.test.ts.
 *
 * Luật RFC 5545 được giữ ở đây:
 *   - TEXT escape `\` `;` `,` và xuống dòng (§3.3.11);
 *   - dòng ≤ 75 OCTET, dòng tiếp bắt đầu bằng một dấu cách, không cắt giữa ký tự UTF-8 (§3.1);
 *   - xuống dòng CRLF;
 *   - DTSTART/DTEND dạng UTC (…Z) — hợp lệ mà không cần VTIMEZONE; múi giờ gốc ghi ở
 *     X-CTWORK-TZ + mô tả để người đọc biết giờ họp theo múi nào.
 *
 * Quyền riêng tư: ATTENDEE/ORGANIZER cần một cal-address (URI). KHÔNG đưa email của người
 * khác ra (luật PUBLIC_USER của CT Work) — chỉ email của CHÍNH người nhận tệp; người khác
 * dùng URI `urn:ctwork:user:<id>` kèm CN (tên hiển thị). Người tổ chức dùng địa chỉ gửi thư
 * của hệ thống (không phải email cá nhân).
 */

/** Escape giá trị TEXT (SUMMARY, DESCRIPTION, LOCATION, CN không ngoặc…). */
export const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Gập dòng dài theo RFC 5545 (≤ 75 byte/dòng, dòng tiếp bắt đầu bằng một dấu cách) — không cắt giữa ký tự UTF-8. */
export function icsFold(line: string): string {
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    // Dòng tiếp đã có 1 byte dấu cách ở đầu ⇒ còn 74 byte cho nội dung.
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** 20261005T020000Z */
export const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

/** Tham số CN (RFC 5545 §3.2.2): bỏ ký tự điều khiển + ngoặc kép, bọc trong ngoặc kép (có `:` `;` `,` vẫn an toàn). */
export const icsParam = (s: string) => `"${s.replace(/[\u0000-\u001f"]/g, '').slice(0, 120)}"`;

export interface IcsPerson { id: number; name: string; email?: string | null }

export interface IcsMeeting {
  uid: string;
  sequence: number;
  title: string;
  status: 'SCHEDULED' | 'DONE' | 'CANCELLED' | string;
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  location?: string | null;
  url?: string | null;
  meetingUrl?: string | null;
  description?: string | null;
  categories?: string | null;
  organizer: { name: string; email: string };
  attendees: IcsPerson[];
  updatedAt?: Date;
}

/** Địa chỉ lịch của một người: email (chỉ khi được phép đưa ra) hoặc URN theo id. */
const calAddress = (p: IcsPerson) => (p.email ? `mailto:${p.email}` : `urn:ctwork:user:${p.id}`);

/** Các dòng (chưa gập) của MỘT VEVENT có giờ. */
export function meetingEventLines(m: IcsMeeting, now: Date): string[] {
  const where = [m.location?.trim(), m.meetingUrl?.trim()].filter(Boolean).join(' · ');
  return [
    'BEGIN:VEVENT',
    `UID:${m.uid}`,
    `SEQUENCE:${Math.max(0, m.sequence)}`,
    `DTSTAMP:${icsStamp(now)}`,
    ...(m.updatedAt ? [`LAST-MODIFIED:${icsStamp(m.updatedAt)}`] : []),
    `DTSTART:${icsStamp(m.startsAt)}`,
    `DTEND:${icsStamp(m.endsAt > m.startsAt ? m.endsAt : new Date(m.startsAt.getTime() + 30 * 60_000))}`,
    `SUMMARY:${icsEscape(m.title)}`,
    ...(where ? [`LOCATION:${icsEscape(where)}`] : []),
    ...(m.description ? [`DESCRIPTION:${icsEscape(m.description)}`] : []),
    ...(m.url ? [`URL:${m.url}`] : []),
    ...(m.categories ? [`CATEGORIES:${icsEscape(m.categories)}`] : []),
    `ORGANIZER;CN=${icsParam(m.organizer.name)}:mailto:${m.organizer.email}`,
    ...m.attendees.map((a) => `ATTENDEE;CN=${icsParam(a.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION:${calAddress(a)}`),
    `STATUS:${m.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED'}`,
    `X-CTWORK-TZ:${icsEscape(m.timezone)}`,
    // CTW-24: link phòng họp dạng "Join" — RFC 7986 CONFERENCE (Apple/Thunderbird hiện nút vào phòng);
    // Outlook/Google đọc LOCATION + dòng "Join:" đầu mô tả.
    ...(m.meetingUrl?.trim() && /^https?:\/\//i.test(m.meetingUrl.trim()) ? [`CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;LABEL=Join meeting:${m.meetingUrl.trim()}`] : []),
    'TRANSP:OPAQUE',
    // CTW-24: nhắc trước 10 phút (lịch của người nhận tự báo).
    ...(m.status !== 'CANCELLED' ? ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(m.title)}`, 'TRIGGER:-PT10M', 'END:VALARM'] : []),
    'END:VEVENT',
  ];
}

/** Một tệp .ics hoàn chỉnh (gập dòng + CRLF). METHOD:PUBLISH — tệp thông tin, không mở luồng RSVP qua email. */
export function icsDocument(eventLines: string[], opts: { name?: string } = {}): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//cuongthai.com//CT Work//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...(opts.name ? [`X-WR-CALNAME:${icsEscape(opts.name)}`] : []),
    ...eventLines,
    'END:VCALENDAR',
  ].map(icsFold).join('\r\n') + '\r\n';
}
