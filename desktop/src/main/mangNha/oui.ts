/**
 * Tra HÃNG sản xuất từ 3 byte đầu của địa chỉ MAC (OUI — Organizationally
 * Unique Identifier), HOÀN TOÀN OFFLINE.
 *
 * Vì sao không tải cơ sở dữ liệu OUI đầy đủ: bản đầy đủ của IEEE ~3 MB và phải
 * tải qua mạng — mà chính lúc người dùng cần công cụ này là lúc mạng đang yếu
 * hoặc họ nghi có kẻ lạ. Một công cụ chẩn đoán mạng mà phải có mạng mới chạy
 * được thì vô dụng. Nên: gói sẵn ~90 hãng phổ biến nhất ở VN (điện thoại,
 * laptop, router, TV, camera). Không khớp thì trả về chính chuỗi OUI để người
 * dùng tự tra — thà nói "AC:DE:48" còn hơn đoán bừa một cái tên.
 *
 * Một hãng có RẤT nhiều OUI (Apple có hàng trăm). Đây chỉ là các prefix hay
 * gặp; mục tiêu là "đoán đúng phần lớn thiết bị trong một nhà", không phải
 * "phân loại mọi thiết bị trên đời".
 */

/** OUI (6 hex, chữ HOA, không dấu phân cách) → tên hãng. */
const BANG: Readonly<Record<string, string>> = {
  // Apple
  '3C0754': 'Apple', 'F0766F': 'Apple', 'A85C2C': 'Apple', 'AC DE48': 'Apple',
  'ACDE48': 'Apple', '001451': 'Apple', '0017F2': 'Apple', '3451C9': 'Apple',
  '685B35': 'Apple', '90B21F': 'Apple', 'D0817A': 'Apple', 'F4F15A': 'Apple',
  '8866A5': 'Apple', 'DC2B2A': 'Apple', '9C207B': 'Apple', 'E0ACCB': 'Apple',
  // Samsung
  '5001BB': 'Samsung', 'E8508B': 'Samsung', '8425DB': 'Samsung', 'C81EE7': 'Samsung',
  '0016DB': 'Samsung', '347593': 'Samsung', '10D38A': 'Samsung', 'F409D8': 'Samsung',
  // Xiaomi
  '286C07': 'Xiaomi', '640980': 'Xiaomi', '7451BA': 'Xiaomi', 'F8A45F': 'Xiaomi',
  '3480B3': 'Xiaomi', '50EC50': 'Xiaomi', '9C99A0': 'Xiaomi', 'FC64BA': 'Xiaomi',
  // Huawei / Honor
  '00E0FC': 'Huawei', '48435A': 'Huawei', '4C1FCC': 'Huawei', 'E4A7A0': 'Huawei',
  '5CA86A': 'Huawei', '781DBA': 'Huawei', 'A47174': 'Huawei',
  // Oppo / Vivo / Realme (BBK)
  '9C2A83': 'OPPO', 'C0EEFB': 'OPPO', 'D89B3B': 'vivo', '4C49E3': 'vivo',
  // Google
  '3C5AB4': 'Google', 'F4F5D8': 'Google', 'A47733': 'Google', 'D8EB46': 'Google',
  // Intel (laptop Wi-Fi)
  '001B21': 'Intel', '3C970E': 'Intel', '7C7A91': 'Intel', 'A0A8CD': 'Intel',
  '48513B': 'Intel', '9440C9': 'Intel', 'E4B318': 'Intel', '34F39A': 'Intel',
  // TP-Link (router hay gặp ở VN)
  '50C7BF': 'TP-Link', 'EC086B': 'TP-Link', 'C46E1F': 'TP-Link', '9C5322': 'TP-Link',
  '1C61B4': 'TP-Link', 'AC84C6': 'TP-Link', '6045CB': 'TP-Link',
  // Router / thiết bị mạng khác
  '00259C': 'Cisco', '000C29': 'VMware', 'B827EB': 'Raspberry Pi', 'DCA632': 'Raspberry Pi',
  '001A2B': 'ASUS', '2CFDA1': 'ASUS', '04D4C4': 'ASUS', 'D850E6': 'ASUS',
  '000FB5': 'Netgear', '9C3DCF': 'Netgear', 'A040A0': 'Netgear',
  '0018E7': 'Draytek', 'F81A67': 'TP-Link',
  // Amazon (Echo, Fire TV), Sony, LG, TV
  '747548': 'Amazon', 'FC65DE': 'Amazon', '68370E': 'Sony', '3475C7': 'LG',
  '00E091': 'LG', 'CC2D8C': 'LG',
  // Microsoft (Surface, Xbox), Dell, Lenovo, HP
  '000D3A': 'Microsoft', '7CED8D': 'Microsoft', 'B4926A': 'Dell', 'F8BC12': 'Dell',
  '18DBF2': 'Dell', '54BF64': 'Dell', '8CEC4B': 'Lenovo', 'E8B1FC': 'Lenovo',
  '3C2AF4': 'Brother', '9CB6D0': 'Realtek', '00E04C': 'Realtek',
};

/**
 * `mac` dạng bất kỳ (`ab:cd:ef:...`, `AB-CD-EF-...`). Trả tên hãng, hoặc chuỗi
 * OUI `AB:CD:EF` khi không biết, hoặc `null` khi MAC không hợp lệ.
 */
export function tenHang(mac: string): string | null {
  const hex = mac.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  if (hex.length < 6) return null;
  const oui = hex.slice(0, 6);
  if (BANG[oui]) return BANG[oui];
  return `${oui.slice(0, 2)}:${oui.slice(2, 4)}:${oui.slice(4, 6)}`;
}

/**
 * MAC "phát ngẫu nhiên để bảo vệ riêng tư" — điện thoại đời mới đặt bit
 * locally-administered (bit thứ 2 của byte đầu) khi giấu MAC thật. Biết điều
 * này thì không kết luận nhầm "thiết bị lạ hãng lạ": rất có thể là điện thoại
 * của chính người trong nhà đang bật quyền riêng tư.
 */
export function macNgauNhien(mac: string): boolean {
  const hex = mac.replace(/[^0-9a-fA-F]/g, '');
  if (hex.length < 2) return false;
  const byteDau = Number.parseInt(hex.slice(0, 2), 16);
  return (byteDau & 0x02) === 0x02;
}
