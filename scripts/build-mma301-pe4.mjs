/**
 * build-mma301-pe4.mjs — sinh content/exams/MMA301-PE4.mjs.
 *
 * Nguồn thật: "MMA301 - SU26 - PE - Paper 1" (MMA301_SU26_PE_20260701)
 * — app React Native/Expo "Fruit Catalog" (Home/Favorite/Explore).
 * Cùng khung Task 1-5 y hệt "MMA301 - FA25 - PE" (PE3) trong môn này,
 * chỉ đổi domain (fruit thay origami) — không có solution đính kèm,
 * chỉ fruits.json (đã đọc kỹ xác nhận field thật) + Note.docx tham
 * khảo (boilerplate).
 *
 * ⚠️ Đề gọi field ảnh là "imageUrl" (cả Task 2 lẫn Task 3), nhưng
 * fruits.json thật dùng "imageUri" — cùng kiểu lệch câu chữ/seed đã
 * gặp ở PE3 (isStone/stoneStyle). Đọc đúng field thật "imageUri".
 *
 * ⚠️ KHÁC PE3: 3 ví dụ quy đổi storageTime (ngày→tuần+ngày) của đề
 * này ĐỀU NHẤT QUÁN, resolve đúng ngữ pháp số ít/nhiều ngay trong ví
 * dụ (10→"1 week 3 days", 14→"2 weeks", 5→"5 days") — KHÔNG có
 * placeholder "(s)" thô như PE3 từng có, nên không cần suy luận gì
 * thêm, chỉ cần cài đặt khớp chính xác 3 ví dụ.
 *
 * Điểm gốc: Task1=0.75, Task2=3.0, Task3=1.75, Task4=1.5, Task5=3.0
 * (tổng đúng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MMA301-PE4.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/MMA301-PE4.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const appContext = B(
  `<div class="pe-system"><b>Fruit data shape (from fruits.json, imported into a MockAPI.io resource named after your StudentCode):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  fruitName: string,
  storageTime: number,       // days
  sweetness: string,         // "Low" | "Medium" | "High"
  colors: string[],          // e.g. ["Yellow", "Orange", "Green"]
  isSeedless: boolean,
  imageUri: string,          // NOTE: the paper calls this "imageUrl", the real field is "imageUri"
  origin: string,
  ripeness: number,          // 0-1 fraction, display as a percentage (*100)
}</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu trái cây (từ fruits.json, nạp vào resource MockAPI.io đặt tên theo StudentCode):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  fruitName: string,
  storageTime: number,       // ngày
  sweetness: string,         // "Low" | "Medium" | "High"
  colors: string[],          // VD ["Yellow", "Orange", "Green"]
  isSeedless: boolean,
  imageUri: string,          // LƯU Ý: đề gọi "imageUrl", field thật là "imageUri"
  origin: string,
  ripeness: number,          // phân số 0-1, hiện dạng % (*100)
}</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>MMA301 – Practical Exam (Summer 2026, Paper 1) — Fruit Catalog app</strong>. Built with React Native + Expo, data fetched from a MockAPI.io resource, favorites stored locally with AsyncStorage. This exam room has no live Expo/device runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. Screen switching must be responsive (no noticeable lag). StudentCode is the roll number (e.g. se123456). A score of 0 is given for a program with syntax/compilation errors, for code unrelated to the test, or for not reading fruit data from the fruits.json-sourced MockAPI resource with its endpoint in .env.</p>` + appContext,
  `<p><strong>MMA301 – Thi thực hành (Summer 2026, Đề 1) — App danh mục trái cây</strong>. Xây bằng React Native + Expo, dữ liệu lấy từ resource MockAPI.io, favorite lưu cục bộ bằng AsyncStorage. Phòng thi này không có môi trường Expo/thiết bị sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Chuyển màn hình phải mượt (không lag rõ rệt). StudentCode là mã số sinh viên (VD se123456). Điểm 0 nếu chương trình có lỗi cú pháp/biên dịch, có code không liên quan đề, hoặc không đọc dữ liệu trái cây từ resource MockAPI nạp từ fruits.json với endpoint đặt trong .env.</p>` + appContext,
);

const q1 = {
  kind: 'CODE', points: 0.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 1. Build a new React Native application.</strong></p><ul>` +
    `<li>(0.5 marks) Create a new React Native application named after your StudentCode (e.g., se123456). The app must include three bottom tabs, and all screens must be switchable with a single touch.</li>` +
    `<li>(0.25 marks) Create a resource on MockAPI.io to store fruit data. The resource name must be your StudentCode.</li></ul>`,
    `<p><strong>Task 1. Xây ứng dụng React Native mới.</strong></p><ul>` +
    `<li>(0.5 điểm) Tạo ứng dụng React Native mới đặt tên theo StudentCode (VD se123456). App phải có 3 tab dưới, mọi màn hình chuyển được chỉ với 1 lần chạm.</li>` +
    `<li>(0.25 điểm) Lập 1 resource trên MockAPI.io lưu dữ liệu trái cây. Tên resource phải là StudentCode.</li></ul>`,
  ),
  starterCode:
`// ===== .env =====
EXPO_PUBLIC_BASEURL=https://<your-mockapi-project-id>.mockapi.io

// ===== package.json (relevant excerpt) =====
{
  "name": "se123456",
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
  "name": "se123456",
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
import ExploreScreen from "../screen/ExploreScreen";
import DetailsScreen from "../screen/DetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
    // ---------- Student's code starts from here ----------
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorite" component={FavoriteScreen} />
            <Tab.Screen name="Explore" component={ExploreScreen} />
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
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Fruit Details" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    // -------------------------------------------------------
};`,
  explanation: B(
    `<p>Same skeleton as this course's sibling Origami paper: three bottom tabs (Home, Favorite, Explore) fixed here become the vocabulary every later task's screen file follows, and the Detail screen is kept OUTSIDE the tab navigator in the wrapping Stack so any of the three tabs can navigate into it while keeping their own tab bar visible until that navigation happens.</p>`,
    `<p>Khung y hệt đề Origami song song trong môn: 3 tab dưới (Home, Favorite, Explore) chốt ở đây trở thành tên gọi mọi file màn hình câu sau theo đúng, và màn hình Detail nằm NGOÀI tab navigator trong Stack bọc ngoài để cả 3 tab đều điều hướng vào được trong khi vẫn giữ thanh tab riêng cho tới lúc điều hướng.</p>`,
  ),
  rubric: [
    { id: 'app_named_after_student_code', criterion: B('The project/app is named after a roll-number-shaped StudentCode.', 'Dự án/app đặt tên theo StudentCode hợp lệ.'), weight: 1, maxScore: 0.15 },
    { id: 'three_bottom_tabs', criterion: B('The app uses a bottom tab navigator with exactly three tabs (Home, Favorite, Explore), each switchable in a single touch.', 'App dùng bottom tab navigator với đúng 3 tab (Home, Favorite, Explore), chuyển được chỉ 1 chạm.'), weight: 1, maxScore: 0.25 },
    { id: 'detail_screen_reachable', criterion: B('A Details screen exists and is reachable via navigation from within the tab screens.', 'Có màn hình Details và điều hướng được từ trong các tab.'), weight: 1, maxScore: 0.1 },
    { id: 'mockapi_resource_named_after_student_code', criterion: B('A MockAPI.io resource named after the StudentCode is set up to store fruit data, referenced via an env-configured base URL.', 'Resource MockAPI.io đặt tên theo StudentCode được lập để lưu dữ liệu trái cây, tham chiếu qua base URL cấu hình bằng env.'), weight: 1, maxScore: 0.25 },
  ],
};

const q2 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Task 2. Implement the actions on the Home screen.</strong></p><ul>` +
    `<li>(1.75 marks) Build the Home screen and allow filtering fruits by selecting an origin. The data should include: fruitName, imageUri (the paper calls it "imageUrl" but the real field is "imageUri"), ripeness (displayed as a percentage, not a decimal value), isSeedless (visually highlighted — one icon for true/seedless, another icon for false/seeded). The list must be retrieved from MockAPI.io, filtered by origin, and displayed in descending order of storageTime. Use Bottom Tabs to switch between Home, Favorite, Explore. Design and lay out this screen as neatly and efficiently as possible.</li>` +
    `<li>(0.25 marks) On the Home screen, tapping the fruit image or the fruitName title should navigate to the Detail screen.</li>` +
    `<li>(1.0 marks) On the Home screen, implement the favorite list with AsyncStorage. When the favorite icon on a fruit is pressed, the fruit should be added to the favorite list.</li></ul>`,
    `<p><strong>Task 2. Triển khai hành động ở màn hình Home.</strong></p><ul>` +
    `<li>(1.75 điểm) Dựng màn hình Home cho phép lọc trái cây theo origin. Dữ liệu gồm: fruitName, imageUri (đề gọi "imageUrl" nhưng field thật là "imageUri"), ripeness (hiện dạng %, không phải số thập phân), isSeedless (làm nổi bật — 1 icon cho true/seedless, icon khác cho false/seeded). Danh sách lấy từ MockAPI.io, lọc theo origin, sắp giảm dần theo storageTime. Dùng Bottom Tabs chuyển giữa Home, Favorite, Explore. Bố trí màn hình này gọn gàng và hiệu quả nhất có thể.</li>` +
    `<li>(0.25 điểm) Ở Home, bấm ảnh trái cây hoặc tiêu đề fruitName chuyển sang màn hình Detail.</li>` +
    `<li>(1.0 điểm) Ở Home, triển khai danh sách favorite bằng AsyncStorage. Bấm icon favorite của 1 trái thì thêm trái đó vào danh sách favorite.</li></ul>`,
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
import { FruitAPI } from "../api/FruitAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import FruitCard from "../components/FruitCard";
import OriginFilter from "../components/OriginFilter";

const HomeScreen = () => {
    const [fruits, setFruits] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedOrigin, setSelectedOrigin] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by storageTime ----------

        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply origin filter ----------

        // -------------------------------------------------------
    }, [selectedOrigin, fruits]);

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);
    const origins = [...new Set(fruits.map((f) => f.origin))];

    return (
        <SafeAreaView style={styles.container}>
            <OriginFilter data={origins} selected={selectedOrigin} onSelect={setSelectedOrigin} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <FruitCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/FruitCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FruitCard = ({ item, favorite, onChangeFavList }) => {
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
                <Image source={{ uri: item.imageUri }} style={styles.img} />
                <Text style={styles.name}>{item.fruitName}</Text>
                <View style={styles.row}>
                    <Text style={styles.ripeness}>
                        {/* ---------- Student's code starts from here: ripeness as % ---------- */}
                        {/* ------------------------------------------------------- */}
                    </Text>
                    <Ionicons
                        name={
                            // ---------- Student's code starts from here: distinct icon for seedless vs seeded ----------
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
    ripeness: { fontSize: 12, color: "#e65100", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default FruitCard;`,
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
import { FruitAPI } from "../api/FruitAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import FruitCard from "../components/FruitCard";
import OriginFilter from "../components/OriginFilter";

const HomeScreen = () => {
    const [fruits, setFruits] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedOrigin, setSelectedOrigin] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by storageTime ----------
        (async () => {
            const api = new FruitAPI();
            const data = await api.getAllFruits();
            const sorted = [...data].sort((a, b) => b.storageTime - a.storageTime);
            setFruits(sorted);
        })();
        (async () => {
            const stored = await getFavorites();
            setFavorites(stored);
        })();
        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply origin filter ----------
        if (!selectedOrigin) {
            setFiltered(fruits);
        } else {
            setFiltered(fruits.filter((f) => f.origin === selectedOrigin));
        }
        // -------------------------------------------------------
    }, [selectedOrigin, fruits]);

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
    const origins = [...new Set(fruits.map((f) => f.origin))];

    return (
        <SafeAreaView style={styles.container}>
            <OriginFilter data={origins} selected={selectedOrigin} onSelect={setSelectedOrigin} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <FruitCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/FruitCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FruitCard = ({ item, favorite, onChangeFavList }) => {
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
                <Image source={{ uri: item.imageUri }} style={styles.img} />
                <Text style={styles.name}>{item.fruitName}</Text>
                <View style={styles.row}>
                    <Text style={styles.ripeness}>
                        {/* ---------- Student's code starts from here: ripeness as % ---------- */}
                        {Math.round(item.ripeness * 100)}%
                        {/* ------------------------------------------------------- */}
                    </Text>
                    <Ionicons
                        name={
                            // ---------- Student's code starts from here: distinct icon for seedless vs seeded ----------
                            item.isSeedless ? "checkmark-circle-outline" : "ellipse-outline"
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
    ripeness: { fontSize: 12, color: "#e65100", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default FruitCard;`,
  explanation: B(
    `<p>The image field must be read as <code>item.imageUri</code> — the paper's own wording calls it "imageUrl" in both Task 2 and Task 3, but <code>fruits.json</code> only has <code>imageUri</code>; code written against the literal paper spelling would silently render nothing. As in the sibling Origami paper, <code>FruitCard</code> is written once here and reused unchanged by Favorite (Task 4) and Explore (Task 5), so the ripeness-as-percentage and seedless-icon logic only needs to be correct in this one place.</p>`,
    `<p>Field ảnh phải đọc là <code>item.imageUri</code> — câu chữ đề gọi "imageUrl" ở cả Task 2 lẫn Task 3, nhưng <code>fruits.json</code> chỉ có <code>imageUri</code>; code viết theo đúng chính tả đề sẽ âm thầm không hiện ảnh nào. Giống đề Origami song song trong môn, <code>FruitCard</code> viết đúng 1 lần ở đây và Favorite (Câu 4)/Explore (Câu 5) tái dùng nguyên vẹn, nên logic ripeness-thành-% và icon seedless chỉ cần đúng đúng 1 chỗ.</p>`,
  ),
  rubric: [
    { id: 'fetches_sorts_filters_correctly', criterion: B('Fruits are fetched from MockAPI, correctly filtered by the selected origin, and sorted in descending order by storageTime.', 'Trái cây lấy từ MockAPI, lọc đúng theo origin đã chọn, sắp giảm dần theo storageTime.'), weight: 1, maxScore: 1 },
    { id: 'ripeness_percentage_and_seedless_icon', criterion: B('ripeness is displayed as a percentage (not the raw decimal), and isSeedless true/false uses two visually distinct icons.', 'ripeness hiện dạng % (không phải số thập phân thô), và isSeedless true/false dùng 2 icon phân biệt rõ.'), weight: 1, maxScore: 0.6 },
    { id: 'shows_fruitname_and_image', criterion: B('Each item shows at least fruitName and the fruit image (reading the real "imageUri" field).', 'Mỗi item hiện ít nhất fruitName và ảnh trái cây (đọc đúng field thật "imageUri").'), weight: 1, maxScore: 0.3 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or the fruitName title navigates to the Detail screen for that item.', 'Chạm ảnh hoặc tiêu đề fruitName điều hướng sang màn hình Detail đúng item.'), weight: 1, maxScore: 0.5 },
    { id: 'favorite_toggle_persists_to_asyncstorage', criterion: B('Pressing the favorite icon correctly adds the fruit to an AsyncStorage-backed favorite list.', 'Bấm icon favorite thêm đúng trái cây vào danh sách favorite lưu qua AsyncStorage.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 3. Implement the actions on the Detail screen (1.75 marks).</strong></p>` +
    `<p>Show all fruit information: fruitName, ripeness (displayed as a percentage), imageUri (rendered as image, called "imageUrl" in this task's own wording but the real field is "imageUri"), sweetness (Low, Medium, High), storageTime (convert from days into weeks and days using these rules: if both weeks and days exist, show as "X week(s) Y day(s)" — e.g. 10 → "1 week 3 days"; if only weeks exist, show as "X week(s)" — e.g. 14 → "2 weeks"; if only days exist, show as "X day(s)" — e.g. 5 → "5 days"), colors (shown as badges or tags for multiple colors), origin, isSeedless (styled the same as on the Home screen). Additionally: display the favorite state, and allow toggling the favorite state (add/remove from Favorite list). Design and lay out this screen as neatly and efficiently as possible.</p>`,
    `<p><strong>Task 3. Triển khai hành động ở màn hình Detail (1.75 điểm).</strong></p>` +
    `<p>Hiện đầy đủ thông tin trái cây: fruitName, ripeness (hiện %), imageUri (render dạng ảnh, câu chữ câu này cũng gọi "imageUrl" nhưng field thật là "imageUri"), sweetness (Low, Medium, High), storageTime (quy đổi ngày thành tuần+ngày theo quy tắc: nếu có cả tuần lẫn ngày, hiện "X week(s) Y day(s)" — VD 10 → "1 week 3 days"; nếu chỉ có tuần, hiện "X week(s)" — VD 14 → "2 weeks"; nếu chỉ có ngày, hiện "X day(s)" — VD 5 → "5 days"), colors (hiện dạng badge/tag cho nhiều màu), origin, isSeedless (style giống màn Home). Thêm nữa: hiện trạng thái favorite, và cho đổi trạng thái favorite (thêm/xoá khỏi danh sách Favorite). Bố trí màn hình này gọn gàng và hiệu quả nhất có thể.</p>`,
  ),
  starterCode:
`// ===== src/utils/formatStorageTime.js =====
export const formatStorageTime = (days) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { formatStorageTime } from "../utils/formatStorageTime";

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

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{item.fruitName}</Text>
                <Text>Ripeness: {Math.round(item.ripeness * 100)}%</Text>
                <Text>Sweetness: {item.sweetness}</Text>
                <Text>Storage time: {formatStorageTime(item.storageTime)}</Text>
                <View style={styles.badgeRow}>
                    {item.colors.map((c) => (
                        <View key={c} style={styles.badge}><Text style={styles.badgeText}>{c}</Text></View>
                    ))}
                </View>
                <Text>Origin: {item.origin}</Text>
                <Ionicons name={item.isSeedless ? "checkmark-circle-outline" : "ellipse-outline"} size={20} />
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
`// ===== src/utils/formatStorageTime.js =====
export const formatStorageTime = (days) => {
    // ---------- Student's code starts from here ----------
    const weeks = Math.floor(days / 7);
    const remDays = days % 7;

    if (weeks > 0 && remDays > 0) {
        return \`\${weeks} week\${weeks > 1 ? "s" : ""} \${remDays} day\${remDays > 1 ? "s" : ""}\`;
    }
    if (weeks > 0) {
        return \`\${weeks} week\${weeks > 1 ? "s" : ""}\`;
    }
    return \`\${remDays} day\${remDays > 1 ? "s" : ""}\`;
    // -------------------------------------------------------
};

// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { formatStorageTime } from "../utils/formatStorageTime";

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // ---------- Student's code starts from here ----------
        (async () => {
            const stored = await getFavorites();
            setIsFavorite(stored.some((f) => f.id === item.id));
        })();
        // -------------------------------------------------------
    }, [item.id]);

    const toggleFavorite = async () => {
        // ---------- Student's code starts from here ----------
        const stored = await getFavorites();
        const updated = isFavorite
            ? stored.filter((f) => f.id !== item.id)
            : [...stored, item];
        await saveFavorites(updated);
        setIsFavorite(!isFavorite);
        // -------------------------------------------------------
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{item.fruitName}</Text>
                <Text>Ripeness: {Math.round(item.ripeness * 100)}%</Text>
                <Text>Sweetness: {item.sweetness}</Text>
                <Text>Storage time: {formatStorageTime(item.storageTime)}</Text>
                <View style={styles.badgeRow}>
                    {item.colors.map((c) => (
                        <View key={c} style={styles.badge}><Text style={styles.badgeText}>{c}</Text></View>
                    ))}
                </View>
                <Text>Origin: {item.origin}</Text>
                <Ionicons name={item.isSeedless ? "checkmark-circle-outline" : "ellipse-outline"} size={20} />
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
    `<p>Unlike the sibling Origami paper's foldingTime rules (which had a self-contradicting example), <b>all three storageTime examples here already resolve singular/plural correctly</b> (10 → "1 week 3 days", 14 → "2 weeks", 5 → "5 days") — so <code>formatStorageTime</code> only needs to reproduce these three examples exactly with no interpretive judgment call needed, unlike its Origami counterpart. The days-based unit means the conversion divides by 7 (not 60), and the remainder-day count can itself be 0 (falling into the "only weeks" branch, e.g. 14) or the full days value can be under a week (falling into the "only days" branch, e.g. 5) — both branches must be reachable, not just the "both" case.</p>`,
    `<p>Khác quy tắc foldingTime của đề Origami song song (từng có ví dụ tự mâu thuẫn), <b>cả 3 ví dụ storageTime ở đây đều ĐÃ resolve đúng số ít/nhiều</b> (10 → "1 week 3 days", 14 → "2 weeks", 5 → "5 days") — nên <code>formatStorageTime</code> chỉ cần tái tạo đúng chính xác 3 ví dụ này, không cần phán đoán cách đọc như bản Origami. Đơn vị ngày nghĩa là quy đổi chia cho 7 (không phải 60), và số ngày dư có thể chính là 0 (rơi vào nhánh "chỉ tuần", VD 14) hoặc tổng số ngày có thể chưa tới 1 tuần (rơi vào nhánh "chỉ ngày", VD 5) — cả 2 nhánh đều phải chạm tới được, không chỉ nhánh "cả hai".</p>`,
  ),
  rubric: [
    { id: 'storage_time_conversion_correct', criterion: B('storageTime is converted to weeks/days matching exactly the paper\'s three examples (10 → "1 week 3 days", 14 → "2 weeks", 5 → "5 days").', 'storageTime quy đổi tuần/ngày khớp đúng chính xác 3 ví dụ đề (10 → "1 week 3 days", 14 → "2 weeks", 5 → "5 days").'), weight: 1, maxScore: 0.6 },
    { id: 'all_required_fields_shown', criterion: B('fruitName, ripeness (as %), the fruit image (reading imageUri), sweetness, colors (as badges/tags for multiple), origin, and isSeedless (styled like Home) are all displayed.', 'fruitName, ripeness (dạng %), ảnh trái cây (đọc imageUri), sweetness, colors (dạng badge/tag cho nhiều màu), origin, và isSeedless (style giống Home) đều được hiển thị.'), weight: 1, maxScore: 0.6 },
    { id: 'colors_shown_as_badges_for_multiple', criterion: B('When a fruit has more than one color, each is shown as a distinct badge/tag rather than a single joined string.', 'Khi trái cây có nhiều hơn 1 màu, mỗi màu hiện thành badge/tag riêng biệt thay vì 1 chuỗi nối liền.'), weight: 1, maxScore: 0.3 },
    { id: 'favorite_state_shown_and_toggleable', criterion: B('The current favorite state for this specific fruit is shown and can be toggled, persisting to AsyncStorage.', 'Trạng thái favorite của đúng trái cây này được hiện và đổi được, lưu vào AsyncStorage.'), weight: 1, maxScore: 0.25 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 4. Implement some actions at the Favorite screen.</strong></p><ul>` +
    `<li>(0.5 marks) On the Favorite screen, show the list of fruits stored in AsyncStorage.</li>` +
    `<li>(0.75 marks) Allow changing the favorite state of individual fruits or of all fruits (e.g., remove a single fruit or clear the entire list) by confirming a notification. The favorite list on the screen should update after the action is completed successfully.</li>` +
    `<li>(0.25 marks) Tapping a model's image should navigate to the Detail screen.</li></ul>`,
    `<p><strong>Task 4. Triển khai hành động ở màn hình Favorite.</strong></p><ul>` +
    `<li>(0.5 điểm) Ở Favorite, hiện danh sách trái cây lưu trong AsyncStorage.</li>` +
    `<li>(0.75 điểm) Cho đổi trạng thái favorite của 1 trái hoặc toàn bộ (VD xoá 1 trái hoặc xoá sạch danh sách) sau khi xác nhận 1 thông báo. Danh sách favorite phải cập nhật sau khi hành động hoàn tất.</li>` +
    `<li>(0.25 điểm) Bấm ảnh chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/FavoriteScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import FruitCard from "../components/FruitCard";

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
        return <View style={styles.empty}><Text>No favorite fruits</Text></View>;
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
                    <FruitCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
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
import FruitCard from "../components/FruitCard";

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
        Alert.alert("Confirm", "Remove this fruit from favorites?", [
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
        return <View style={styles.empty}><Text>No favorite fruits</Text></View>;
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
                    <FruitCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
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
    `<p>Every fruit shown here is already a favorite, so every action is a REMOVAL — both single-fruit removal (reusing <code>FruitCard</code>'s <code>onChangeFavList</code> unchanged from Home) and "Remove All" are wrapped in <code>Alert.alert</code>. <code>useFocusEffect</code> (not a mount-only effect) is required so a favorite added/removed from the Detail (Task 3) or Explore (Task 5) screen is reflected here the next time this tab regains focus.</p>`,
    `<p>Mọi trái hiện ở đây đã là favorite sẵn, nên mọi hành động đều là XOÁ — cả xoá 1 trái (tái dùng <code>onChangeFavList</code> của <code>FruitCard</code> nguyên vẹn từ Home) lẫn "Remove All" đều bọc trong <code>Alert.alert</code>. <code>useFocusEffect</code> (không phải effect chỉ chạy lúc mount) cần thiết để 1 favorite thêm/xoá từ màn hình Detail (Câu 3) hoặc Explore (Câu 5) phản ánh đúng ở đây lần kế tiếp tab này lấy lại focus.</p>`,
  ),
  rubric: [
    { id: 'lists_favorites_from_asyncstorage', criterion: B('The screen displays the fruit list stored in AsyncStorage, refreshed whenever the screen gains focus.', 'Màn hình hiện danh sách trái cây lưu trong AsyncStorage, nạp lại mỗi lần lấy lại focus.'), weight: 1, maxScore: 0.5 },
    { id: 'single_and_remove_all_with_confirmation', criterion: B('Both single-fruit removal and a "remove all" action are available, each requiring confirmation before the change takes effect.', 'Có cả xoá 1 trái và "remove all", mỗi hành động đều cần xác nhận trước khi có hiệu lực.'), weight: 1, maxScore: 0.6 },
    { id: 'list_updates_after_removal', criterion: B('The displayed list updates correctly after a confirmed removal (single or all).', 'Danh sách hiện đúng cập nhật sau khi xoá đã xác nhận (1 hoặc tất cả).'), weight: 1, maxScore: 0.15 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image navigates to the Detail screen.', 'Chạm ảnh điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.25 },
  ],
};

const q5 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Task 5. Implement some actions at the Explore screen.</strong></p><ul>` +
    `<li>(2.5 marks) On the Explore screen, show a list of fruits that meet the following conditions: exclude all fruits with origin "Vietnam"; storage time must be between 5 days and 6 weeks (inclusive); exclude all fruits that have Green in their colors list. After filtering, sort the results: first, by ripeness ascending (low to high); if two fruits have the same ripeness, sort by fruitName descending (Z to A).</li>` +
    `<li>(0.25 marks) Allow changing the favorite state of individual fruits with a confirmation dialog. The favorite list on the screen should update after the action is completed successfully.</li>` +
    `<li>(0.25 marks) Tapping a fruit's image or the fruitName title should navigate to the Detail screen.</li></ul>`,
    `<p><strong>Task 5. Triển khai hành động ở màn hình Explore.</strong></p><ul>` +
    `<li>(2.5 điểm) Ở Explore, hiện danh sách trái cây thoả điều kiện: loại trái có origin "Vietnam"; storageTime phải trong khoảng 5 ngày đến 6 tuần (2 đầu ĐÓNG); loại trái có Green trong danh sách colors. Sau khi lọc, sắp xếp: trước hết theo ripeness TĂNG dần (thấp→cao); nếu 2 trái cùng ripeness, sắp theo fruitName GIẢM dần (Z→A).</li>` +
    `<li>(0.25 điểm) Cho đổi trạng thái favorite của từng trái qua hộp thoại xác nhận. Danh sách favorite phải cập nhật sau khi hành động hoàn tất.</li>` +
    `<li>(0.25 điểm) Bấm ảnh hoặc tiêu đề fruitName chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/ExploreScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FruitAPI } from "../api/FruitAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import FruitCard from "../components/FruitCard";

const ExploreScreen = () => {
    const [fruits, setFruits] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, sort ----------

            // -------------------------------------------------------
        }, []),
    );

    const toggleFavorite = (item) => {
        // ---------- Student's code starts from here: confirm, then toggle + persist + update ----------

        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);

    return (
        <View style={styles.container}>
            <FlatList
                data={fruits}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <FruitCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default ExploreScreen;`,
  sampleSolution:
`// ===== src/screen/ExploreScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FruitAPI } from "../api/FruitAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import FruitCard from "../components/FruitCard";

const ExploreScreen = () => {
    const [fruits, setFruits] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, sort ----------
            (async () => {
                const api = new FruitAPI();
                const data = await api.getAllFruits();

                const filtered = data.filter(
                    (item) =>
                        item.origin !== "Vietnam" &&
                        item.storageTime >= 5 &&
                        item.storageTime <= 42 && // 6 weeks = 42 days
                        !item.colors.includes("Green"),
                );
                const sorted = filtered.sort((a, b) => {
                    if (a.ripeness !== b.ripeness) return a.ripeness - b.ripeness; // ascending
                    return b.fruitName.localeCompare(a.fruitName); // descending Z-A on tie
                });
                setFruits(sorted);
            })();
            (async () => {
                const stored = await getFavorites();
                setFavorites(stored);
            })();
            // -------------------------------------------------------
        }, []),
    );

    const toggleFavorite = (item) => {
        // ---------- Student's code starts from here: confirm, then toggle + persist + update ----------
        const exists = favorites.some((f) => f.id === item.id);
        Alert.alert(
            "Confirm",
            exists ? "Remove this fruit from favorites?" : "Add this fruit to favorites?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        const updated = exists
                            ? favorites.filter((f) => f.id !== item.id)
                            : [...favorites, item];
                        setFavorites(updated);
                        await saveFavorites(updated);
                    },
                },
            ],
        );
        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);

    return (
        <View style={styles.container}>
            <FlatList
                data={fruits}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <FruitCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default ExploreScreen;`,
  explanation: B(
    `<p><b>"Between 5 days and 6 weeks"</b> is read as an inclusive range on both ends (<code>storageTime &gt;= 5 &amp;&amp; storageTime &lt;= 42</code>, converting "6 weeks" to 42 days to match the field's own unit) — the paper doesn't say "exclusive." As with the sibling Origami paper's Explore screen, favorite changes here explicitly require a confirmation dialog EVEN WHEN ADDING (not just removing), matching this screen's own wording rather than the plain-toggle behavior described for Home. The sort is a genuine two-key comparator — ripeness ascending is the primary order, and fruitName descending only breaks ties, so sorting by name alone whenever ripeness matches would silently violate the primary ordering for every other pair. Dragon Fruit (origin "Vietnam") is excluded by the origin rule alone even though its colors list has no Green, while Mango (colors include "Green") is excluded by the color rule alone even though its origin isn't Vietnam — the three conditions are independent AND-combined filters, not alternatives.</p>`,
    `<p><b>"Trong khoảng 5 ngày đến 6 tuần"</b> đọc là khoảng ĐÓNG cả 2 đầu (<code>storageTime &gt;= 5 &amp;&amp; storageTime &lt;= 42</code>, quy đổi "6 tuần" thành 42 ngày khớp đơn vị field) — đề không nói "exclusive". Giống màn hình Explore của đề Origami song song, đổi favorite ở đây yêu cầu rõ hộp thoại xác nhận NGAY CẢ KHI THÊM (không chỉ xoá), khớp câu chữ riêng màn hình này chứ không phải hành vi toggle trơn mô tả cho Home. Sắp xếp là so sánh 2 KHOÁ thật — ripeness tăng dần là thứ tự chính, fruitName giảm dần chỉ phá hoà, nên sắp theo tên đơn thuần mỗi khi ripeness bằng nhau sẽ âm thầm phá vỡ thứ tự chính cho mọi cặp khác. Dragon Fruit (origin "Vietnam") bị loại chỉ vì quy tắc origin dù colors không có Green, còn Mango (colors có "Green") bị loại chỉ vì quy tắc màu dù origin không phải Vietnam — 3 điều kiện là lọc AND độc lập, không phải lựa chọn thay thế nhau.</p>`,
  ),
  rubric: [
    { id: 'excludes_vietnam_origin', criterion: B('Fruits with origin "Vietnam" are excluded.', 'Loại đúng trái có origin "Vietnam".'), weight: 1, maxScore: 0.5 },
    { id: 'storage_time_range_correct', criterion: B('Only fruits with storageTime between 5 and 42 days (6 weeks, converted to the field\'s own unit) are included.', 'Chỉ giữ trái storageTime trong khoảng 5 đến 42 ngày (6 tuần, quy đổi đúng đơn vị field).'), weight: 1, maxScore: 0.6 },
    { id: 'excludes_green_colors', criterion: B('Fruits with "Green" anywhere in their colors list are excluded.', 'Loại đúng trái có "Green" trong danh sách colors.'), weight: 1, maxScore: 0.5 },
    { id: 'two_key_sort_correct', criterion: B('Results are sorted primarily by ripeness ascending, with fruitName descending as the correct tiebreaker only when ripeness is equal.', 'Kết quả sắp trước hết theo ripeness tăng dần, fruitName giảm dần chỉ dùng làm tie-break đúng khi ripeness bằng nhau.'), weight: 1, maxScore: 0.6 },
    { id: 'favorite_toggle_requires_confirmation', criterion: B('Changing the favorite state of a fruit on this screen (whether adding or removing) requires confirmation via a dialog, and the list refreshes after the action completes.', 'Đổi trạng thái favorite của 1 trái ở màn hình này (thêm hay xoá) đều cần xác nhận qua hộp thoại, danh sách làm mới sau khi hoàn tất.'), weight: 1, maxScore: 0.4 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or fruitName title navigates to the Detail screen.', 'Chạm ảnh hoặc tiêu đề fruitName điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'MMA301' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE4',
    title: 'MMA301 – Practical Exam (Summer 2026, Paper 1), Fruit Catalog App|||MMA301 – Thi thực hành (Summer 2026, Đề 1), App Danh mục Trái cây',
    description: 'MMA301 PE (CODE): React Native + Expo app fetching from a MockAPI.io resource (Home/Favorite/Explore tabs, origin filter, favorites via AsyncStorage, Detail screen with a storage-time formatter, multi-condition Explore filter+two-key sort), AI-graded.|||PE MMA301 (viết mã): app React Native + Expo lấy dữ liệu từ resource MockAPI.io (tab Home/Favorite/Explore, lọc origin, favorite qua AsyncStorage, màn Detail định dạng thời gian bảo quản, lọc đa điều kiện+sắp 2 khoá ở Explore), chấm AI.',
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
