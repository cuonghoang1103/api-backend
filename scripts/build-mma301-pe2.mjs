/**
 * build-mma301-pe2.mjs — sinh content/exams/MMA301-PE2.mjs.
 *
 * Nguồn thật: "MMA301 - SP 2025 - PE" (PE_MMA301_20250302) — app React
 * Native/Expo "Jewelry Shop" (Home/Favorite/Premiere, dữ liệu từ
 * MockAPI.io). Có 1 solution ĐẦY ĐỦ thật (Solution/ — dự án Expo hoàn
 * chỉnh) — đã đọc kỹ TỪNG file, đối chiếu với paper.pdf + data.json,
 * và bắt được HAI lỗi thật trong chính solution này (không copy mù):
 *
 * ⚠️ LỖI 1 (DetailsScreen): đề yêu cầu "jeName (add a color attribute
 * to the jeName title based on the jewelry's color, using the first
 * color if the jewelry has two colors)" — solution CHỈ hiện thẳng
 * `item.jeName`, KHÔNG hề thêm tiền tố màu vào tiêu đề. Đã tự viết lại
 * đúng: tiêu đề = `${item.color[0]} ${item.jeName}`.
 *
 * ⚠️ LỖI 2 (PremiereScreen, nghiêm trọng hơn): đề yêu cầu lọc "with a
 * shipping fee (shipped) exceeding 10% OF THE COST" — nghĩa là
 * shipped > cost*0.1 (tương đối theo TỪNG món). Solution lại so
 * `item.shipped > 0.1` (NGƯỠNG TUYỆT ĐỐI cố định 0.1, đọc nhầm "10%
 * of the cost" thành hằng số 0.1). Đã tự kiểm bằng data.json thật: 2/4
 * món thoả điều kiện màu+đá bị lọt SAI vào danh sách theo công thức
 * lỗi (id=3: shipped=8.2, cost=83.99, 8.2>8.399 SAI nhưng 8.2>0.1
 * ĐÚNG; id=6: shipped=22, cost=280, 22>28 SAI nhưng 22>0.1 ĐÚNG) —
 * xác nhận đây là lỗi thật, không phải tranh cãi cách đọc. Đã sửa
 * đúng thành `item.shipped > item.cost * 0.1`.
 *
 * ⚠️ Field đề gọi "isStone" nhưng seed thật (data.json) và chính
 * solution đều dùng "stoneStyle" — solution ĐÃ đọc đúng field thật ở
 * điểm này (không phải lỗi), chỉ là câu chữ đề không khớp seed.
 *
 * ⚠️ Tổng điểm đề CỘNG THỰC RA = 10.25, không phải 10 (Task1=0.75,
 * Task2=3.25, Task3=1.75, Task4=1.5, Task5=3.0) — lỗi cộng có sẵn
 * trong chính đề, giữ nguyên từng điểm thành phần đúng như đề in,
 * KHÔNG bịa giảm 1 câu nào xuống cho tròn 10.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MMA301-PE2.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/MMA301-PE2.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const appContext = B(
  `<div class="pe-system"><b>Jewelry data shape (from data.json, imported into a MockAPI.io resource named after your roll number):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  jeName: string,
  brand: string,
  material: string,
  color: string[],       // e.g. ["White"] or ["Silver", "Blue"]
  stoneStyle: boolean,   // NOTE: the real field is "stoneStyle", not "isStone"
  cost: number,          // USD-like decimal, convert to VND with *25000
  shipped: number,       // USD-like decimal (0 = free shipping), convert to VND with *25000
  percentOff: number,    // 0-1 fraction, e.g. 0.19 — display as a percentage (*100)
  image: string,
}</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu trang sức (từ data.json, nạp vào resource MockAPI.io đặt tên theo mã số sinh viên):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  jeName: string,
  brand: string,
  material: string,
  color: string[],       // VD ["White"] hoặc ["Silver", "Blue"]
  stoneStyle: boolean,   // LƯU Ý: field thật là "stoneStyle", không phải "isStone"
  cost: number,          // số thập phân kiểu USD, quy đổi VND bằng *25000
  shipped: number,       // số thập phân kiểu USD (0 = freeship), quy đổi VND bằng *25000
  percentOff: number,    // phân số 0-1, VD 0.19 — hiển thị dạng phần trăm (*100)
  image: string,
}</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>MMA301 – Practical Exam (Spring 2025) — Jewelry Shop app</strong>. Built with React Native + Expo, data fetched from a MockAPI.io resource, favorites stored locally with AsyncStorage. This exam room has no live Expo/device runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. Screens must be switchable back and forth quickly. StudentCode is the roll number (e.g. se171234). A score of 0 is given for a program with syntax/compilation errors, for code unrelated to the test, or for not fetching jewelry data from the data.json-sourced MockAPI resource.</p>` + appContext,
  `<p><strong>MMA301 – Thi thực hành (Spring 2025) — App Jewelry Shop</strong>. Xây bằng React Native + Expo, dữ liệu lấy từ resource MockAPI.io, favorite lưu cục bộ bằng AsyncStorage. Phòng thi này không có môi trường Expo/thiết bị sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Màn hình phải chuyển qua lại nhanh. StudentCode là mã số sinh viên (VD se171234). Điểm 0 nếu chương trình có lỗi cú pháp/biên dịch, có code không liên quan đến đề, hoặc không lấy dữ liệu trang sức từ resource MockAPI nạp từ data.json.</p>` + appContext,
);

const q1 = {
  kind: 'CODE', points: 0.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 1. Create a new React Native application.</strong></p><ul>` +
    `<li>(0.5 mark) Build a new React Native application named after your roll number (e.g., se171234). The app must include three bottom tabs. All screens should be switchable with a single touch.</li>` +
    `<li>(0.25 mark) On the MockAPI.io tool, create a resource named after your roll number to store the jewelry data.</li></ul>`,
    `<p><strong>Task 1. Tạo ứng dụng React Native mới.</strong></p><ul>` +
    `<li>(0.5 điểm) Tạo ứng dụng React Native mới đặt tên theo mã số sinh viên (VD se171234). App phải có 3 tab dưới. Mọi màn hình chuyển được chỉ với 1 lần chạm.</li>` +
    `<li>(0.25 điểm) Trên MockAPI.io, tạo 1 resource đặt tên theo mã số sinh viên để lưu dữ liệu trang sức.</li></ul>`,
  ),
  starterCode:
`// ===== .env =====
EXPO_PUBLIC_BASEURL=https://<your-mockapi-project-id>.mockapi.io

// ===== package.json (relevant excerpt) =====
{
  "name": "se171234",
  "dependencies": {
    "expo": "~52.0.40",
    "react": "18.3.1",
    "react-native": "0.76.7",
    "@react-navigation/native": "^7.0.18",
    "@react-navigation/bottom-tabs": "^7.3.2",
    "@react-navigation/stack": "^7.2.2",
    "@react-native-async-storage/async-storage": "^2.1.2",
    "axios": "^1.8.4",
    "react-native-toast-message": "^2.2.1"
  }
}

// ===== src/navigation/AppNavigation.js =====
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

export const AppNavigation = () => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};`,
  sampleSolution:
`// ===== .env =====
EXPO_PUBLIC_BASEURL=https://67df871b7635238f9aa9c9a0.mockapi.io

// ===== package.json (relevant excerpt) =====
{
  "name": "se171234",
  "dependencies": {
    "expo": "~52.0.40",
    "react": "18.3.1",
    "react-native": "0.76.7",
    "@react-navigation/native": "^7.0.18",
    "@react-navigation/bottom-tabs": "^7.3.2",
    "@react-navigation/stack": "^7.2.2",
    "@react-native-async-storage/async-storage": "^2.1.2",
    "axios": "^1.8.4",
    "react-native-toast-message": "^2.2.1"
  }
}

// ===== src/navigation/AppNavigation.js =====
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screen/HomeScreen";
import FavoriteScreen from "../screen/FavoriteScreen";
import PremiereScreen from "../screen/PremiereScreen";
import DetailsScreen from "../screen/DetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
    // ---------- Student's code starts from here ----------
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorite" component={FavoriteScreen} />
            <Tab.Screen name="Premiere" component={PremiereScreen} />
        </Tab.Navigator>
    );
    // -------------------------------------------------------
};

export const AppNavigation = () => {
    // ---------- Student's code starts from here ----------
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Jewelry Details" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    // -------------------------------------------------------
};`,
  explanation: B(
    `<p>"All screens should be switchable with a single touch" is satisfied for free by a properly configured <code>Tab.Navigator</code> with exactly three <code>Tab.Screen</code> entries — a bottom tab press always switches in one tap, so this line is really a check that the student used a real BOTTOM TAB navigator (not, say, buttons that push new stack screens for Home/Favorite/Premiere, which would still "work" but defeat the point of the requirement). The Detail screen deliberately lives OUTSIDE the tab navigator, in the wrapping <code>Stack.Navigator</code>, since Task 2.2/3/4/5 all require navigating INTO a detail view from any of the three tabs while keeping the tab bar itself out of that view.</p>`,
    `<p>"Mọi màn hình chuyển được chỉ với 1 lần chạm" tự động thoả nếu cấu hình đúng <code>Tab.Navigator</code> với đúng 3 <code>Tab.Screen</code> — bấm tab dưới luôn chuyển trong 1 chạm, nên dòng này thực ra kiểm sinh viên có dùng ĐÚNG bottom tab navigator hay không (không phải, VD, nút bấm push màn hình stack mới cho Home/Favorite/Premiere — vẫn "chạy được" nhưng sai tinh thần yêu cầu). Màn hình Detail cố ý nằm NGOÀI tab navigator, trong <code>Stack.Navigator</code> bọc ngoài, vì Task 2.2/3/4/5 đều cần điều hướng VÀO 1 view chi tiết từ bất kỳ tab nào trong khi vẫn giữ thanh tab NGOÀI view đó.</p>`,
  ),
  rubric: [
    { id: 'app_named_after_roll_number', criterion: B('The project/app is named after a roll-number-shaped student code.', 'Dự án/app đặt tên theo mã số sinh viên hợp lệ.'), weight: 1, maxScore: 0.15 },
    { id: 'three_bottom_tabs', criterion: B('The app uses a bottom tab navigator with exactly three tabs (Home, Favorite, Premiere).', 'App dùng bottom tab navigator với đúng 3 tab (Home, Favorite, Premiere).'), weight: 1, maxScore: 0.25 },
    { id: 'detail_screen_reachable_from_all_tabs', criterion: B('A Details screen exists and is reachable via navigation from within the tab screens (stack wrapping the tabs).', 'Có màn hình Details và điều hướng được từ trong các tab (stack bọc ngoài tab).'), weight: 1, maxScore: 0.1 },
    { id: 'mockapi_resource_named_after_roll_number', criterion: B('A MockAPI.io resource named after the roll number is set up to store jewelry data, referenced via an env-configured base URL.', 'Resource MockAPI.io đặt tên theo mã số SV được lập để lưu dữ liệu, tham chiếu qua base URL cấu hình bằng env.'), weight: 1, maxScore: 0.25 },
  ],
};

const q2 = {
  kind: 'CODE', points: 3.25, language: 'javascript',
  prompt: B(
    `<p><strong>Task 2. Implement some actions on the Home screen.</strong></p><ul>` +
    `<li>(2.0 marks) Build the Home screen where jewelry can be filtered by pressing on a brand. The data includes: jeName, image, and percentOff (shown as a percentage, not the decimal value). The percentOff value must stand out on this screen. The jewelry list must be fetched from the MockAPI tool, filtered by brand, and displayed in descending order by percentOff. Use Bottom Tabs to switch between 3 screens: Home, Favorite, and Premiere. Design and arrange this component as well as possible.</li>` +
    `<li>(0.25 mark) On the Home screen, tapping the jewelry's image or the title of jeName switches you to the Detail screen.</li>` +
    `<li>(1.0 mark) On the Home screen, implement the favorite list using AsyncStorage. Pressing the favorite icon on the jewelry view adds the jewelry to the favorite list.</li></ul>`,
    `<p><strong>Task 2. Triển khai hành động ở màn hình Home.</strong></p><ul>` +
    `<li>(2.0 điểm) Dựng màn hình Home cho phép lọc trang sức bằng cách bấm vào 1 brand. Dữ liệu gồm: jeName, image, và percentOff (hiện dạng %, không phải số thập phân). Giá trị percentOff phải NỔI BẬT trên màn hình. Danh sách phải lấy từ MockAPI, lọc theo brand, sắp xếp giảm dần theo percentOff. Dùng Bottom Tabs chuyển giữa 3 màn hình: Home, Favorite, Premiere. Thiết kế/bố trí component này tốt nhất có thể.</li>` +
    `<li>(0.25 điểm) Ở Home, chạm vào ảnh trang sức hoặc tiêu đề jeName chuyển sang màn hình Detail.</li>` +
    `<li>(1.0 điểm) Ở Home, triển khai danh sách favorite bằng AsyncStorage. Bấm icon favorite trên view trang sức thêm trang sức đó vào danh sách favorite.</li></ul>`,
  ),
  starterCode:
`// ===== src/utils/asyncStorage.js =====
import AsyncStorage from "@react-native-async-storage/async-storage";
const FAVORITES_KEY = "@favorites";

export const getFavorites = async () => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

export const saveFavorites = async (list) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

// ===== src/screen/HomeScreen.js =====
import { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet } from "react-native";
import { ProductAPI } from "../api/ProductAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

const HomeScreen = () => {
    const [jewelry, setJewelry] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by percentOff ----------

        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply brand filter ----------

        // -------------------------------------------------------
    }, [selectedBrand, jewelry]);

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);
    const brands = [...new Set(jewelry.map((j) => j.brand))];

    return (
        <SafeAreaView style={styles.container}>
            <CategoryFilter data={brands} selected={selectedBrand} onSelect={setSelectedBrand} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProductCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#121212" } });
export default HomeScreen;

// ===== src/components/ProductCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProductCard = ({ item, favorite, onChangeFavList }) => {
    const nav = useNavigation();

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => {
                    // ---------- Student's code starts from here ----------

                    // -------------------------------------------------------
                }}
                style={styles.content}
            >
                <Image source={{ uri: item.image }} style={styles.img} />
                <Text style={styles.name}>{item.jeName}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {/* ---------- Student's code starts from here: percentOff as % ---------- */}
                        {/* ------------------------------------------------------- */}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onChangeFavList} style={styles.fav}>
                <FontAwesome name={favorite ? "heart" : "heart-o"} size={22} color={favorite ? "#f06292" : "#ccc"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { width: 170, margin: 10, backgroundColor: "#fff", borderRadius: 16, padding: 10 },
    content: { alignItems: "center" },
    img: { width: 120, height: 120, borderRadius: 10, marginBottom: 8 },
    name: { fontSize: 13, fontWeight: "500", textAlign: "center" },
    badge: { backgroundColor: "#ffeef1", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginTop: 6 },
    badgeText: { fontSize: 12, color: "#e91e63", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default ProductCard;`,
  sampleSolution:
`// ===== src/utils/asyncStorage.js =====
import AsyncStorage from "@react-native-async-storage/async-storage";
const FAVORITES_KEY = "@favorites";

export const getFavorites = async () => {
    // ---------- Student's code starts from here ----------
    try {
        const json = await AsyncStorage.getItem(FAVORITES_KEY);
        if (!json) return [];
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
    // -------------------------------------------------------
};

export const saveFavorites = async (list) => {
    // ---------- Student's code starts from here ----------
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    // -------------------------------------------------------
};

// ===== src/screen/HomeScreen.js =====
import { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, StyleSheet } from "react-native";
import { ProductAPI } from "../api/ProductAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

const HomeScreen = () => {
    const [jewelry, setJewelry] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by percentOff ----------
        (async () => {
            const api = new ProductAPI();
            const data = await api.getAllJewelry();
            const sorted = [...data].sort((a, b) => b.percentOff - a.percentOff);
            setJewelry(sorted);
        })();
        (async () => {
            const stored = await getFavorites();
            setFavorites(stored);
        })();
        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply brand filter ----------
        if (!selectedBrand) {
            setFiltered(jewelry);
        } else {
            setFiltered(jewelry.filter((item) => item.brand === selectedBrand));
        }
        // -------------------------------------------------------
    }, [selectedBrand, jewelry]);

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------
        const exists = favorites.some((f) => f.id === item.id);
        const updated = exists
            ? favorites.filter((f) => f.id !== item.id)
            : [...favorites, item];
        setFavorites(updated);
        await saveFavorites(updated);
        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);
    const brands = [...new Set(jewelry.map((j) => j.brand))];

    return (
        <SafeAreaView style={styles.container}>
            <CategoryFilter data={brands} selected={selectedBrand} onSelect={setSelectedBrand} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProductCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#121212" } });
export default HomeScreen;

// ===== src/components/ProductCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProductCard = ({ item, favorite, onChangeFavList }) => {
    const nav = useNavigation();

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => {
                    // ---------- Student's code starts from here ----------
                    nav.navigate("Details", { item });
                    // -------------------------------------------------------
                }}
                style={styles.content}
            >
                <Image source={{ uri: item.image }} style={styles.img} />
                <Text style={styles.name}>{item.jeName}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {/* ---------- Student's code starts from here: percentOff as % ---------- */}
                        -{(item.percentOff * 100).toFixed(0)}%
                        {/* ------------------------------------------------------- */}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onChangeFavList} style={styles.fav}>
                <FontAwesome name={favorite ? "heart" : "heart-o"} size={22} color={favorite ? "#f06292" : "#ccc"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { width: 170, margin: 10, backgroundColor: "#fff", borderRadius: 16, padding: 10 },
    content: { alignItems: "center" },
    img: { width: 120, height: 120, borderRadius: 10, marginBottom: 8 },
    name: { fontSize: 13, fontWeight: "500", textAlign: "center" },
    badge: { backgroundColor: "#ffeef1", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginTop: 6 },
    badgeText: { fontSize: 12, color: "#e91e63", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default ProductCard;`,
  explanation: B(
    `<p><code>ProductCard</code> is shared across Home/Favorite/Premiere (Question 4 and 5 reuse it verbatim), so wiring its tap-to-navigate and percentOff-as-percentage logic HERE means every other screen that renders a <code>ProductCard</code> automatically gets correct navigation and a correctly formatted discount badge — this is why the paper's identical "tapping the image or jeName title navigates to Details" line appears again in Task 4/5 without needing new code there. <code>toggleFavorite</code> is symmetric (adds if absent, removes if present) because the SAME component (and the same handler shape) is reused on Home and Premiere where a jewelry item's favorite status can go either way — it is only on the Favorite screen (Task 4) that the action is always a removal, which is why that screen's version differs (see Question 4).</p>`,
    `<p><code>ProductCard</code> dùng chung cho Home/Favorite/Premiere (Câu 4 và 5 tái dùng y nguyên), nên nối đúng logic chạm-để-điều-hướng và percentOff-thành-% Ở ĐÂY khiến mọi màn hình khác render <code>ProductCard</code> tự động có điều hướng đúng và badge giảm giá định dạng đúng — đây là lý do câu chữ y hệt "chạm ảnh hoặc tiêu đề jeName chuyển Detail" lặp lại ở Task 4/5 mà không cần code mới ở đó. <code>toggleFavorite</code> đối xứng (thêm nếu chưa có, xoá nếu đã có) vì CÙNG component (và cùng dạng handler) dùng lại ở Home và Premiere, nơi trạng thái favorite của 1 món có thể đi cả 2 chiều — chỉ ở màn hình Favorite (Task 4) hành động luôn là xoá, đó là lý do phiên bản màn hình đó khác (xem Câu 4).</p>`,
  ),
  rubric: [
    { id: 'fetches_sorts_filters_correctly', criterion: B('Jewelry is fetched from the MockAPI resource, correctly filtered by the selected brand, and sorted in descending order by percentOff.', 'Trang sức lấy từ resource MockAPI, lọc đúng theo brand đã chọn, sắp xếp giảm dần theo percentOff.'), weight: 1, maxScore: 1 },
    { id: 'percentoff_displayed_as_percentage_prominently', criterion: B('percentOff is displayed as a percentage (not the raw 0-1 decimal) and visually stands out on the card.', 'percentOff hiện dạng % (không phải số thập phân 0-1 thô) và nổi bật trên card.'), weight: 1, maxScore: 0.6 },
    { id: 'shows_jename_and_image', criterion: B('Each item shows at least jeName and image.', 'Mỗi item hiện ít nhất jeName và image.'), weight: 1, maxScore: 0.3 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or the jeName title navigates to the Detail screen for that item.', 'Chạm ảnh hoặc tiêu đề jeName điều hướng sang màn hình Detail đúng item.'), weight: 1, maxScore: 0.5 },
    { id: 'favorite_toggle_persists_to_asyncstorage', criterion: B('Pressing the favorite icon correctly adds/removes the item from an AsyncStorage-backed favorite list.', 'Bấm icon favorite thêm/xoá đúng item khỏi danh sách favorite lưu qua AsyncStorage.'), weight: 1, maxScore: 0.85 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 3. Implement some actions at the Detail screen (1.75 marks).</strong></p>` +
    `<p>Show all the jewelry's information: jeName (add a color attribute to the jeName title based on the jewelry's color, using the first color if the jewelry has two colors), percentOff (displayed as a percentage), image, shipped (show "Freeship" if shipped is 0, or convert it to VND using the formula shipped * 25,000, e.g. 130,725 VND), cost (convert to VND using the formula cost * 25,000, e.g. 130,725 VND), price (convert to VND using the formula (cost + shipped)*25,000, e.g. 130,725 VND), material, brand, and isStone (display as a star icon for a true value). Additionally, display the favorite state and let the user change it for this jewelry (add or remove it from the Favorite list). Design and arrange this component as neatly and efficiently as possible.</p>`,
    `<p><strong>Task 3. Triển khai hành động ở màn hình Detail (1.75 điểm).</strong></p>` +
    `<p>Hiện đầy đủ thông tin trang sức: jeName (thêm thuộc tính màu vào tiêu đề jeName dựa theo màu trang sức, dùng màu ĐẦU TIÊN nếu có 2 màu), percentOff (hiện dạng %), image, shipped (hiện "Freeship" nếu shipped=0, hoặc quy đổi VND bằng công thức shipped*25.000, VD 130.725 VND), cost (quy đổi VND bằng cost*25.000, VD 130.725 VND), price (quy đổi VND bằng (cost+shipped)*25.000, VD 130.725 VND), material, brand, và isStone (hiện icon sao nếu true). Ngoài ra, hiện trạng thái favorite và cho người dùng đổi nó cho trang sức này (thêm/xoá khỏi danh sách Favorite). Thiết kế/bố trí component này gọn gàng và hiệu quả nhất có thể.</p>`,
  ),
  starterCode:
`// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    }, [item.id]);

    const toggleFavorite = async () => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    const titleWithColor = item.jeName; // ---------- Student's code: prefix with item.color[0] ----------
    const shippedDisplay = ""; // ---------- Student's code: Freeship if 0, else VND ----------
    const costDisplay = ""; // ---------- Student's code: cost*25000 VND ----------
    const priceDisplay = ""; // ---------- Student's code: (cost+shipped)*25000 VND ----------

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{titleWithColor}</Text>
                <Text>Brand: {item.brand}</Text>
                <Text>Material: {item.material}</Text>
                <Text>Discount: {(item.percentOff * 100).toFixed(2)}%</Text>
                <Text>Has Stone: {/* ---------- Student's code: star if stoneStyle ---------- */}</Text>
                <Text>Shipped: {shippedDisplay}</Text>
                <Text>Cost: {costDisplay}</Text>
                <Text>Total Price: {priceDisplay}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    image: { width: "100%", height: 300, resizeMode: "cover" },
    heart: { position: "absolute", top: 16, right: 16 },
    infoBox: { padding: 16 },
    name: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
});

export default DetailsScreen;`,
  sampleSolution:
`// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // ---------- Student's code starts from here ----------
        (async () => {
            const stored = await getFavorites();
            setIsFavorite(stored.some((j) => j.id === item.id));
        })();
        // -------------------------------------------------------
    }, [item.id]);

    const toggleFavorite = async () => {
        // ---------- Student's code starts from here ----------
        const stored = await getFavorites();
        const updated = isFavorite
            ? stored.filter((j) => j.id !== item.id)
            : [...stored, item];
        await saveFavorites(updated);
        setIsFavorite(!isFavorite);
        // -------------------------------------------------------
    };

    // "add a color attribute to the jeName title... using the first color if the jewelry has two colors"
    const titleWithColor = \`\${item.color[0]} \${item.jeName}\`;
    const shippedDisplay = item.shipped === 0
        ? "Freeship"
        : \`\${(item.shipped * 25000).toLocaleString()} VND\`;
    const costDisplay = \`\${(item.cost * 25000).toLocaleString()} VND\`;
    const priceDisplay = \`\${((item.cost + item.shipped) * 25000).toLocaleString()} VND\`;

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{titleWithColor}</Text>
                <Text>Brand: {item.brand}</Text>
                <Text>Material: {item.material}</Text>
                <Text>Discount: {(item.percentOff * 100).toFixed(2)}%</Text>
                <Text>Has Stone: {/* ---------- Student's code: star if stoneStyle ---------- */}{item.stoneStyle ? "⭐" : "No"}</Text>
                <Text>Shipped: {shippedDisplay}</Text>
                <Text>Cost: {costDisplay}</Text>
                <Text>Total Price: {priceDisplay}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    image: { width: "100%", height: 300, resizeMode: "cover" },
    heart: { position: "absolute", top: 16, right: 16 },
    infoBox: { padding: 16 },
    name: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
});

export default DetailsScreen;`,
  explanation: B(
    `<p><b>The field is really named <code>stoneStyle</code>, not "isStone"</b> as the paper's own wording calls it — <code>data.json</code> and every screen must read <code>item.stoneStyle</code>. <b>"add a color attribute to the jeName title"</b> means the color becomes part of the rendered title string itself (<code>\`\${item.color[0]} \${item.jeName}\`</code>), not merely shown elsewhere on the screen as a separate "Color:" row — a jewelry item with <code>color: ["Silver","Blue"]</code> must show its title as "Silver Ladies Sterling Silver Sparkling Pave Bars Bracelet", using ONLY the first color even when two are present, exactly as the paper specifies. All three VND conversions reuse the identical <code>*25000</code> rate, and <code>price</code> is deliberately computed from <code>(cost+shipped)</code> BEFORE multiplying by 25000 (not by adding the already-converted <code>costDisplay</code>/<code>shippedDisplay</code> strings) — the paper's own worked example (130,725 VND for one field) is small enough that isolated rounding wouldn't be visibly wrong, but computing from raw USD-ish values first is the only version that stays correct for every other row in the dataset.</p>`,
    `<p><b>Field thật tên là <code>stoneStyle</code>, không phải "isStone"</b> như câu chữ đề gọi — <code>data.json</code> và mọi màn hình phải đọc <code>item.stoneStyle</code>. <b>"thêm thuộc tính màu vào tiêu đề jeName"</b> nghĩa là màu trở thành 1 phần của CHUỖI TIÊU ĐỀ render ra (<code>\`\${item.color[0]} \${item.jeName}\`</code>), không phải chỉ hiện ở chỗ khác trên màn hình dưới dạng dòng "Color:" riêng — 1 trang sức có <code>color: ["Silver","Blue"]</code> phải hiện tiêu đề "Silver Ladies Sterling Silver Sparkling Pave Bars Bracelet", CHỈ dùng màu đầu tiên dù có 2 màu, đúng như đề ghi rõ. Cả 3 phép quy đổi VND dùng CHUNG hệ số <code>*25000</code>, và <code>price</code> cố ý tính từ <code>(cost+shipped)</code> TRƯỚC rồi mới nhân 25000 (không phải cộng 2 chuỗi <code>costDisplay</code>/<code>shippedDisplay</code> đã quy đổi sẵn) — ví dụ mẫu của đề (130.725 VND cho 1 field) nhỏ tới mức sai số làm tròn riêng lẻ không lộ rõ, nhưng tính từ giá trị USD thô trước là cách duy nhất còn đúng cho mọi dòng khác trong dữ liệu.</p>`,
  ),
  rubric: [
    { id: 'title_prefixed_with_first_color', criterion: B('The jeName title on this screen is prefixed with the jewelry\'s first color (not a separate unrelated "Color:" row substituting for this requirement).', 'Tiêu đề jeName ở màn hình này có tiền tố màu ĐẦU TIÊN của trang sức (không phải chỉ 1 dòng "Color:" riêng thay cho yêu cầu này).'), weight: 1, maxScore: 0.4 },
    { id: 'percentoff_and_stone_display', criterion: B('percentOff is shown as a percentage, and stoneStyle is shown as a star icon when true.', 'percentOff hiện dạng %, và stoneStyle hiện icon sao khi true.'), weight: 1, maxScore: 0.3 },
    { id: 'shipped_cost_price_vnd_formulas', criterion: B('shipped shows "Freeship" when 0 else the correct shipped*25000 VND value; cost and price use the correct *25000 and (cost+shipped)*25000 formulas respectively.', 'shipped hiện "Freeship" khi bằng 0, còn lại đúng shipped*25000 VND; cost và price dùng đúng công thức *25000 và (cost+shipped)*25000.'), weight: 1, maxScore: 0.6 },
    { id: 'material_and_brand_shown', criterion: B('material and brand are both displayed.', 'material và brand đều được hiển thị.'), weight: 1, maxScore: 0.15 },
    { id: 'favorite_state_shown_and_toggleable', criterion: B('The current favorite state for this specific jewelry item is shown and can be toggled, persisting to AsyncStorage.', 'Trạng thái favorite của đúng trang sức này được hiện và đổi được, lưu vào AsyncStorage.'), weight: 1, maxScore: 0.3 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 4. Implement some actions at the Favorite screen.</strong></p><ul>` +
    `<li>(0.5 mark) The Favorite screen displays the list of jewelry stored in AsyncStorage.</li>` +
    `<li>(1.0 mark) The favorite state of each piece of jewelry or of all jewelry can be changed (e.g., remove a single jewelry item from the list or remove all) by confirming a notification. The screen updates the favorite list after the action is successfully completed. Tapping the jewelry's image or the title of the jewelry name (jeName) navigates to the Detail screen.</li></ul>`,
    `<p><strong>Task 4. Triển khai hành động ở màn hình Favorite.</strong></p><ul>` +
    `<li>(0.5 điểm) Màn hình Favorite hiện danh sách trang sức lưu trong AsyncStorage.</li>` +
    `<li>(1.0 điểm) Trạng thái favorite của 1 hoặc mọi trang sức có thể đổi (VD xoá 1 item khỏi danh sách hoặc xoá tất cả) bằng cách xác nhận 1 thông báo. Màn hình cập nhật danh sách favorite sau khi hành động hoàn tất. Chạm ảnh hoặc tiêu đề jeName chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/FavoriteScreen.js =====
import { useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ProductCard from "../components/ProductCard";

const FavoriteScreen = () => {
    const isFocused = useIsFocused();
    const [favorites, setFavorites] = useState([]);

    // ---------- Student's code starts from here: reload favorites whenever this screen gains focus ----------

    // -------------------------------------------------------

    const removeFavorite = (id) => {
        // ---------- Student's code starts from here: confirm, then remove + persist + update ----------

        // -------------------------------------------------------
    };

    const removeAll = () => {
        // ---------- Student's code starts from here: confirm, then clear + persist + update ----------

        // -------------------------------------------------------
    };

    if (favorites.length === 0) {
        return <View style={styles.empty}><Text>No favorite items</Text></View>;
    }

    return (
        <View style={styles.container}>
            {favorites.length > 1 && (
                <TouchableOpacity style={styles.removeAll} onPress={removeAll}>
                    <Text style={styles.removeAllText}>Remove All</Text>
                </TouchableOpacity>
            )}
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
    empty: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default FavoriteScreen;`,
  sampleSolution:
`// ===== src/screen/FavoriteScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ProductCard from "../components/ProductCard";

const FavoriteScreen = () => {
    const isFocused = useIsFocused();
    const [favorites, setFavorites] = useState([]);

    // ---------- Student's code starts from here: reload favorites whenever this screen gains focus ----------
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const stored = await getFavorites();
                setFavorites(stored);
            })();
        }, []),
    );
    // -------------------------------------------------------

    const removeFavorite = (id) => {
        // ---------- Student's code starts from here: confirm, then remove + persist + update ----------
        Alert.alert("Confirm", "Remove this item from favorites?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "OK",
                onPress: async () => {
                    const updated = favorites.filter((item) => item.id !== id);
                    await saveFavorites(updated);
                    setFavorites(updated);
                },
            },
        ]);
        // -------------------------------------------------------
    };

    const removeAll = () => {
        // ---------- Student's code starts from here: confirm, then clear + persist + update ----------
        Alert.alert("Confirm", "Remove all favorites?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "OK",
                onPress: async () => {
                    await saveFavorites([]);
                    setFavorites([]);
                },
            },
        ]);
        // -------------------------------------------------------
    };

    if (favorites.length === 0) {
        return <View style={styles.empty}><Text>No favorite items</Text></View>;
    }

    return (
        <View style={styles.container}>
            {favorites.length > 1 && (
                <TouchableOpacity style={styles.removeAll} onPress={removeAll}>
                    <Text style={styles.removeAllText}>Remove All</Text>
                </TouchableOpacity>
            )}
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
    empty: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default FavoriteScreen;`,
  explanation: B(
    `<p>On this screen every action is a REMOVAL (unlike Home/Premiere, where the same heart icon can mean add-or-remove) — so BOTH the single-item removal (<code>ProductCard</code>'s <code>onChangeFavList</code>, reused unchanged from Question 2/5) and "Remove All" are wrapped in an <code>Alert.alert</code> confirmation, matching the paper's "by confirming a notification" for this specific screen. <code>useFocusEffect</code> (not a mount-only <code>useEffect</code>) is required here for the same reason as MMA301 PE1's list screen: a favorite removed from the Detail screen must be reflected the next time this screen is focused, not only on first navigation to it.</p>`,
    `<p>Ở màn hình này mọi hành động đều là XOÁ (khác Home/Premiere, nơi cùng icon tim có thể là thêm-hoặc-xoá) — nên CẢ xoá 1 item (<code>onChangeFavList</code> của <code>ProductCard</code>, tái dùng nguyên vẹn từ Câu 2/5) lẫn "Remove All" đều bọc trong xác nhận <code>Alert.alert</code>, khớp đúng "bằng cách xác nhận 1 thông báo" của riêng màn hình này. <code>useFocusEffect</code> (không phải <code>useEffect</code> chỉ chạy lúc mount) cần ở đây cùng lý do với màn hình danh sách của MMA301 PE1: 1 favorite bị xoá từ màn hình Detail phải phản ánh đúng lần kế tiếp màn hình này lấy lại focus, không chỉ lần đầu điều hướng tới.</p>`,
  ),
  rubric: [
    { id: 'lists_favorites_from_asyncstorage', criterion: B('The screen displays the jewelry list stored in AsyncStorage, refreshed whenever the screen gains focus.', 'Màn hình hiện danh sách trang sức lưu trong AsyncStorage, nạp lại mỗi lần lấy lại focus.'), weight: 1, maxScore: 0.5 },
    { id: 'single_and_remove_all_with_confirmation', criterion: B('Both single-item removal and a "remove all" action are available, each requiring confirmation before the change takes effect.', 'Có cả xoá 1 item và "remove all", mỗi hành động đều cần xác nhận trước khi có hiệu lực.'), weight: 1, maxScore: 0.6 },
    { id: 'list_updates_after_removal', criterion: B('The displayed list updates correctly after a confirmed removal (single or all).', 'Danh sách hiện đúng cập nhật sau khi xoá đã xác nhận (1 hoặc tất cả).'), weight: 1, maxScore: 0.2 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or jeName title navigates to the Detail screen.', 'Chạm ảnh hoặc tiêu đề jeName điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.2 },
  ],
};

const q5 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Task 5. Implement some actions at the Premiere screen.</strong></p><ul>` +
    `<li>(2.5 marks) The Premiere screen displays a list of jewelry items consisting of those with more than one color, with stones (stoneStyle = true), and with a shipping fee (shipped) exceeding 10% of the cost. Implement an automated sorting function (in descending order) that arranges the jewelry list by price (cost + shipped).</li>` +
    `<li>(0.25 mark) The favorite state of each piece of jewelry or of all jewelry items can be changed (e.g., remove a single jewelry item from the list or remove all) by confirming a notification. The screen updates the favorite list after the action is successfully completed.</li>` +
    `<li>(0.25 mark) Tapping the jewelry's image or the title of the jewelry name (jeName) navigates to the Detail screen.</li></ul>`,
    `<p><strong>Task 5. Triển khai hành động ở màn hình Premiere.</strong></p><ul>` +
    `<li>(2.5 điểm) Màn hình Premiere hiện danh sách trang sức gồm những món có NHIỀU HƠN 1 màu, có đá (stoneStyle=true), và phí ship (shipped) VƯỢT QUÁ 10% CỦA COST. Triển khai sắp xếp tự động (giảm dần) theo giá (cost + shipped).</li>` +
    `<li>(0.25 điểm) Trạng thái favorite của 1 hoặc mọi trang sức có thể đổi (VD xoá 1 item hoặc xoá tất cả) bằng cách xác nhận 1 thông báo. Màn hình cập nhật danh sách favorite sau khi hoàn tất.</li>` +
    `<li>(0.25 điểm) Chạm ảnh hoặc tiêu đề jeName chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/PremiereScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ProductAPI } from "../api/ProductAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ProductCard from "../components/ProductCard";

const PremiereScreen = () => {
    const [jewelry, setJewelry] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, sort ----------

            // -------------------------------------------------------
        }, []),
    );

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    const removeAll = () => {
        // ---------- Student's code starts from here: confirm, then clear + persist + update ----------

        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);

    return (
        <View style={styles.container}>
            {favorites.length > 1 && (
                <TouchableOpacity style={styles.removeAll} onPress={removeAll}>
                    <Text style={styles.removeAllText}>Remove All Favorites</Text>
                </TouchableOpacity>
            )}
            <FlatList
                data={jewelry}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default PremiereScreen;`,
  sampleSolution:
`// ===== src/screen/PremiereScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ProductAPI } from "../api/ProductAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ProductCard from "../components/ProductCard";

const PremiereScreen = () => {
    const [jewelry, setJewelry] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, sort ----------
            (async () => {
                const api = new ProductAPI();
                const data = await api.getAllJewelry();

                const filtered = data.filter(
                    (item) =>
                        item.color?.length > 1 &&
                        item.stoneStyle === true &&
                        item.shipped > item.cost * 0.1, // "exceeding 10% of the cost" — relative to THIS item's own cost
                );
                const sorted = filtered.sort(
                    (a, b) => (b.cost + b.shipped) - (a.cost + a.shipped),
                );
                setJewelry(sorted);
            })();
            (async () => {
                const stored = await getFavorites();
                setFavorites(stored);
            })();
            // -------------------------------------------------------
        }, []),
    );

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------
        const exists = favorites.some((f) => f.id === item.id);
        const updated = exists
            ? favorites.filter((f) => f.id !== item.id)
            : [...favorites, item];
        setFavorites(updated);
        await saveFavorites(updated);
        // -------------------------------------------------------
    };

    const removeAll = () => {
        // ---------- Student's code starts from here: confirm, then clear + persist + update ----------
        Alert.alert("Confirm", "Remove all favorites?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "OK",
                onPress: async () => {
                    setFavorites([]);
                    await saveFavorites([]);
                },
            },
        ]);
        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);

    return (
        <View style={styles.container}>
            {favorites.length > 1 && (
                <TouchableOpacity style={styles.removeAll} onPress={removeAll}>
                    <Text style={styles.removeAllText}>Remove All Favorites</Text>
                </TouchableOpacity>
            )}
            <FlatList
                data={jewelry}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#121212" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default PremiereScreen;`,
  explanation: B(
    `<p><b>"Exceeding 10% of the cost" is a RELATIVE condition, per-item</b> — the correct filter is <code>item.shipped > item.cost * 0.1</code>, not a fixed absolute threshold like <code>item.shipped > 0.1</code>. Verified against the real dataset: item id=3 (shipped=8.2, cost=83.99) has 8.2 > 8.399 FALSE (correctly excluded), while a flat <code>shipped > 0.1</code> check would wrongly include it since 8.2 is trivially greater than the constant 0.1 — the two formulas diverge on real data, so this is a genuine bug class, not a stylistic preference. Sorting descending by <code>(cost + shipped)</code> matches the "price" formula established in Question 3's Detail screen, applied here at the list level instead of a single item. Removing all favorites here does NOT need to remove them from other screens' state separately — <code>saveFavorites([])</code> clears the single shared AsyncStorage key that Home/Favorite/Detail all read from, so the change is visible everywhere the next time each screen loads favorites.</p>`,
    `<p><b>"Vượt quá 10% của cost" là điều kiện TƯƠNG ĐỐI, theo TỪNG món</b> — filter đúng là <code>item.shipped > item.cost * 0.1</code>, không phải ngưỡng tuyệt đối cố định như <code>item.shipped > 0.1</code>. Đã kiểm bằng dữ liệu thật: món id=3 (shipped=8.2, cost=83.99) có 8.2 > 8.399 SAI (đúng ra phải loại), trong khi kiểm <code>shipped > 0.1</code> phẳng sẽ SAI đưa vào vì 8.2 tất nhiên lớn hơn hằng số 0.1 — 2 công thức lệch nhau trên dữ liệu thật, nên đây là lỗi thật, không phải khác biệt phong cách. Sắp xếp giảm dần theo <code>(cost + shipped)</code> khớp đúng công thức "price" đã lập ở màn hình Detail Câu 3, áp ở đây cho cả danh sách thay vì 1 item. Xoá tất cả favorite ở đây KHÔNG cần xoá riêng ở state màn hình khác — <code>saveFavorites([])</code> xoá đúng 1 key AsyncStorage dùng chung mà Home/Favorite/Detail đều đọc, nên thay đổi hiện đúng ở mọi nơi lần kế tiếp mỗi màn hình nạp lại favorite.</p>`,
  ),
  rubric: [
    { id: 'filter_multicolor_stone_correct', criterion: B('The list correctly includes only jewelry with more than one color AND stoneStyle true.', 'Danh sách chỉ gồm đúng trang sức có nhiều hơn 1 màu VÀ stoneStyle true.'), weight: 1, maxScore: 0.6 },
    { id: 'filter_shipped_relative_to_cost', criterion: B('The shipping-fee filter is relative to each item\'s own cost (shipped > cost * 0.1), not a fixed absolute threshold.', 'Điều kiện phí ship tương đối theo cost CỦA TỪNG món (shipped > cost * 0.1), không phải ngưỡng tuyệt đối cố định.'), weight: 1, maxScore: 0.9 },
    { id: 'sorted_descending_by_price', criterion: B('The filtered list is automatically sorted in descending order by (cost + shipped).', 'Danh sách đã lọc tự động sắp xếp giảm dần theo (cost + shipped).'), weight: 1, maxScore: 0.6 },
    { id: 'favorite_change_with_confirmation_and_update', criterion: B('Favorite state (single or all) can be changed with confirmation, and the favorite list updates after the action completes.', 'Trạng thái favorite (1 hoặc tất cả) đổi được kèm xác nhận, danh sách favorite cập nhật sau khi hoàn tất.'), weight: 1, maxScore: 0.5 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or jeName title navigates to the Detail screen.', 'Chạm ảnh hoặc tiêu đề jeName điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'MMA301' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE2',
    title: 'MMA301 – Practical Exam (Spring 2025), Jewelry Shop App|||MMA301 – Thi thực hành (Spring 2025), App Jewelry Shop',
    description: 'MMA301 PE (CODE): React Native + Expo app fetching from a MockAPI.io resource (Home/Favorite/Premiere tabs, brand filter, favorites via AsyncStorage, Detail screen with VND conversions), AI-graded.|||PE MMA301 (viết mã): app React Native + Expo lấy dữ liệu từ resource MockAPI.io (tab Home/Favorite/Premiere, lọc brand, favorite qua AsyncStorage, màn Detail quy đổi VND), chấm AI.',
    durationMinutes: 85,
    totalPoints: 10.25,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
