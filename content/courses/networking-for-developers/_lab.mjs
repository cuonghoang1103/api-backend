/**
 * _lab.mjs — nhúng mô phỏng tương tác vào bài khoá Networking for Developers.
 *   ${net('encap', 'http', 'vi', 'Một request đi xuống các tầng rồi lên lại', { tour: 'encap-layers' })}
 * net() = labEmbed('net-lab', …) của content/_labs.mjs (phòng lab mạng /net-lab, frontend/src/components/net-lab/).
 * Cần mô phỏng của phòng lab khác (vd bit/byte của /cpu-lab) ⇒ dùng labEmbed trực tiếp.
 */
import { labEmbed } from '../../_labs.mjs';
export { labEmbed };
/** @param {{ tour?: string }} [opts] */
export const net = (sim, preset, lang, caption, opts = {}) => labEmbed('net-lab', sim, preset, lang, caption, opts);
