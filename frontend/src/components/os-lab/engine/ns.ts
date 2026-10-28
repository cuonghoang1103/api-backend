/**
 * "Một tiến trình, hai góc nhìn" — engine thuần cho mô phỏng `nslayers` (Chương 12, bài 12.1 + 12.7).
 *
 * Cùng MỘT tiến trình (sleep 600 trong container "web") nhìn từ máy chủ (máy ảo Docker) và từ bên trong. Mỗi namespace
 * bật lên thay đổi đúng một thứ bên trong nhìn thấy: pid ⇒ nó là PID 1 (NSpid "71743 1"); uts ⇒ hostname riêng;
 * mnt ⇒ cây mount riêng; net ⇒ card mạng riêng; ipc ⇒ hàng đợi IPC riêng; cgroup ⇒ "/docker/…" thành "/"; user ⇒
 * bảng uid_map (root trong = dev ngoài); time ⇒ đồng hồ boot/monotonic riêng. Không có máy ảo nào: cùng nhân, cùng lõi.
 * Số liệu khớp lab/out/c121-ns + c121-host (PID 71743, shim 71719, inode namespace 4026533375…, uid_map 0 1001 1,
 * remap 0 100000 65536, unshare thiếu --fork ⇒ "Cannot fork", thiếu --mount-proc ⇒ "fatal library error, lookup self")
 * và c127-host (pod: pause + app dùng chung net/pid/ipc, sidecar gọi 127.0.0.1:8000).
 */

export const KINDS = ['pid', 'mnt', 'net', 'uts', 'ipc', 'user', 'cgroup', 'time'] as const;
export type NsKind = (typeof KINDS)[number];
export type UserMode = 'rootless' | 'remap';
export type NsOn = Record<NsKind, boolean>;

/** inode namespace thật (c121-host): container vs PID 1 của máy ảo Docker. */
export const INODES: Record<NsKind, [number, number]> = {
  pid: [4026533378, 4026531836], net: [4026533380, 4026531833], mnt: [4026533375, 4026531832], uts: [4026533376, 4026531838],
  ipc: [4026533377, 4026531839], user: [4026533514, 4026531837], cgroup: [4026533379, 4026531835], time: [4026533508, 4026531834],
};

export const HOST_PID = 71743, SHIM_PID = 71719;

export interface View {
  hostname: string;
  /** PID của sleep nhìn từ phía này */
  pid: number;
  nspid: string;
  ps: string[];
  ifaces: string[];
  mounts: string[];
  ipcs: string;
  uidMap: string;
  id: string;
  capEff: string;
  touchEtc: string;
  cgroup: string;
  uptime: string;
}

export const allOff = (): NsOn => ({ pid: false, mnt: false, net: false, uts: false, ipc: false, user: false, cgroup: false, time: false });
export const dockerDefault = (): NsOn => ({ pid: true, mnt: true, net: true, uts: true, ipc: true, user: false, cgroup: true, time: true });

const HOST_PS = [
  '    1     0 /sbin/init',
  '  412     1 /usr/bin/containerd',
  '  598     1 /usr/bin/dockerd -H fd://',
  '  731     1 /usr/sbin/sshd -D',
  `${SHIM_PID}     1 /usr/bin/containerd-shim-runc-v2 -namespace moby -id a9c3949e…`,
  `${HOST_PID} ${SHIM_PID} sleep 600`,
];

