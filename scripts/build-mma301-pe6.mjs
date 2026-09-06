/**
 * build-mma301-pe6.mjs — sinh content/exams/MMA301-PE6.mjs.
 *
 * Nguồn thật: "MMA301 - SU 2025 - PE" (MMA301PE_250801) — app React
 * Native/Expo "Handbag Shop" (Home/Favorite/Custome). Chỉ có
 * data.json (đã đọc kỹ xác nhận field thật: handbagName/cost/
 * category/color[]/gender(boolean)/uri/brand/percentOff — field ảnh
 * "uri" khớp ĐÚNG câu chữ đề lần này, không lệch như PE3/PE4) + 1
 * Note.docx tham khảo (boilerplate, không phải solution).
 *
 * ⚠️⚠️ KHÁC MỌI ĐỀ MMA301 KHÁC TRONG MÔN: bản scan/OCR của đề này
 * KHÔNG IN RA số điểm nào cho bất kỳ mục con nào (không phải chỉ 1 ô
 * mờ như PE5) — có thể do lỗi trích PDF hoặc bản gốc chỉ liệt yêu cầu
 * không kèm điểm. TOÀN BỘ điểm số trong đề này là SUY LUẬN, không đọc
 * được trực tiếp: đối chiếu cấu trúc mục con (Task1=2 mục, Task2=3
 * mục, Task3=1 mục gộp, Task4=2 mục, Task5=3 mục) với đề "MMA301 -
 * SP 2025 - PE" (PE2, Jewelry Shop) trong CHÍNH môn này — đề đó có
 * cấu trúc mục con GIỐNG HỆT (Task3 cũng gộp 1 mục, Task4 cũng đúng 2
 * mục) — lấy nguyên bộ điểm PE2 (0.75/3.25/1.75/1.5/3.0, tổng 10.25)
 * rồi chỉnh giảm đúng 0.25 ở Task4 (0.5+0.75 thay vì 0.5+1.0) để tổng
 * tròn 10 thay vì lặp lại kiểu cộng dư của PE2.
 *
 * Điểm gốc (SUY LUẬN, xem trên): Task1=0.75, Task2=3.25, Task3=1.75,
 * Task4=1.25, Task5=3.0 (tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MMA301-PE6.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/MMA301-PE6.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const appContext = B(
  `<div class="pe-system"><b>Handbag data shape (from data.json, imported into a MockAPI.io resource named after your StudentCode):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  handbagName: string,
  cost: number,          // USD-like decimal, convert to VND with *26000
  category: string,       // e.g. "Shoulder Bag", "Crossbody"
  color: string[],        // e.g. ["Vanilla", "Acorn", "Gray"]
  gender: boolean,        // true = women's, false = men's
  uri: string,            // image URL
  brand: string,
  percentOff: number,     // 0-1 fraction, display as a percentage (*100)
}</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu túi xách (từ data.json, nạp vào resource MockAPI.io đặt tên theo StudentCode):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  handbagName: string,
  cost: number,          // số thập phân kiểu USD, quy đổi VND bằng *26000
  category: string,       // VD "Shoulder Bag", "Crossbody"
  color: string[],        // VD ["Vanilla", "Acorn", "Gray"]
  gender: boolean,        // true = nữ, false = nam
  uri: string,            // URL ảnh
  brand: string,
  percentOff: number,     // phân số 0-1, hiện dạng % (*100)
}</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>MMA301 – Practical Exam (Summer 2025) — Handbag Shop app</strong>. Built with React Native + Expo, data fetched from a MockAPI.io resource, favorites stored locally with AsyncStorage. This exam room has no live Expo/device runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. Switching between screens must be quick. StudentCode is the roll number (e.g. SE171234). A score of 0 is given for a program with syntax/compilation errors, for code unrelated to the test, or for not reading handbag data from the data.json-sourced MockAPI resource with its endpoint in .env.</p>` + appContext,
  `<p><strong>MMA301 – Thi thực hành (Summer 2025) — App Handbag Shop</strong>. Xây bằng React Native + Expo, dữ liệu lấy từ resource MockAPI.io, favorite lưu cục bộ bằng AsyncStorage. Phòng thi này không có môi trường Expo/thiết bị sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Chuyển màn hình phải nhanh. StudentCode là mã số sinh viên (VD SE171234). Điểm 0 nếu chương trình có lỗi cú pháp/biên dịch, có code không liên quan đề, hoặc không đọc dữ liệu túi xách từ resource MockAPI nạp từ data.json với endpoint đặt trong .env.</p>` + appContext,
);

const q1 = {
  kind: 'CODE', points: 0.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 1. Set up the application.</strong></p><ul>` +
    `<li>Build a new React Native application named after your roll number (e.g., SE171234). The app must include 3 Bottom Tabs. All screens should be switchable with a single touch.</li>` +
    `<li>Create a resource on the MockAPI.io tool to store Handbag data. The resource name must be your StudentCode.</li></ul>`,
    `<p><strong>Task 1. Thiết lập ứng dụng.</strong></p><ul>` +
    `<li>Tạo ứng dụng React Native mới đặt tên theo mã số sinh viên (VD SE171234). App phải có 3 Bottom Tabs. Mọi màn hình chuyển được chỉ với 1 lần chạm.</li>` +
    `<li>Tạo 1 resource trên MockAPI.io lưu dữ liệu Handbag. Tên resource phải là StudentCode.</li></ul>`,
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
    "axios": "^1.8.4"
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
    "axios": "^1.8.4"
  }
}

// ===== src/navigation/AppNavigation.js =====
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screen/HomeScreen";
import FavoriteScreen from "../screen/FavoriteScreen";
import CustomeScreen from "../screen/CustomeScreen";
import DetailsScreen from "../screen/DetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
    // ---------- Student's code starts from here ----------
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorite" component={FavoriteScreen} />
            <Tab.Screen name="Custome" component={CustomeScreen} />
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
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Handbag Details" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    // -------------------------------------------------------
};`,
  explanation: B(
    `<p>The paper spells the third tab "Custome" (not "Custom" or "Customer") — kept verbatim since that's the literal screen name the paper's own Task 5 heading uses. As in every sibling MMA301 paper, the Detail screen is kept OUTSIDE the tab navigator in the wrapping Stack, since Home/Favorite/Custome all need to navigate into it while keeping their own tab bar visible until that navigation happens.</p>`,
    `<p>Đề đánh vần tab thứ 3 là "Custome" (không phải "Custom" hay "Customer") — giữ nguyên văn vì đó là tên màn hình thật tiêu đề Task 5 của đề dùng. Giống mọi đề MMA301 khác trong môn, màn hình Detail nằm NGOÀI tab navigator trong Stack bọc ngoài, vì Home/Favorite/Custome đều cần điều hướng vào đó trong khi vẫn giữ thanh tab riêng cho tới lúc điều hướng.</p>`,
  ),
  rubric: [
    { id: 'app_named_after_roll_number', criterion: B('The project/app is named after a roll-number-shaped StudentCode.', 'Dự án/app đặt tên theo StudentCode hợp lệ.'), weight: 1, maxScore: 0.15 },
    { id: 'three_bottom_tabs', criterion: B('The app uses a bottom tab navigator with exactly three tabs (Home, Favorite, Custome), each switchable in a single touch.', 'App dùng bottom tab navigator với đúng 3 tab (Home, Favorite, Custome), chuyển được chỉ 1 chạm.'), weight: 1, maxScore: 0.25 },
    { id: 'detail_screen_reachable', criterion: B('A Details screen exists and is reachable via navigation from within the tab screens.', 'Có màn hình Details và điều hướng được từ trong các tab.'), weight: 1, maxScore: 0.1 },
    { id: 'mockapi_resource_named_after_student_code', criterion: B('A MockAPI.io resource named after the StudentCode is set up to store handbag data, referenced via an env-configured base URL.', 'Resource MockAPI.io đặt tên theo StudentCode được lập để lưu dữ liệu túi xách, tham chiếu qua base URL cấu hình bằng env.'), weight: 1, maxScore: 0.25 },
  ],
};

const q2 = {
  kind: 'CODE', points: 3.25, language: 'javascript',
  prompt: B(
    `<p><strong>Task 2. Implement actions on the Home screen.</strong></p><ul>` +
    `<li>Build the Home screen in your application. The user should be able to filter handbags by selecting a brand on this screen. The data should include: handbagName, uri, percentOff (displayed as a percentage, not a decimal value). The gender value must stand out on this screen (e.g., styled with a male icon for the false value — and a distinct icon for the true/women's value). The handbag list should be displayed in descending order by cost and filtered by brand, retrieved from the MockAPI tool. Use Bottom Tabs to switch between three screens: Home, Favorite, and Custome. Design and arrange this component as cleanly and efficiently as possible.</li>` +
    `<li>From the Home screen, tapping the handbag image or the handbagName title should navigate to the Detail screen.</li>` +
    `<li>On the Home screen, implement the favorite list using AsyncStorage. Pressing the favorite icon on a handbag view should add that handbag to the favorite list.</li></ul>`,
    `<p><strong>Task 2. Triển khai hành động ở màn hình Home.</strong></p><ul>` +
    `<li>Dựng màn hình Home cho phép lọc túi xách theo brand. Dữ liệu gồm: handbagName, uri, percentOff (hiện dạng %, không phải số thập phân). Giá trị gender phải NỔI BẬT trên màn hình này (VD icon nam cho giá trị false — và icon riêng biệt cho true/nữ). Danh sách lấy từ MockAPI, sắp giảm dần theo cost, lọc theo brand. Dùng Bottom Tabs chuyển giữa Home, Favorite, Custome. Bố trí component này gọn gàng và hiệu quả nhất có thể.</li>` +
    `<li>Ở Home, bấm ảnh túi xách hoặc tiêu đề handbagName chuyển sang màn hình Detail.</li>` +
    `<li>Ở Home, triển khai danh sách favorite bằng AsyncStorage. Bấm icon favorite của 1 túi thì thêm túi đó vào danh sách favorite.</li></ul>`,
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
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { HandbagAPI } from "../api/HandbagAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import HandbagCard from "../components/HandbagCard";
import BrandFilter from "../components/BrandFilter";

const HomeScreen = () => {
    const [handbags, setHandbags] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by cost ----------

        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply brand filter ----------

        // -------------------------------------------------------
    }, [selectedBrand, handbags]);

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);
    const brands = [...new Set(handbags.map((h) => h.brand))];

    return (
        <SafeAreaView style={styles.container}>
            <BrandFilter data={brands} selected={selectedBrand} onSelect={setSelectedBrand} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <HandbagCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/HandbagCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HandbagCard = ({ item, favorite, onChangeFavList }) => {
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
                <Image source={{ uri: item.uri }} style={styles.img} />
                <Text style={styles.name} numberOfLines={2}>{item.handbagName}</Text>
                <View style={styles.row}>
                    <Text style={styles.badgeText}>
                        {/* ---------- Student's code starts from here: percentOff as % ---------- */}
                        {/* ------------------------------------------------------- */}
                    </Text>
                    <Ionicons
                        name={
                            // ---------- Student's code starts from here: distinct icon for gender true/false ----------
                            "help-outline"
                            // -------------------------------------------------------
                        }
                        size={16}
                    />
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
    row: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 },
    badgeText: { fontSize: 12, color: "#e91e63", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default HandbagCard;`,
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
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { HandbagAPI } from "../api/HandbagAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import HandbagCard from "../components/HandbagCard";
import BrandFilter from "../components/BrandFilter";

const HomeScreen = () => {
    const [handbags, setHandbags] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by cost ----------
        (async () => {
            const api = new HandbagAPI();
            const data = await api.getAllHandbags();
            const sorted = [...data].sort((a, b) => b.cost - a.cost);
            setHandbags(sorted);
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
            setFiltered(handbags);
        } else {
            setFiltered(handbags.filter((h) => h.brand === selectedBrand));
        }
        // -------------------------------------------------------
    }, [selectedBrand, handbags]);

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
    const brands = [...new Set(handbags.map((h) => h.brand))];

    return (
        <SafeAreaView style={styles.container}>
            <BrandFilter data={brands} selected={selectedBrand} onSelect={setSelectedBrand} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <HandbagCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/HandbagCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HandbagCard = ({ item, favorite, onChangeFavList }) => {
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
                <Image source={{ uri: item.uri }} style={styles.img} />
                <Text style={styles.name} numberOfLines={2}>{item.handbagName}</Text>
                <View style={styles.row}>
                    <Text style={styles.badgeText}>
                        {/* ---------- Student's code starts from here: percentOff as % ---------- */}
                        -{Math.round(item.percentOff * 100)}%
                        {/* ------------------------------------------------------- */}
                    </Text>
                    <Ionicons
                        name={
                            // ---------- Student's code starts from here: distinct icon for gender true/false ----------
                            item.gender ? "female" : "male"
                            // -------------------------------------------------------
                        }
                        size={16}
                    />
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
    row: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 },
    badgeText: { fontSize: 12, color: "#e91e63", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default HandbagCard;`,
  explanation: B(
    `<p>The paper only spells out an icon for the FALSE value ("styled with a male icon for the false value"), but "must stand out" for the whole <code>gender</code> field implies the TRUE case needs an equally distinct treatment, not silence — <code>Ionicons</code>'s built-in <code>"male"</code>/<code>"female"</code> pair is the natural symmetric choice, since the data confirms <code>gender:true</code> means women's and <code>gender:false</code> means men's (the Custome screen's own filter, <code>gender==true</code> for "women's Shoulder Bag category," makes this mapping explicit). <code>HandbagCard</code> is written once here and reused unchanged by Favorite (Task 4) and Custome (Task 5).</p>`,
    `<p>Đề chỉ nói rõ icon cho giá trị FALSE ("icon nam cho giá trị false"), nhưng "phải nổi bật" cho cả field <code>gender</code> ngụ ý trường hợp TRUE cũng cần 1 hình ảnh riêng biệt tương xứng, không phải im lặng — cặp <code>"male"</code>/<code>"female"</code> có sẵn của <code>Ionicons</code> là lựa chọn đối xứng tự nhiên, vì dữ liệu xác nhận <code>gender:true</code> nghĩa là hàng nữ và <code>gender:false</code> là hàng nam (bộ lọc của chính màn Custome, <code>gender==true</code> cho "danh mục Shoulder Bag nữ", nói rõ ánh xạ này). <code>HandbagCard</code> viết đúng 1 lần ở đây và Favorite (Câu 4)/Custome (Câu 5) tái dùng nguyên vẹn.</p>`,
  ),
  rubric: [
    { id: 'fetches_sorts_filters_correctly', criterion: B('Handbags are fetched from MockAPI, correctly filtered by the selected brand, and sorted in descending order by cost.', 'Túi xách lấy từ MockAPI, lọc đúng theo brand đã chọn, sắp giảm dần theo cost.'), weight: 1, maxScore: 1 },
    { id: 'percentoff_and_gender_stand_out', criterion: B('percentOff is displayed as a percentage (not the raw decimal), and gender true/false uses two visually distinct icons that both stand out.', 'percentOff hiện dạng % (không phải số thập phân thô), và gender true/false dùng 2 icon phân biệt rõ, cả 2 đều nổi bật.'), weight: 1, maxScore: 0.7 },
    { id: 'shows_handbagname_and_image', criterion: B('Each item shows at least handbagName and the image (uri).', 'Mỗi item hiện ít nhất handbagName và ảnh (uri).'), weight: 1, maxScore: 0.3 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or the handbagName title navigates to the Detail screen for that item.', 'Chạm ảnh hoặc tiêu đề handbagName điều hướng sang màn hình Detail đúng item.'), weight: 1, maxScore: 0.6 },
    { id: 'favorite_toggle_persists_to_asyncstorage', criterion: B('Pressing the favorite icon correctly adds the handbag to an AsyncStorage-backed favorite list.', 'Bấm icon favorite thêm đúng túi xách vào danh sách favorite lưu qua AsyncStorage.'), weight: 1, maxScore: 0.65 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 3. Implement actions on the Detail screen (1.75 marks).</strong></p>` +
    `<p>Show all handbag information: handbagName, percentOff (displayed as a percentage), image (uri), category, cost (converted to #,### VND using the formula cost * 26,000, e.g. 130,725 VND), color (shown as badges or tags for bags with multiple colors), brand, and gender value (styled the same as on the Home screen). In addition, display the favorite state and allow the user to toggle it for this handbag (add/remove it from the Favorite list). Design and arrange this component as cleanly and efficiently as possible.</p>`,
    `<p><strong>Task 3. Triển khai hành động ở màn hình Detail (1.75 điểm).</strong></p>` +
    `<p>Hiện đầy đủ thông tin túi xách: handbagName, percentOff (hiện %), image (uri), category, cost (quy đổi VND bằng cost*26.000, VD 130.725 VND), color (hiện dạng badge/tag cho túi nhiều màu), brand, và giá trị gender (style giống màn Home). Ngoài ra, hiện trạng thái favorite và cho người dùng đổi nó cho túi này (thêm/xoá khỏi danh sách Favorite). Bố trí component này gọn gàng và hiệu quả nhất có thể.</p>`,
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

    const costDisplay = ""; // ---------- Student's code: cost*26000 VND ----------

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{item.handbagName}</Text>
                <Text>Discount: {Math.round(item.percentOff * 100)}%</Text>
                <Text>Category: {item.category}</Text>
                <Text>Cost: {costDisplay}</Text>
                <View style={styles.badgeRow}>
                    {item.color.map((c) => (
                        <View key={c} style={styles.badge}><Text style={styles.badgeText}>{c}</Text></View>
                    ))}
                </View>
                <Text>Brand: {item.brand}</Text>
                <Ionicons name={item.gender ? "female" : "male"} size={20} />
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
    badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginVertical: 8 },
    badge: { backgroundColor: "#eee", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 12 },
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
            setIsFavorite(stored.some((h) => h.id === item.id));
        })();
        // -------------------------------------------------------
    }, [item.id]);

    const toggleFavorite = async () => {
        // ---------- Student's code starts from here ----------
        const stored = await getFavorites();
        const updated = isFavorite
            ? stored.filter((h) => h.id !== item.id)
            : [...stored, item];
        await saveFavorites(updated);
        setIsFavorite(!isFavorite);
        // -------------------------------------------------------
    };

    const costDisplay = \`\${(item.cost * 26000).toLocaleString()} VND\`; // ---------- Student's code: cost*26000 VND ----------

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{item.handbagName}</Text>
                <Text>Discount: {Math.round(item.percentOff * 100)}%</Text>
                <Text>Category: {item.category}</Text>
                <Text>Cost: {costDisplay}</Text>
                <View style={styles.badgeRow}>
                    {item.color.map((c) => (
                        <View key={c} style={styles.badge}><Text style={styles.badgeText}>{c}</Text></View>
                    ))}
                </View>
                <Text>Brand: {item.brand}</Text>
                <Ionicons name={item.gender ? "female" : "male"} size={20} />
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
    badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginVertical: 8 },
    badge: { backgroundColor: "#eee", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 12 },
});

export default DetailsScreen;`,
  explanation: B(
    `<p>The image field is genuinely called <code>uri</code> in both this paper's own wording and the real seed data — unlike the sibling Fruit paper (which called its field "imageUrl" in prose but stored "imageUri"), there is no mismatch to resolve here, so <code>item.uri</code> is used directly. <code>gender</code> reuses the EXACT SAME male/female icon mapping established on Home in Question 2 ("styled the same as on the Home screen"), not a re-derived or differently-styled version — consistency of that specific visual cue across screens is what the paper's own wording asks for.</p>`,
    `<p>Field ảnh thật sự tên <code>uri</code> ở cả câu chữ đề lẫn seed thật — khác đề Fruit song song trong môn (gọi "imageUrl" trong câu chữ nhưng lưu "imageUri"), không có gì lệch cần xử lý ở đây, nên dùng thẳng <code>item.uri</code>. <code>gender</code> dùng lại ĐÚNG NGUYÊN ánh xạ icon nam/nữ đã lập ở Home Câu 2 ("style giống màn Home"), không phải bản suy lại hay style khác — tính nhất quán của đúng tín hiệu hình ảnh đó xuyên suốt màn hình là điều câu chữ đề yêu cầu.</p>`,
  ),
  rubric: [
    { id: 'all_required_fields_shown', criterion: B('handbagName, percentOff (as %), the image (uri), category, cost (converted to VND), brand, and gender (styled like Home) are all displayed.', 'handbagName, percentOff (dạng %), ảnh (uri), category, cost (quy đổi VND), brand, và gender (style giống Home) đều được hiển thị.'), weight: 1, maxScore: 0.6 },
    { id: 'cost_vnd_formula_correct', criterion: B('cost is correctly converted to VND using cost * 26000.', 'cost quy đổi đúng VND bằng cost * 26000.'), weight: 1, maxScore: 0.4 },
    { id: 'colors_shown_as_badges_for_multiple', criterion: B('When a handbag has more than one color, each is shown as a distinct badge/tag rather than a single joined string.', 'Khi túi có nhiều hơn 1 màu, mỗi màu hiện thành badge/tag riêng biệt thay vì 1 chuỗi nối liền.'), weight: 1, maxScore: 0.4 },
    { id: 'favorite_state_shown_and_toggleable', criterion: B('The current favorite state for this specific handbag is shown and can be toggled, persisting to AsyncStorage.', 'Trạng thái favorite của đúng túi này được hiện và đổi được, lưu vào AsyncStorage.'), weight: 1, maxScore: 0.35 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1.25, language: 'javascript',
  prompt: B(
    `<p><strong>Task 4. Implement actions on the Favorite screen.</strong></p><ul>` +
    `<li>On the Favorite screen, show the list of handbags stored in AsyncStorage.</li>` +
    `<li>Allow the user to change the favorite state of individual handbags or all handbags (e.g., remove a single handbag or clear the entire list) by confirming a notification. The screen should update the favorite list after the action is successfully completed. Clicking a handbag's image should navigate to the Detail screen.</li></ul>`,
    `<p><strong>Task 4. Triển khai hành động ở màn hình Favorite.</strong></p><ul>` +
    `<li>Ở Favorite, hiện danh sách túi xách lưu trong AsyncStorage.</li>` +
    `<li>Cho đổi trạng thái favorite của 1 túi hoặc toàn bộ (VD xoá 1 túi hoặc xoá sạch danh sách) sau khi xác nhận 1 thông báo. Màn hình cập nhật danh sách favorite sau khi hành động hoàn tất. Bấm ảnh túi chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/FavoriteScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import HandbagCard from "../components/HandbagCard";

const FavoriteScreen = () => {
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: reload favorites on focus ----------

            // -------------------------------------------------------
        }, []),
    );

    const removeFavorite = (id) => {
        // ---------- Student's code starts from here: confirm, then remove + persist + update ----------

        // -------------------------------------------------------
    };

    const removeAll = () => {
        // ---------- Student's code starts from here: confirm, then clear + persist + update ----------

        // -------------------------------------------------------
    };

    if (favorites.length === 0) {
        return <View style={styles.empty}><Text>No favorite handbags</Text></View>;
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
                    <HandbagCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fafafa" },
    empty: { flex: 1, justifyContent: "center", alignItems: "center" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default FavoriteScreen;`,
  sampleSolution:
`// ===== src/screen/FavoriteScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import HandbagCard from "../components/HandbagCard";

const FavoriteScreen = () => {
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: reload favorites on focus ----------
            (async () => {
                const stored = await getFavorites();
                setFavorites(stored);
            })();
            // -------------------------------------------------------
        }, []),
    );

    const removeFavorite = (id) => {
        // ---------- Student's code starts from here: confirm, then remove + persist + update ----------
        Alert.alert("Confirm", "Remove this handbag from favorites?", [
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
        return <View style={styles.empty}><Text>No favorite handbags</Text></View>;
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
                    <HandbagCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fafafa" },
    empty: { flex: 1, justifyContent: "center", alignItems: "center" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default FavoriteScreen;`,
  explanation: B(
    `<p>Every handbag shown here is already a favorite, so every action is a REMOVAL — both single-handbag removal (reusing <code>HandbagCard</code>'s <code>onChangeFavList</code> unchanged from Home) and "Remove All" are wrapped in <code>Alert.alert</code>. <code>useFocusEffect</code> (not a mount-only effect) is required so a favorite added/removed from the Detail (Task 3) or Custome (Task 5) screen is reflected here the next time this tab regains focus.</p>`,
    `<p>Mọi túi hiện ở đây đã là favorite sẵn, nên mọi hành động đều là XOÁ — cả xoá 1 túi (tái dùng <code>onChangeFavList</code> của <code>HandbagCard</code> nguyên vẹn từ Home) lẫn "Remove All" đều bọc trong <code>Alert.alert</code>. <code>useFocusEffect</code> (không phải effect chỉ chạy lúc mount) cần thiết để 1 favorite thêm/xoá từ màn hình Detail (Câu 3) hoặc Custome (Câu 5) phản ánh đúng ở đây lần kế tiếp tab này lấy lại focus.</p>`,
  ),
  rubric: [
    { id: 'lists_favorites_from_asyncstorage', criterion: B('The screen displays the handbag list stored in AsyncStorage, refreshed whenever the screen gains focus.', 'Màn hình hiện danh sách túi xách lưu trong AsyncStorage, nạp lại mỗi lần lấy lại focus.'), weight: 1, maxScore: 0.4 },
    { id: 'single_and_remove_all_with_confirmation', criterion: B('Both single-handbag removal and a "remove all" action are available, each requiring confirmation before the change takes effect.', 'Có cả xoá 1 túi và "remove all", mỗi hành động đều cần xác nhận trước khi có hiệu lực.'), weight: 1, maxScore: 0.5 },
    { id: 'list_updates_after_removal', criterion: B('The displayed list updates correctly after a confirmed removal (single or all).', 'Danh sách hiện đúng cập nhật sau khi xoá đã xác nhận (1 hoặc tất cả).'), weight: 1, maxScore: 0.15 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image navigates to the Detail screen.', 'Chạm ảnh điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.2 },
  ],
};

const q5 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Task 5. Implement actions on the Custome screen.</strong></p><ul>` +
    `<li>On the Custome screen, show a list of handbags in the women's Shoulder Bag category (gender == true, category == "Shoulder Bag"), excluding gray-colored items. Implement an automated sorting function to arrange the handbag list in ascending order by brand (A-Z).</li>` +
    `<li>Allow the user to change the favorite state of individual handbags or all handbags (e.g., remove a single handbag or clear the entire list) by confirming a notification. The screen should update the favorite list after the action is successfully completed.</li>` +
    `<li>Tapping a handbag's image or the handbagName title should navigate to the Detail screen.</li></ul>`,
    `<p><strong>Task 5. Triển khai hành động ở màn hình Custome.</strong></p><ul>` +
    `<li>Ở Custome, hiện danh sách túi xách thuộc danh mục Shoulder Bag nữ (gender==true, category=="Shoulder Bag"), loại túi màu xám. Triển khai sắp xếp tự động, tăng dần theo brand (A-Z).</li>` +
    `<li>Cho đổi trạng thái favorite của 1 túi hoặc toàn bộ (VD xoá 1 túi hoặc xoá sạch danh sách) sau khi xác nhận 1 thông báo. Màn hình cập nhật danh sách favorite sau khi hành động hoàn tất.</li>` +
    `<li>Bấm ảnh túi hoặc tiêu đề handbagName chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/CustomeScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { HandbagAPI } from "../api/HandbagAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import HandbagCard from "../components/HandbagCard";

const CustomeScreen = () => {
    const [handbags, setHandbags] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, AUTO sort ascending by brand ----------

            // -------------------------------------------------------
        }, []),
    );

    const removeFavorite = (id) => {
        // ---------- Student's code starts from here: confirm, then remove + persist + update ----------

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
                data={handbags}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <HandbagCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => removeFavorite(item.id)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fafafa" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default CustomeScreen;`,
  sampleSolution:
`// ===== src/screen/CustomeScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { HandbagAPI } from "../api/HandbagAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import HandbagCard from "../components/HandbagCard";

const CustomeScreen = () => {
    const [handbags, setHandbags] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, AUTO sort ascending by brand ----------
            (async () => {
                const api = new HandbagAPI();
                const data = await api.getAllHandbags();

                const filtered = data.filter(
                    (item) =>
                        item.gender === true &&
                        item.category === "Shoulder Bag" &&
                        !item.color.includes("Gray"),
                );
                // "Automated" — sorted immediately on load, no button/tap required.
                const sorted = filtered.sort((a, b) => a.brand.localeCompare(b.brand));
                setHandbags(sorted);
            })();
            (async () => {
                const stored = await getFavorites();
                setFavorites(stored);
            })();
            // -------------------------------------------------------
        }, []),
    );

    const removeFavorite = (id) => {
        // ---------- Student's code starts from here: confirm, then remove + persist + update ----------
        Alert.alert("Confirm", "Remove this handbag from favorites?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "OK",
                onPress: async () => {
                    const updated = favorites.filter((f) => f.id !== id);
                    setFavorites(updated);
                    await saveFavorites(updated);
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
                data={handbags}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <HandbagCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => removeFavorite(item.id)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fafafa" },
    removeAll: { alignSelf: "center", backgroundColor: "#ff4444", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 5, marginBottom: 10 },
    removeAllText: { color: "#fff", fontWeight: "bold" },
});

export default CustomeScreen;`,
  explanation: B(
    `<p><b>"Excluding gray-colored items" excludes any handbag whose colors LIST CONTAINS "Gray" at all</b> (<code>!item.color.includes("Gray")</code>), not only bags whose ONLY color is gray — a bag like item id 2 in the seed data (colors <code>["Vanilla", "Acorn", "Gray"]</code>) must be excluded even though gray is just one of three listed colors. <b>"Implement an automated sorting function"</b> means the ascending-by-brand order is applied immediately when the list loads (same wording, same meaning as the sibling Football paper's Captains screen), not behind a manual sort button. The three independent filters (gender, category, color-exclusion) are combined with AND, matching this course's established pattern for multi-condition explore-style screens.</p>`,
    `<p><b>"Loại túi màu xám" loại BẤT KỲ túi nào có "Gray" TRONG danh sách colors</b> (<code>!item.color.includes("Gray")</code>), không chỉ túi CHỈ CÓ mỗi màu xám — 1 túi như id 2 trong seed (colors <code>["Vanilla", "Acorn", "Gray"]</code>) phải bị loại dù xám chỉ là 1 trong 3 màu liệt kê. <b>"Triển khai sắp xếp tự động"</b> nghĩa là thứ tự tăng dần theo brand áp dụng NGAY khi danh sách tải (cùng câu chữ, cùng ý nghĩa với màn Captains của đề Football song song trong môn), không phải đợi nút sắp xếp thủ công. 3 điều kiện lọc độc lập (gender, category, loại màu) kết hợp bằng AND, khớp đúng mẫu đã lập trong môn cho màn hình khám phá đa điều kiện.</p>`,
  ),
  rubric: [
    { id: 'filters_gender_category_correct', criterion: B('Only handbags with gender==true AND category=="Shoulder Bag" are included.', 'Chỉ giữ túi có gender==true VÀ category=="Shoulder Bag".'), weight: 1, maxScore: 0.6 },
    { id: 'excludes_gray_colors', criterion: B('Handbags with "Gray" anywhere in their colors list are excluded, even when gray is only one of several listed colors.', 'Túi có "Gray" bất kỳ đâu trong colors đều bị loại, kể cả khi xám chỉ là 1 trong nhiều màu liệt kê.'), weight: 1, maxScore: 0.6 },
    { id: 'automatically_sorted_on_load', criterion: B('The list is sorted ascending by brand (A-Z) automatically on load, without requiring any button press or user interaction to trigger the sort.', 'Danh sách tự động sắp tăng dần theo brand (A-Z) ngay khi tải, không cần bấm nút hay thao tác nào để kích hoạt sắp xếp.'), weight: 1, maxScore: 0.7 },
    { id: 'favorite_change_with_confirmation_and_update', criterion: B('Favorite state (single or all) can be changed with confirmation, and the favorite list updates after the action completes.', 'Trạng thái favorite (1 hoặc tất cả) đổi được kèm xác nhận, danh sách favorite cập nhật sau khi hoàn tất.'), weight: 1, maxScore: 0.6 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or handbagName title navigates to the Detail screen.', 'Chạm ảnh hoặc tiêu đề handbagName điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.5 },
  ],
};

const spec = {
  course: { courseCode: 'MMA301' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE6',
    title: 'MMA301 – Practical Exam (Summer 2025), Handbag Shop App|||MMA301 – Thi thực hành (Summer 2025), App Handbag Shop',
    description: 'MMA301 PE (CODE): React Native + Expo app fetching from a MockAPI.io resource (Home/Favorite/Custome tabs, brand filter, favorites via AsyncStorage, Detail screen with a VND cost conversion, multi-condition Custome filter+automatic sort), AI-graded.|||PE MMA301 (viết mã): app React Native + Expo lấy dữ liệu từ resource MockAPI.io (tab Home/Favorite/Custome, lọc brand, favorite qua AsyncStorage, màn Detail quy đổi giá VND, lọc đa điều kiện+sắp tự động ở Custome), chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
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
