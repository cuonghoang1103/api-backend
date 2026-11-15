import java.util.*;

// The two classic backtracking bugs, run for real on subsets([1,2,3]).
public class BayThamChieu {
    // #region sai-tham-chieu
    static void wrongRef(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(path);                             // BUG: the same ArrayList object, every time
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            wrongRef(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    // #region quen-bo-chon
    static void noUndo(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            noUndo(nums, i + 1, path, res);
            // BUG: forgot path.remove(path.size() - 1)
        }
    }
    // #endregion

    // #region dung
    static void right(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));            // copy constructor = snapshot
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            right(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
    // #endregion

    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        List<List<Integer>> w = new ArrayList<>();
        wrongRef(a, 0, new ArrayList<>(), w);
        System.out.println("pushed path itself : " + w);
        System.out.println("  same object?       " + (w.get(0) == w.get(7)));
        List<List<Integer>> n = new ArrayList<>();
        noUndo(a, 0, new ArrayList<>(), n);
        System.out.println("forgot path.pop()  : " + n);
        List<List<Integer>> r = new ArrayList<>();
        right(a, 0, new ArrayList<>(), r);
        System.out.println("correct            : " + r);
    }
}