/** Góc nhìn TỪ TRONG container với các namespace đang bật. */
export function inside(on: NsOn, user: UserMode = 'rootless'): View {
  const pid = on.pid ? 1 : HOST_PID;
  return {
    hostname: on.uts ? 'web' : 'docker-desktop',
    pid,
    nspid: on.pid ? 'NSpid:\t1' : `NSpid:\t${HOST_PID}`,
    ps: on.pid ? (on.mnt ? ['  PID  PPID CMD', '    1     0 sleep 600', '    7     0 ps -ef'] : ['fatal library error, lookup self']) : ['  PID  PPID CMD', ...HOST_PS, `${HOST_PID + 9} ${HOST_PID} ps -ef`],
    ifaces: on.net ? ['lo            UNKNOWN 127.0.0.1/8', 'eth0@if1110   UP      172.17.0.5/16'] : ['lo            UNKNOWN 127.0.0.1/8', 'eth0          UP      192.168.65.3/24', 'docker0       UP      172.17.0.1/16', 'veth3f2a@if2  UP'],
    mounts: on.mnt ? ['/            overlay  overlay', '/proc        proc     proc', '/etc/hosts   ext4     /dev/vda1[…/hosts]', '/sys/fs/cgroup cgroup2 cgroup'] : ['/            ext4     /dev/vda1', '/var/lib/docker ext4  /dev/vda1', '/proc        proc     proc', '/run/docker.sock …'],
    ipcs: on.ipc ? '(no message queues)' : '0x34a8bc7d 0  root 644  (the host\'s queue)',
    uidMap: on.user ? (user === 'rootless' ? '         0       1001          1' : '         0     100000      65536') : '         0          0 4294967295',
    id: on.user && user === 'remap' ? 'uid=0(root) — files of host root show up as nobody (65534)' : 'uid=0(root) gid=0(root)',
    capEff: on.user ? '000001ffffffffff (all, but only inside this user ns)' : '00000000a80425fb (Docker\'s default 14)',
    touchEtc: on.user ? "touch: cannot touch '/etc/hacked': Permission denied" : '(allowed — root inside IS root outside)',
    cgroup: on.cgroup ? '0::/' : '0::/docker/a9c3949e450c…',
    uptime: on.time ? 'up 0 min (own CLOCK_BOOTTIME offset)' : 'up 3 days, 4:12 (the VM\'s clock)',
  };
}

/** Góc nhìn TỪ MÁY CHỦ: luôn thấy mọi thứ thật. */
export function host(on: NsOn): View {
  return {
    hostname: 'docker-desktop', pid: HOST_PID, nspid: on.pid ? `NSpid:\t${HOST_PID}\t1` : `NSpid:\t${HOST_PID}`,
    ps: ['  PID  PPID CMD', ...HOST_PS],
    ifaces: ['lo            UNKNOWN 127.0.0.1/8', 'eth0          UP      192.168.65.3/24', 'docker0       UP      172.17.0.1/16', ...(on.net ? ['veth3f2a@if2  UP      (the container\'s cable)'] : [])],
    mounts: ['/            ext4     /dev/vda1', '/var/lib/docker ext4  /dev/vda1', '/proc        proc     proc'],
    ipcs: '0x34a8bc7d 0  root 644', uidMap: '         0          0 4294967295', id: 'uid=0(root) gid=0(root)', capEff: '000001ffffffffff', touchEtc: '(allowed)',
    cgroup: '0::/init.scope', uptime: 'up 3 days, 4:12',
  };
}

/** Bảng inode namespace: container vs PID 1 máy ảo (giống nhau ⇔ namespace đó TẮT). */
export function inodeRows(on: NsOn): Array<{ kind: NsKind; inside: number; vm: number; same: boolean }> {
  return KINDS.map((k) => ({ kind: k, inside: on[k] ? INODES[k][0] : INODES[k][1], vm: INODES[k][1], same: !on[k] }));
}

export interface NsStep { on: NsOn; user: UserMode; hot?: NsKind; term?: string[]; tone?: 'ok' | 'bad' | 'warn'; en: string; vi: string; pod?: PodShare }

const add = (prev: NsOn, k: NsKind): NsOn => ({ ...prev, [k]: true });
function build(seq: Array<Omit<NsStep, 'on' | 'user'> & { on?: NsOn; set?: NsKind; user?: UserMode }>): NsStep[] {
  let on = allOff(); let user: UserMode = 'rootless';
  return seq.map((x) => { if (x.on) on = x.on; if (x.set) on = add(on, x.set); if (x.user) user = x.user; return { ...x, on: { ...on }, user, hot: x.set ?? x.hot }; });
}

