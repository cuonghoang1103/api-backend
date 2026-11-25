package com.thuvien.e2e;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.ImageFromDockerfile;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;
import org.testcontainers.utility.MountableFile;

import java.net.CookieManager;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Test hộp đen: MySQL 8.0 nạp đúng dump của dự án + ứng dụng dựng từ chính Dockerfile của repo,
 * hai container chung một mạng riêng; test nói chuyện bằng HTTP như trình duyệt.
 */
@Testcontainers
class MuonSachQuaHttpTest {

    static final Path GOC = Path.of("..").toAbsolutePath().normalize();
    static final Network MANG = Network.newNetwork();

    @Container
    static final MySQLContainer DB = new MySQLContainer("mysql:8.0")
            .withNetwork(MANG).withNetworkAliases("db")
            .withDatabaseName("thuvien").withUsername("root").withPassword("123456")
            .withEnv("MYSQL_ROOT_HOST", "%")
            .withCopyFileToContainer(MountableFile.forHostPath(GOC.resolve("db/thuvien.sql")), "/docker-entrypoint-initdb.d/01-thuvien.sql");

    @Container
    static final GenericContainer<?> WEB = new GenericContainer<>(
            new ImageFromDockerfile("thuvien-e2e", false)
                    .withFileFromPath("Dockerfile", GOC.resolve("Dockerfile"))
                    .withFileFromPath("pom.xml", GOC.resolve("pom.xml"))
                    .withFileFromPath("src", GOC.resolve("src")))
            .withNetwork(MANG).dependsOn(DB)
            .withEnv("DB_URL", "jdbc:mysql://db:3306/thuvien?useUnicode=true&characterEncoding=UTF-8&useSSL=false&allowPublicKeyRetrieval=true")
            .withExposedPorts(8080)
            .waitingFor(Wait.forHttp("/thuvien/login").forStatusCode(200).withStartupTimeout(Duration.ofMinutes(3)));

    HttpClient http;

    String url(String duong) {
        return "http://" + WEB.getHost() + ":" + WEB.getMappedPort(8080) + "/thuvien/" + duong;
    }

    HttpResponse<String> post(String duong, String form) throws Exception {
        return http.send(HttpRequest.newBuilder(URI.create(url(duong)))
                .header("Content-Type", "application/x-www-form-urlencoded")   // như trình duyệt: KHÔNG kèm charset
                .POST(HttpRequest.BodyPublishers.ofString(form)).build(), HttpResponse.BodyHandlers.ofString());
    }

    HttpResponse<String> get(String duong) throws Exception {
        return http.send(HttpRequest.newBuilder(URI.create(url(duong))).build(), HttpResponse.BodyHandlers.ofString());
    }

    int so(String sql) throws Exception {
        try (Connection c = DriverManager.getConnection(DB.getJdbcUrl(), "root", "123456");
             ResultSet rs = c.createStatement().executeQuery(sql)) {
            rs.next();
            return rs.getInt(1);
        }
    }

    String chu(String sql) throws Exception {
        try (Connection c = DriverManager.getConnection(DB.getJdbcUrl() + "?characterEncoding=UTF-8", "root", "123456");
             ResultSet rs = c.createStatement().executeQuery(sql)) {
            rs.next();
            return rs.getString(1);
        }
    }

    @BeforeEach
    void dangNhap() throws Exception {
        http = HttpClient.newBuilder().cookieHandler(new CookieManager()).build();   // không tự theo redirect
        assertEquals(302, post("login", "username=thuthu&password=123456").statusCode());
    }

    @Test
    void muonSach_302_phieuMoi_triggerTruSoSach() throws Exception {
        int truoc = so("SELECT available FROM books WHERE id = 4");
        HttpResponse<String> r = post("books", "action=borrow&bookId=4&readerId=5");
        assertEquals(302, r.statusCode());
        assertEquals("books?msg=Mượn thành công", URLDecoder.decode(r.headers().firstValue("Location").get(), StandardCharsets.UTF_8));
        assertEquals(truoc - 1, so("SELECT available FROM books WHERE id = 4"));
    }

    @Test
    void themSachTenTiengViet_luuDungDau() throws Exception {
        String ten = "Đọc hiểu mã nguồn cũ";
        post("books", "action=add&code=E2E01&title=" + URLEncoder.encode(ten, StandardCharsets.UTF_8) + "&author=Test&quantity=1");
        assertEquals(ten, chu("SELECT title FROM books WHERE code = 'E2E01'"));
    }

    @Test
    void moThangJsp_khongCanDangNhap() throws Exception {
        http = HttpClient.newHttpClient();                   // khách lạ, không cookie
        HttpResponse<String> sach = get("books.jsp");
        assertEquals(500, sach.statusCode());                // rủi ro trong bản đồ chương 2:
        assertTrue(sach.body().contains("JasperException"));  // error.jsp in stack trace + mã nguồn JSP
        assertEquals(200, get("report.jsp").statusCode());   // report.jsp hiện được cho người lạ
    }
}
