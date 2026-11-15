// @bo-qua
import org.junit.platform.launcher.*;
import org.junit.platform.launcher.core.*;
import org.junit.platform.engine.TestExecutionResult;
import java.util.*;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;

// A 30-line JUnit console: discovers CuaSoTest, runs it, prints one stable line per test (in source order).
// IDEs (IntelliJ, Eclipse) and Maven/Gradle do exactly this for you; here it is spelled out so it runs anywhere.
public class JUnitChay {
    public static void main(String[] args) throws Exception {
        Map<String, String> ketQua = new TreeMap<>();
        TestExecutionListener nghe = new TestExecutionListener() {
            @Override public void executionFinished(TestIdentifier id, TestExecutionResult r) {
                if (!id.isTest()) return;
                String dong = r.getStatus() == TestExecutionResult.Status.SUCCESSFUL
                    ? "  PASS  " + id.getDisplayName()
                    : "  FAIL  " + id.getDisplayName() + "  ->  " + r.getThrowable().map(Throwable::getMessage).orElse("");
                ketQua.put(thuTu(id.getDisplayName()), dong);
            }
        };
        LauncherDiscoveryRequest req = LauncherDiscoveryRequestBuilder.request()
            .selectors(selectClass(Class.forName("CuaSoTest"))).build();
        Launcher launcher = LauncherFactory.create();
        launcher.execute(req, nghe);
        int fail = 0;
        for (String d : ketQua.values()) { System.out.println(d); if (d.startsWith("  FAIL")) fail++; }
        System.out.println(ketQua.size() + " tests, " + (ketQua.size() - fail) + " passed, " + fail + " failed");
    }
    // JUnit does not promise an order; sort by the order the tests are written in CuaSoTest.
    static final List<String> THU_TU = List.of("normal", "edge: the best", "edge: one", "edge: k = n", "edge: every", "edge: all equal");
    static String thuTu(String ten) {
        for (int i = 0; i < THU_TU.size(); i++) if (ten.startsWith(THU_TU.get(i))) return i + ten;
        return "9" + ten;
    }
}
