import java.util.*;

public class BrowserHistory {
    // #region giai
    private final Deque<String> back = new ArrayDeque<>();
    private final Deque<String> fwd = new ArrayDeque<>();
    private String cur;

    BrowserHistory(String homepage) { cur = homepage; }

    void visit(String url) { back.push(cur); cur = url; fwd.clear(); }

    String goBack(int steps) {
        while (steps-- > 0 && !back.isEmpty()) { fwd.push(cur); cur = back.pop(); }
        return cur;
    }
    String goForward(int steps) {
        while (steps-- > 0 && !fwd.isEmpty()) { back.push(cur); cur = fwd.pop(); }
        return cur;
    }
    // #endregion

    public static void main(String[] args) {
        BrowserHistory b = new BrowserHistory("cuongthai.com");
        b.visit("/courses");
        b.visit("/courses/dsa-interview");
        b.visit("/algorithms");
        System.out.println("back(1) = " + b.goBack(1));
        System.out.println("back(1) = " + b.goBack(1));
        System.out.println("forward(1) = " + b.goForward(1));
        b.visit("/roadmap");
        System.out.println("forward(2) = " + b.goForward(2) + " (forward history was cleared by visit)");
        System.out.println("back(7) = " + b.goBack(7) + " (stops at the first page)");
    }
}