export const NS_SCRIPTS: Record<string, NsStep[]> = {
  docker: build([
    { en: 'Start with NO namespaces: "sleep 600" is just a process on the Docker VM. From inside it sees everything the host sees: every process, the real network cards, the real disk.', vi: 'Bắt đầu KHÔNG có namespace nào: "sleep 600" chỉ là một tiến trình trên máy ảo Docker. Từ bên trong nó thấy mọi thứ máy chủ thấy: mọi tiến trình, card mạng thật, đĩa thật.' },
    { set: 'uts', en: 'UTS namespace: its own hostname. `hostname` now says "web" inside, while the VM is still "docker-desktop".', vi: 'UTS namespace: hostname riêng. Bên trong `hostname` giờ ra "web", còn máy ảo vẫn là "docker-desktop".' },
    { set: 'mnt', en: 'Mount namespace: its own mount table — the root is an overlay of the image layers, so the container sees the image\'s files, not the VM\'s disk. (ps still shows every process — /proc is still the host\'s numbering.)', vi: 'Mount namespace: bảng mount riêng — gốc là overlay của các lớp image, nên container thấy tệp của image, không thấy đĩa máy ảo. (ps vẫn thấy mọi tiến trình — /proc vẫn theo cách đánh số của máy chủ.)' },
    { set: 'pid', en: 'PID namespace: a new numbering starts at 1. The SAME process is PID 71743 on the host and PID 1 inside — /proc/71743/status says NSpid: 71743 1. Its parent outside is containerd-shim-runc-v2 (71719). A fresh /proc is mounted for the new numbering, so ps inside shows only two processes.', vi: 'PID namespace: một dãy số mới bắt đầu từ 1. CÙNG một tiến trình là PID 71743 trên máy chủ và PID 1 bên trong — /proc/71743/status ghi NSpid: 71743 1. Cha của nó bên ngoài là containerd-shim-runc-v2 (71719). Một /proc mới được gắn cho dãy số mới, nên ps bên trong chỉ thấy hai tiến trình.' },
    { set: 'net', en: 'Network namespace: its own network stack — lo plus eth0 (172.17.0.5), the end of a veth cable whose other end is on the VM. The VM\'s eth0 and docker0 are invisible.', vi: 'Network namespace: chồng mạng riêng — lo cùng eth0 (172.17.0.5), một đầu của sợi cáp veth mà đầu kia nằm trên máy ảo. eth0 và docker0 của máy ảo biến mất khỏi tầm nhìn.' },
    { set: 'ipc', en: 'IPC namespace: its own System V message queues and shared memory. The host\'s queue 0x34a8bc7d is no longer visible.', vi: 'IPC namespace: hàng đợi thông điệp và bộ nhớ chia sẻ System V riêng. Hàng đợi 0x34a8bc7d của máy chủ không còn thấy nữa.' },
    { set: 'cgroup', en: 'Cgroup namespace: /proc/self/cgroup shows "0::/" instead of the real path /docker/a9c3…. The limits still apply — only the view is re-rooted.', vi: 'Cgroup namespace: /proc/self/cgroup hiện "0::/" thay cho đường thật /docker/a9c3…. Giới hạn vẫn áp dụng — chỉ góc nhìn được đặt lại gốc.' },
    { set: 'time', en: 'Time namespace: offsets for CLOCK_MONOTONIC and CLOCK_BOOTTIME (lsns in the lab shows one). Wall-clock time is still the host\'s.', vi: 'Time namespace: độ lệch riêng cho CLOCK_MONOTONIC và CLOCK_BOOTTIME (lsns trong lab có thấy). Giờ thực vẫn là của máy chủ.' },
    { tone: 'warn', hot: 'user', en: 'This is a default Docker container: 7 namespaces differ from the VM\'s — but USER is the same inode (4026531837). uid_map is "0 0 4294967295": root inside IS root on the host, only fenced by capabilities and seccomp.', vi: 'Đây là một container Docker mặc định: 7 namespace khác máy ảo — nhưng USER cùng một inode (4026531837). uid_map là "0 0 4294967295": root bên trong CHÍNH LÀ root của máy chủ, chỉ bị rào bằng capability và seccomp.' },
  ]),
  unshare: build([
    { term: ['$ unshare --uts sh -c \'hostname mini; hostname\'', 'mini', '$ hostname', 'oslab'], set: 'uts', en: 'unshare runs a command in NEW namespaces. With --uts the child renames itself "mini"; the outside is still "oslab".', vi: 'unshare chạy một lệnh trong namespace MỚI. Với --uts tiến trình con tự đổi tên "mini"; bên ngoài vẫn là "oslab".' },
    { on: { ...allOff(), pid: true }, hot: 'pid', tone: 'bad', term: ['$ unshare --pid sh -c \'echo "sh is still PID $$"; /bin/true; /bin/true\'', 'sh is still PID 30', 'first child ran', 'sh: 1: Cannot fork'], en: 'Trap 1: --pid without --fork. The new PID namespace applies to the CHILDREN of unshare, not to unshare itself; the first child becomes PID 1 and exits — the namespace dies with it — so the second fork fails: "Cannot fork".', vi: 'Bẫy 1: --pid mà thiếu --fork. PID namespace mới áp cho CON của unshare, không phải chính nó; đứa con đầu thành PID 1 rồi thoát — namespace chết theo — nên lần fork thứ hai thất bại: "Cannot fork".' },
    { on: { ...allOff(), pid: true }, hot: 'pid', tone: 'bad', term: ['$ unshare --pid --fork sh -c \'echo "I am PID $$"; ps -e\'', 'I am PID 1', 'fatal library error, lookup self'], en: 'Trap 2: --fork but no --mount-proc. sh is PID 1, yet /proc is still the HOST\'s /proc, where there is no PID 1 belonging to us — ps cannot find itself: "fatal library error, lookup self".', vi: 'Bẫy 2: có --fork nhưng thiếu --mount-proc. sh là PID 1, nhưng /proc vẫn là /proc của MÁY CHỦ, nơi không có PID 1 nào của ta — ps không tìm thấy chính nó: "fatal library error, lookup self".' },
    { on: { ...allOff(), pid: true, mnt: true }, hot: 'mnt', tone: 'ok', term: ['$ unshare --pid --fork --mount-proc sh -c \'ps -ef\'', 'UID   PID  PPID CMD', 'root    1     0 sh -c ps -ef', 'root    2     1 ps -ef'], en: '--mount-proc = a mount namespace + a fresh /proc for the new PID namespace. Now ps sees exactly two processes. A container runtime does exactly this.', vi: '--mount-proc = một mount namespace + một /proc mới cho PID namespace mới. Giờ ps thấy đúng hai tiến trình. Runtime container làm đúng việc này.' },
    { on: { ...allOff(), pid: true, mnt: true, net: true }, hot: 'net', term: ['$ unshare --net sh -c \'ip -br link; curl -sS http://example.com\'', 'lo   DOWN   00:00:00:00:00:00 <LOOPBACK>', 'curl: (6) Could not resolve host: example.com', 'curl exit 6'], tone: 'warn', en: 'A brand-new network namespace has only a loopback that is DOWN — no cable, no route, no DNS: curl exits 6. Docker plugs a veth cable in for you.', vi: 'Một network namespace mới tinh chỉ có loopback đang DOWN — không cáp, không route, không DNS: curl thoát 6. Docker cắm sẵn một sợi cáp veth cho bạn.' },
    { on: { ...allOff(), pid: true, mnt: true, net: true, uts: true, ipc: true }, hot: 'ipc', term: ['$ unshare --uts --pid --mount --net --ipc --fork --mount-proc sh -c \'hostname box; sleep 300\' &', '$ nsenter -t 138 --uts --pid --mount --net sh -c \'hostname; echo pid $$\'', 'box', 'pid 4'], en: 'Five namespaces at once = a home-made container. nsenter -t PID joins them from outside — that is what `docker exec` does (and why its ps shows PPID 0).', vi: 'Năm namespace cùng lúc = một container tự chế. nsenter -t PID nhảy vào chúng từ bên ngoài — đó chính là việc `docker exec` làm (và vì thế ps của nó hiện PPID 0).' },
  ]),
  userns: build([
    { on: dockerDefault(), en: 'A default Docker container: everything isolated except the user namespace. Inside, uid 0 is the host\'s real uid 0.', vi: 'Container Docker mặc định: mọi thứ cách ly trừ user namespace. Bên trong, uid 0 chính là uid 0 thật của máy chủ.' },
    { on: { ...allOff(), user: true }, user: 'rootless', hot: 'user', term: ['$ runuser -u dev -- unshare --user --map-root-user sh -c \'id; cat /proc/self/uid_map\'', 'uid=0(root) gid=0(root) groups=0(root)', '         0       1001          1'], en: 'A USER namespace, made by an ordinary user (dev, uid 1001): uid_map "0 1001 1" means "uid 0 in here = uid 1001 out there". Inside you are root.', vi: 'Một USER namespace do người dùng thường (dev, uid 1001) tạo: uid_map "0 1001 1" nghĩa là "uid 0 trong này = uid 1001 ngoài kia". Bên trong bạn là root.' },
    { on: { ...allOff(), user: true }, user: 'rootless', hot: 'user', tone: 'warn', term: ['$ … grep -E "^Cap(Eff|Bnd)" /proc/self/status', 'CapEff:\t000001ffffffffff', '$ … touch /etc/hacked', "touch: cannot touch '/etc/hacked': Permission denied"], en: 'All capabilities (CapEff 000001ffffffffff) — but only over things this user namespace OWNS. /etc belongs to the real root, so the kernel checks the real uid 1001: Permission denied. This is how rootless containers are safe.', vi: 'Đủ mọi capability (CapEff 000001ffffffffff) — nhưng chỉ với thứ user namespace này SỞ HỮU. /etc thuộc root thật, nên nhân kiểm uid thật 1001: Permission denied. Đây là lý do container rootless an toàn.' },
    { on: { ...allOff(), user: true }, user: 'remap', hot: 'user', term: ['$ unshare --user --map-users=0:100000:65536 --map-groups=0:100000:65536 sh -c \'cat /proc/self/uid_map; id\'', '         0     100000      65536', 'uid=65534(nobody) gid=65534(nogroup)'], en: 'userns-remap style: 65 536 ids starting at 100000 on the host. Inside uid 0 = host 100000; and host files owned by real root (uid 0, not in the map) show up as "nobody".', vi: 'Kiểu userns-remap: 65 536 id bắt đầu từ 100000 trên máy chủ. Bên trong uid 0 = 100000 bên ngoài; còn tệp của root thật (uid 0, không nằm trong bảng) hiện thành "nobody".' },
  ]),
  pod: build([
    { on: dockerDefault(), pod: { net: true, ipc: true, uts: true, pid: false }, en: 'A Kubernetes pod: a tiny "pause" container owns the namespaces; app and sidecar JOIN them. By default they share net, ipc and uts.', vi: 'Một pod Kubernetes: container "pause" tí hon giữ các namespace; app và sidecar GIA NHẬP vào đó. Mặc định chúng dùng chung net, ipc và uts.' },
    { on: dockerDefault(), pod: { net: false, ipc: true, uts: true, pid: false }, tone: 'bad', en: 'Without a shared net namespace, 127.0.0.1 in the sidecar is its own loopback: connection refused — and a restarted app would get a new IP.', vi: 'Không dùng chung net namespace thì 127.0.0.1 trong sidecar là loopback riêng của nó: connection refused — và app khởi động lại sẽ nhận IP mới.' },
    { on: dockerDefault(), pod: { net: true, ipc: true, uts: true, pid: true }, tone: 'ok', en: 'shareProcessNamespace: true — one PID namespace for the pod. ps in the app shows pause as PID 1 and python as 7, exactly like the lab.', vi: 'shareProcessNamespace: true — một PID namespace cho cả pod. ps trong app thấy pause là PID 1 và python là 7, đúng như lab.' },
  ]),
};

