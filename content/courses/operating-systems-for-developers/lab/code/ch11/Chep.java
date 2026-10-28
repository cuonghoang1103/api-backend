import java.nio.file.*;

// Chep — Files.copy của Java dùng syscall nào để chép file?
public class Chep {
    public static void main(String[] args) throws Exception {
        Files.copy(Path.of(args[0]), Path.of(args[1]), StandardCopyOption.REPLACE_EXISTING);
    }
}
