// Spawn.java — Java tạo tiến trình con bằng ProcessBuilder (bên dưới: fork/posix_spawn + exec)
public class Spawn {
    public static void main(String[] args) throws Exception {
        System.out.println("java pid = " + ProcessHandle.current().pid());
        Process p = new ProcessBuilder("sh", "-c", "echo child pid=$$ ppid=$PPID").inheritIO().start();
        System.out.println("exit code = " + p.waitFor());
    }
}