// ───────────────────────── pod ─────────────────────────
export type PodShare = Record<'net' | 'ipc' | 'uts' | 'pid', boolean>;
export const POD_DEFAULT: PodShare = { net: true, ipc: true, uts: true, pid: false };

export interface PodView {
  curl: { ok: boolean; out: string };
  ps: string[];
  hostname: string;
  ipc: string;
  bothListen: { ok: boolean; out: string };
  ipAfterRestart: string;
}

/** Kết cục trong pod theo các namespace dùng chung (c127-host: pause + app chung net/pid/ipc). */
export function podView(sh: PodShare): PodView {
  return {
    curl: sh.net ? { ok: true, out: '$ wget -qO- http://127.0.0.1:8000/\n<!DOCTYPE HTML>\n<html lang="en">' } : { ok: false, out: '$ wget -qO- http://127.0.0.1:8000/\nwget: can\'t connect to remote host (127.0.0.1): Connection refused' },
    ps: sh.pid ? ['  PID COMMAND', '    1 /pause            (sleep 3600 in the lab)', '    7 python3 -m http.server 8000', '   21 envoy (sidecar)', '   14 ps -eo pid,args'] : ['  PID COMMAND', '    1 python3 -m http.server 8000', '    9 ps -eo pid,args'],
    hostname: sh.uts ? 'pod-a (shared)' : 'app: 3f1c9e… / sidecar: 7d02ab… (each its own)',
    ipc: sh.ipc ? 'shared: a SysV queue made by app is visible to the sidecar' : 'separate queues',
    bothListen: sh.net ? { ok: false, out: 'sidecar: bind 0.0.0.0:8000: EADDRINUSE (Address already in use)' } : { ok: true, out: 'both listen on :8000 — two separate network stacks' },
    ipAfterRestart: sh.net ? '10.244.1.17 → 10.244.1.17 (pause still holds the netns)' : '10.244.1.17 → 10.244.1.23 (a new netns, a new IP)',
  };
}
