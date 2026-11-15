public class BayDanhDau {
    static int[] bfs(int N, boolean markWhenEnqueued) {
        boolean[] seen = new boolean[N * N];
        int[] q = new int[4 * N * N + 1];
        int head = 0, tail = 0, visited = 0, maxQueue = 1;
        q[tail++] = 0;
        if (markWhenEnqueued) seen[0] = true;
        int[][] D = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (head < tail) {
            int cell = q[head++];
            if (!markWhenEnqueued) {
                if (seen[cell]) continue;
                seen[cell] = true;
            }
            visited++;
            int r = cell / N, c = cell % N;
            for (int[] d : D) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
                int nb = nr * N + nc;
                if (seen[nb]) continue;
                if (markWhenEnqueued) seen[nb] = true;
                q[tail++] = nb;
            }
            maxQueue = Math.max(maxQueue, tail - head);
        }
        return new int[]{visited, tail, maxQueue};
    }

    public static void main(String[] args) {
        for (int N : new int[]{10, 100, 1000}) {
            int[] a = bfs(N, true), b = bfs(N, false);
            System.out.println("N=" + N + ": mark on enqueue -> visited " + a[0] + ", enqueued " + a[1] + ", max queue " + a[2]
                + " | mark on dequeue -> visited " + b[0] + ", enqueued " + b[1] + ", max queue " + b[2]);
        }
    }
}
