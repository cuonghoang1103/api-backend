// @thoi-gian
// How deep can recursion go before Java throws StackOverflowError? Each run happens in a NEW thread whose stack
// size we choose (Thread(group, task, name, stackSize)), so the -Xss flag of the runner does not matter.
public class DoSauStack {
    static class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

    // #region de-quy
    static int deepest;
    static int height(TreeNode node, int depth) {
        if (depth > deepest) deepest = depth;     // instrumentation only
        if (node == null) return 0;
        return 1 + Math.max(height(node.left, depth + 1), height(node.right, depth + 1));
    }
    // #endregion

    static String attempt(TreeNode root, long stackBytes) throws InterruptedException {
        deepest = 0;
        String[] res = {""};
        Thread t = new Thread(null, () -> {
            try { res[0] = "ok, height = " + height(root, 0); }
            catch (StackOverflowError e) { res[0] = String.format("StackOverflowError at depth %,d", deepest); }
        }, "probe", stackBytes);
        t.start();
        t.join();
        return res[0];
    }

    static int heightIter(TreeNode root) {
        int levels = 0;
        java.util.ArrayList<TreeNode> level = new java.util.ArrayList<>();
        if (root != null) level.add(root);
        while (!level.isEmpty()) {
            levels++;
            java.util.ArrayList<TreeNode> next = new java.util.ArrayList<>();
            for (TreeNode n : level) { if (n.left != null) next.add(n.left); if (n.right != null) next.add(n.right); }
            level = next;
        }
        return levels;
    }

    public static void main(String[] args) throws Exception {
        int n = 1_000_000;
        TreeNode root = new TreeNode(0), cur = root;
        for (int i = 1; i < n; i++) { cur.right = new TreeNode(i); cur = cur.right; }
        System.out.printf("chain of %,d nodes%n", n);
        System.out.println("2048 KB stack, 1st call (cold) : " + attempt(root, 2048L << 10));
        TreeNode shortChain = new TreeNode(0); cur = shortChain;
        for (int i = 1; i < 2000; i++) { cur.right = new TreeNode(i); cur = cur.right; }
        for (int k = 0; k < 20000; k++) height(shortChain, 0);            // warm-up: let the JIT compile height()
        for (long kb : new long[]{512, 1024, 2048, 8192, 65536})
            System.out.printf("%5d KB stack, after warm-up : %s%n", kb, attempt(root, kb << 10));
        double best = Double.MAX_VALUE; int h = 0;
        for (int k = 0; k < 5; k++) { long t = System.nanoTime(); h = heightIter(root); best = Math.min(best, (System.nanoTime() - t) / 1e6); }
        System.out.printf("iterative height: %,d in %.1f ms%n", h, best);
        System.out.println("java " + System.getProperty("java.version") + " · " + System.getProperty("os.arch"));
    }
}
