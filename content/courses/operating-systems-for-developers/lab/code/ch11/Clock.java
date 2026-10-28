// Clock — một triệu lần System.nanoTime() + currentTimeMillis(): có lời gọi hệ thống nào không?
public class Clock {
    public static void main(String[] args) {
        long s = 0;
        for (int i = 0; i < 1_000_000; i++) s += System.nanoTime() + System.currentTimeMillis();
        System.out.println(s != 0);
    }
}
