public class CircularQueue {
    // #region giai
    private final int[] a;
    private int head = 0, size = 0;

    CircularQueue(int k) { a = new int[k]; }

    boolean enQueue(int x) {
        if (size == a.length) return false;
        a[(head + size) % a.length] = x;
        size++;
        return true;
    }
    boolean deQueue() {
        if (size == 0) return false;
        head = (head + 1) % a.length;
        size--;
        return true;
    }
    int Front() { return size == 0 ? -1 : a[head]; }
    int Rear() { return size == 0 ? -1 : a[(head + size - 1) % a.length]; }
    boolean isEmpty() { return size == 0; }
    boolean isFull() { return size == a.length; }
    // #endregion

    public static void main(String[] args) {
        CircularQueue q = new CircularQueue(3);
        System.out.println("enQueue 1,2,3,4 -> " + q.enQueue(1) + "," + q.enQueue(2) + "," + q.enQueue(3) + "," + q.enQueue(4));
        System.out.println("Rear=" + q.Rear() + " isFull=" + q.isFull());
        System.out.println("deQueue -> " + q.deQueue() + "  enQueue 4 -> " + q.enQueue(4) + "  Front=" + q.Front() + " Rear=" + q.Rear());
        System.out.println("deQueue x3 -> " + q.deQueue() + "," + q.deQueue() + "," + q.deQueue() + "  deQueue again -> " + q.deQueue() + "  isEmpty=" + q.isEmpty() + " Front=" + q.Front());
    }
}
