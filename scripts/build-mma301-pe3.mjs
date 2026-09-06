/**
 * build-mma301-pe3.mjs — sinh content/exams/MMA301-PE3.mjs.
 *
 * Nguồn thật: "MMA301 - FA25 - PE" (PE_MMA301_FA25) — app React
 * Native/Expo "Origami Model Catalog" (Home/Favorite/Explore, dữ liệu
 * MockAPI.io). Chỉ có data.json + 1 Note.docx tham khảo (boilerplate
 * hướng dẫn, KHÔNG phải solution) — tự thiết kế độc lập từ đặc tả đề,
 * đã đọc kỹ data.json xác nhận đúng tên field thật: modelName,
 * foldingTime (phút, số nguyên), difficulty, colors[], isSingleSheet,
 * imageUri, designer, progress (phân số 0-1).
 *
 * ⚠️ Task 3 (quy đổi foldingTime) TỰ MÂU THUẪN giữa 3 ví dụ của chính
 * đề: quy tắc 1 ("cả giờ lẫn phút") in ví dụ giữ NGUYÊN VĂN placeholder
 * "hour(s)"/"minute(s)" (80 → "1 hour(s) 20 minute(s)"), nhưng quy
 * tắc 2 ("chỉ giờ") và quy tắc 3 ("chỉ phút") lại RESOLVE đúng ngữ
 * pháp số ít/nhiều trong ví dụ của chính chúng (60 → "1 hour" — không
 * phải "1 hour(s)"; 50 → "50 minutes" — không phải "50 minute(s)").
 * Kết luận: ví dụ quy tắc 1 là lỗi đánh máy (quên resolve placeholder)
 * — đã cài đặt ĐÚNG NGỮ PHÁP số ít/nhiều nhất quán cho cả 3 quy tắc
 * (80 → "1 hour 20 minutes", khớp đúng tinh thần 2 ví dụ còn lại),
 * KHÔNG in nguyên văn "(s)" ra màn hình.
 *
 * ⚠️ Task 5 "between 5 minutes and 6 hours" hiểu là khoảng ĐÓNG cả 2
 * đầu (foldingTime ∈ [5, 360] phút) — quy ước phổ biến khi đề không
 * nói rõ "exclusive", đã ghi rõ giả định này trong explanation.
 *
 * Điểm gốc: Task1=0.75, Task2=3.0, Task3=1.75, Task4=1.5, Task5=3.0
 * (tổng đúng 10, không như PE2 vốn cộng dư 0.25).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MMA301-PE3.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/MMA301-PE3.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const appContext = B(
  `<div class="pe-system"><b>Origami model data shape (from data.json, imported into a MockAPI.io resource named after your roll number):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  modelName: string,
  foldingTime: number,       // minutes
  difficulty: string,        // "Easy" | "Medium" | "Hard"
  colors: string[],          // e.g. ["White", "Red"]
  isSingleSheet: boolean,
  imageUri: string,
  designer: string,
  progress: number,          // 0-1 fraction, display as a percentage (*100)
}</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu mẫu origami (từ data.json, nạp vào resource MockAPI.io đặt tên theo mã số sinh viên):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  modelName: string,
  foldingTime: number,       // phút
  difficulty: string,        // "Easy" | "Medium" | "Hard"
  colors: string[],          // VD ["White", "Red"]
  isSingleSheet: boolean,
  imageUri: string,
  designer: string,
  progress: number,          // phân số 0-1, hiện dạng % (*100)
}</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>MMA301 – Practical Exam (Fall 2025) — Origami Model Catalog app</strong>. Built with React Native + Expo, data fetched from a MockAPI.io resource, favorites stored locally with AsyncStorage. This exam room has no live Expo/device runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. Screen switching must be responsive (no noticeable lag). StudentCode is the roll number (e.g. se123456). A score of 0 is given for a program with syntax/compilation errors, for code unrelated to the test, or for not reading origami data from the data.json-sourced MockAPI resource with its endpoint in .env.</p>` + appContext,
  `<p><strong>MMA301 – Thi thực hành (Fall 2025) — App danh mục mẫu Origami</strong>. Xây bằng React Native + Expo, dữ liệu lấy từ resource MockAPI.io, favorite lưu cục bộ bằng AsyncStorage. Phòng thi này không có môi trường Expo/thiết bị sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Chuyển màn hình phải mượt (không lag rõ rệt). StudentCode là mã số sinh viên (VD se123456). Điểm 0 nếu chương trình có lỗi cú pháp/biên dịch, có code không liên quan đề, hoặc không đọc dữ liệu origami từ resource MockAPI nạp từ data.json với endpoint đặt trong .env.</p>` + appContext,
);

const q1 = {
  kind: 'CODE', points: 0.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 1. Create a new React Native application.</strong></p><ul>` +
    `<li>(0.5 marks) Build a new React Native application named after your StudentCode (e.g., se123456). The app must have three bottom tabs, and all screens must be switchable with a single touch.</li>` +
    `<li>(0.25 marks) Set up a resource on MockAPI.io to hold origami model data. The resource name must be your StudentCode.</li></ul>`,
    `<p><strong>Task 1. Tạo ứng dụng React Native mới.</strong></p><ul>` +
    `<li>(0.5 điểm) Tạo ứng dụng React Native mới đặt tên theo StudentCode (VD se123456). App phải có 3 tab dưới, mọi màn hình chuyển được chỉ với 1 lần chạm.</li>` +
    `<li>(0.25 điểm) Lập 1 resource trên MockAPI.io lưu dữ liệu mẫu origami. Tên resource phải là StudentCode.</li></ul>`,
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
EXPO_PUBLIC_BASEURL=https://673a1000000000000000001.mockapi.io

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
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Origami Details" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    // -------------------------------------------------------
};`,
  explanation: B(
    `<p>The three bottom tabs are named to match Task 2/4/5 exactly (Home, Favorite, Explore) — this is the first place that vocabulary is fixed, and every later screen's file name follows it. As in the sibling Jewelry Shop paper, the Detail screen is deliberately kept OUTSIDE the tab navigator (in the wrapping Stack) since every one of Home/Favorite/Explore needs to navigate into it while keeping its own tab bar visible until that navigation happens.</p>`,
    `<p>3 tab dưới đặt tên khớp đúng Task 2/4/5 (Home, Favorite, Explore) — đây là chỗ đầu tiên chốt tên gọi, và tên file mọi màn hình sau đều theo đúng. Giống đề Jewelry Shop song song trong môn, màn hình Detail cố ý nằm NGOÀI tab navigator (trong Stack bọc ngoài) vì cả Home/Favorite/Explore đều cần điều hướng vào đó trong khi vẫn giữ thanh tab riêng của nó cho tới lúc điều hướng.</p>`,
  ),
  rubric: [
    { id: 'app_named_after_student_code', criterion: B('The project/app is named after a roll-number-shaped StudentCode.', 'Dự án/app đặt tên theo StudentCode hợp lệ.'), weight: 1, maxScore: 0.15 },
    { id: 'three_bottom_tabs', criterion: B('The app uses a bottom tab navigator with exactly three tabs (Home, Favorite, Explore), each switchable in a single touch.', 'App dùng bottom tab navigator với đúng 3 tab (Home, Favorite, Explore), chuyển được chỉ 1 chạm.'), weight: 1, maxScore: 0.25 },
    { id: 'detail_screen_reachable', criterion: B('A Details screen exists and is reachable via navigation from within the tab screens.', 'Có màn hình Details và điều hướng được từ trong các tab.'), weight: 1, maxScore: 0.1 },
    { id: 'mockapi_resource_named_after_student_code', criterion: B('A MockAPI.io resource named after the StudentCode is set up to store origami data, referenced via an env-configured base URL.', 'Resource MockAPI.io đặt tên theo StudentCode được lập để lưu dữ liệu, tham chiếu qua base URL cấu hình bằng env.'), weight: 1, maxScore: 0.25 },
  ],
};

const q2 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Task 2. Implement actions on the Home screen.</strong></p><ul>` +
    `<li>(1.75 marks) Build the Home screen where users can filter origami models by choosing a designer. The data must include: modelName, imageUri, progress (displayed as a percentage, not a decimal value), isSingleSheet (visually highlighted, e.g. one icon for true/single-sheet, another icon for false/modular). The list, retrieved from MockAPI.io, must be shown in descending order of foldingTime and filtered by designer. Use Bottom Tabs to switch among Home, Favorite, Explore. Arrange and lay out this screen as neatly and efficiently as possible.</li>` +
    `<li>(0.25 marks) On the Home screen, clicking a model image or the modelName title should take the user to the Detail screen.</li>` +
    `<li>(1.0 marks) On the Home screen, implement the favorite list using AsyncStorage. When the favorite icon of a model is pressed, the origami model must be added to the favorite list.</li></ul>`,
    `<p><strong>Task 2. Triển khai hành động ở màn hình Home.</strong></p><ul>` +
    `<li>(1.75 điểm) Dựng màn hình Home cho phép lọc mẫu origami theo designer. Dữ liệu gồm: modelName, imageUri, progress (hiện dạng %, không phải số thập phân), isSingleSheet (làm nổi bật, VD 1 icon cho true/single-sheet, icon khác cho false/modular). Danh sách lấy từ MockAPI.io, sắp giảm dần theo foldingTime và lọc theo designer. Dùng Bottom Tabs chuyển giữa Home, Favorite, Explore. Bố trí màn hình này gọn gàng và hiệu quả nhất có thể.</li>` +
    `<li>(0.25 điểm) Ở Home, bấm ảnh mẫu hoặc tiêu đề modelName chuyển sang màn hình Detail.</li>` +
    `<li>(1.0 điểm) Ở Home, triển khai danh sách favorite bằng AsyncStorage. Bấm icon favorite của 1 mẫu thì thêm mẫu đó vào danh sách favorite.</li></ul>`,
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
import { OrigamiAPI } from "../api/OrigamiAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ModelCard from "../components/ModelCard";
import DesignerFilter from "../components/DesignerFilter";

const HomeScreen = () => {
    const [models, setModels] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedDesigner, setSelectedDesigner] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by foldingTime ----------

        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply designer filter ----------

        // -------------------------------------------------------
    }, [selectedDesigner, models]);

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);
    const designers = [...new Set(models.map((m) => m.designer))];

    return (
        <SafeAreaView style={styles.container}>
            <DesignerFilter data={designers} selected={selectedDesigner} onSelect={setSelectedDesigner} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ModelCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/ModelCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ModelCard = ({ item, favorite, onChangeFavList }) => {
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
                <Text style={styles.name}>{item.modelName}</Text>
                <View style={styles.row}>
                    <Text style={styles.progress}>
                        {/* ---------- Student's code starts from here: progress as % ---------- */}
                        {/* ------------------------------------------------------- */}
                    </Text>
                    <Ionicons
                        name={
                            // ---------- Student's code starts from here: distinct icon for single-sheet vs modular ----------
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
    progress: { fontSize: 12, color: "#2e7d32", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default ModelCard;`,
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
import { OrigamiAPI } from "../api/OrigamiAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ModelCard from "../components/ModelCard";
import DesignerFilter from "../components/DesignerFilter";

const HomeScreen = () => {
    const [models, setModels] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedDesigner, setSelectedDesigner] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by foldingTime ----------
        (async () => {
            const api = new OrigamiAPI();
            const data = await api.getAllModels();
            const sorted = [...data].sort((a, b) => b.foldingTime - a.foldingTime);
            setModels(sorted);
        })();
        (async () => {
            const stored = await getFavorites();
            setFavorites(stored);
        })();
        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply designer filter ----------
        if (!selectedDesigner) {
            setFiltered(models);
        } else {
            setFiltered(models.filter((m) => m.designer === selectedDesigner));
        }
        // -------------------------------------------------------
    }, [selectedDesigner, models]);

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
    const designers = [...new Set(models.map((m) => m.designer))];

    return (
        <SafeAreaView style={styles.container}>
            <DesignerFilter data={designers} selected={selectedDesigner} onSelect={setSelectedDesigner} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ModelCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/ModelCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ModelCard = ({ item, favorite, onChangeFavList }) => {
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
                <Text style={styles.name}>{item.modelName}</Text>
                <View style={styles.row}>
                    <Text style={styles.progress}>
                        {/* ---------- Student's code starts from here: progress as % ---------- */}
                        {Math.round(item.progress * 100)}%
                        {/* ------------------------------------------------------- */}
                    </Text>
                    <Ionicons
                        name={
                            // ---------- Student's code starts from here: distinct icon for single-sheet vs modular ----------
                            item.isSingleSheet ? "document-outline" : "grid-outline"
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
    progress: { fontSize: 12, color: "#2e7d32", fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default ModelCard;`,
  explanation: B(
    `<p>"Visually highlighted... one icon for true/single-sheet, another icon for false/modular" needs TWO distinct icon names picked by <code>item.isSingleSheet</code> — a single icon that merely appears/disappears would not satisfy "another icon for false", since that leaves the false case with nothing to see rather than a distinct visual. <code>ModelCard</code> is written once here and reused unchanged by Favorite (Task 4) and Explore (Task 5), so the progress-as-percentage and single-sheet-icon logic only needs to be correct in this one place for every other screen to inherit it correctly.</p>`,
    `<p>"Làm nổi bật... 1 icon cho true/single-sheet, icon khác cho false/modular" cần HAI icon riêng biệt chọn theo <code>item.isSingleSheet</code> — 1 icon chỉ hiện/ẩn thôi chưa thoả "icon khác cho false", vì trường hợp false sẽ không có gì để thấy thay vì 1 hình ảnh riêng biệt. <code>ModelCard</code> viết đúng 1 lần ở đây và Favorite (Câu 4)/Explore (Câu 5) tái dùng nguyên vẹn, nên logic progress-thành-% và icon single-sheet chỉ cần đúng đúng 1 chỗ để mọi màn hình khác thừa hưởng đúng.</p>`,
  ),
  rubric: [
    { id: 'fetches_sorts_filters_correctly', criterion: B('Models are fetched from MockAPI, correctly filtered by the selected designer, and sorted in descending order by foldingTime.', 'Mẫu lấy từ MockAPI, lọc đúng theo designer đã chọn, sắp giảm dần theo foldingTime.'), weight: 1, maxScore: 1 },
    { id: 'progress_percentage_and_singlesheet_icon', criterion: B('progress is displayed as a percentage (not the raw decimal), and isSingleSheet true/false uses two visually distinct icons.', 'progress hiện dạng % (không phải số thập phân thô), và isSingleSheet true/false dùng 2 icon phân biệt rõ.'), weight: 1, maxScore: 0.6 },
    { id: 'shows_modelname_and_image', criterion: B('Each item shows at least modelName and imageUri.', 'Mỗi item hiện ít nhất modelName và imageUri.'), weight: 1, maxScore: 0.3 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or the modelName title navigates to the Detail screen for that item.', 'Chạm ảnh hoặc tiêu đề modelName điều hướng sang màn hình Detail đúng item.'), weight: 1, maxScore: 0.5 },
    { id: 'favorite_toggle_persists_to_asyncstorage', criterion: B('Pressing the favorite icon correctly adds the model to an AsyncStorage-backed favorite list.', 'Bấm icon favorite thêm đúng mẫu vào danh sách favorite lưu qua AsyncStorage.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.75, language: 'javascript',
  prompt: B(
    `<p><strong>Task 3. Implement actions on the Detail screen (1.75 marks).</strong></p>` +
    `<p>Show all origami information: modelName, progress (displayed as a percentage), imageUri (rendered as an image), difficulty (Easy, Medium, Hard), foldingTime (convert from minutes into hours and minutes, using the rules: if both hours and minutes exist, show as "X hour(s) Y minute(s)" — e.g. 80 → "1 hour 20 minutes"; if only hours exist, show as "X hour(s)" — e.g. 60 → "1 hour"; if only minutes exist, show as "X minute(s)" — e.g. 50 → "50 minutes"), colors (shown as badges or tags for multiple colors), designer, isSingleSheet (styled the same as on the Home screen). Additionally: display the favorite state, and allow toggling the favorite state (add/remove from Favorite list). Arrange and lay out this screen as neatly and efficiently as possible.</p>`,
    `<p><strong>Task 3. Triển khai hành động ở màn hình Detail (1.75 điểm).</strong></p>` +
    `<p>Hiện đầy đủ thông tin origami: modelName, progress (hiện %), imageUri (render dạng ảnh), difficulty (Easy, Medium, Hard), foldingTime (quy đổi phút thành giờ+phút theo quy tắc: nếu có cả giờ lẫn phút, hiện "X hour(s) Y minute(s)" — VD 80 → "1 hour 20 minutes"; nếu chỉ có giờ, hiện "X hour(s)" — VD 60 → "1 hour"; nếu chỉ có phút, hiện "X minute(s)" — VD 50 → "50 minutes"), colors (hiện dạng badge/tag cho nhiều màu), designer, isSingleSheet (style giống màn Home). Thêm nữa: hiện trạng thái favorite, và cho đổi trạng thái favorite (thêm/xoá khỏi danh sách Favorite). Bố trí màn hình này gọn gàng và hiệu quả nhất có thể.</p>`,
  ),
  starterCode:
`// ===== src/utils/formatFoldingTime.js =====
export const formatFoldingTime = (minutes) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { formatFoldingTime } from "../utils/formatFoldingTime";

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
                <Text style={styles.name}>{item.modelName}</Text>
                <Text>Progress: {Math.round(item.progress * 100)}%</Text>
                <Text>Difficulty: {item.difficulty}</Text>
                <Text>Folding time: {formatFoldingTime(item.foldingTime)}</Text>
                <View style={styles.badgeRow}>
                    {item.colors.map((c) => (
                        <View key={c} style={styles.badge}><Text style={styles.badgeText}>{c}</Text></View>
                    ))}
                </View>
                <Text>Designer: {item.designer}</Text>
                <Ionicons name={item.isSingleSheet ? "document-outline" : "grid-outline"} size={20} />
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
`// ===== src/utils/formatFoldingTime.js =====
export const formatFoldingTime = (minutes) => {
    // ---------- Student's code starts from here ----------
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
        return \`\${hours} hour\${hours > 1 ? "s" : ""} \${mins} minute\${mins > 1 ? "s" : ""}\`;
    }
    if (hours > 0) {
        return \`\${hours} hour\${hours > 1 ? "s" : ""}\`;
    }
    return \`\${mins} minute\${mins > 1 ? "s" : ""}\`;
    // -------------------------------------------------------
};

// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { formatFoldingTime } from "../utils/formatFoldingTime";

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // ---------- Student's code starts from here ----------
        (async () => {
            const stored = await getFavorites();
            setIsFavorite(stored.some((m) => m.id === item.id));
        })();
        // -------------------------------------------------------
    }, [item.id]);

    const toggleFavorite = async () => {
        // ---------- Student's code starts from here ----------
        const stored = await getFavorites();
        const updated = isFavorite
            ? stored.filter((m) => m.id !== item.id)
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
                <Text style={styles.name}>{item.modelName}</Text>
                <Text>Progress: {Math.round(item.progress * 100)}%</Text>
                <Text>Difficulty: {item.difficulty}</Text>
                <Text>Folding time: {formatFoldingTime(item.foldingTime)}</Text>
                <View style={styles.badgeRow}>
                    {item.colors.map((c) => (
                        <View key={c} style={styles.badge}><Text style={styles.badgeText}>{c}</Text></View>
                    ))}
                </View>
                <Text>Designer: {item.designer}</Text>
                <Ionicons name={item.isSingleSheet ? "document-outline" : "grid-outline"} size={20} />
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
    `<p><b>The paper's own three worked examples for foldingTime disagree with each other on whether "(s)" is printed literally.</b> Rule 1's example ("80 → 1 hour(s) 20 minute(s)") keeps the raw placeholder, while rule 2's ("60 → 1 hour") and rule 3's ("50 → 50 minutes") both resolve it to proper singular/plural — since two of the three examples clearly show real grammar and only one keeps the placeholder, the placeholder is read as a leftover typo, not the intended output. The implementation therefore ALWAYS resolves singular/plural (<code>hour</code>/<code>hours</code>, <code>minute</code>/<code>minutes</code>) consistently across all three branches, which reproduces rules 2 and 3's examples exactly and produces "1 hour 20 minutes" (not "1 hour(s) 20 minute(s)") for rule 1's case — the grammatically consistent reading, not a literal transcription of every character in the prompt.</p>`,
    `<p><b>3 ví dụ minh hoạ của chính đề cho foldingTime TỰ MÂU THUẪN nhau về việc "(s)" có in nguyên văn hay không.</b> Ví dụ quy tắc 1 ("80 → 1 hour(s) 20 minute(s)") giữ nguyên placeholder thô, còn ví dụ quy tắc 2 ("60 → 1 hour") và quy tắc 3 ("50 → 50 minutes") đều resolve đúng ngữ pháp số ít/nhiều — vì 2/3 ví dụ rõ ràng cho ngữ pháp thật và chỉ 1 giữ placeholder, placeholder đó được đọc là lỗi đánh máy sót lại, không phải kết quả mong muốn thật. Cài đặt vì vậy LUÔN resolve số ít/nhiều (<code>hour</code>/<code>hours</code>, <code>minute</code>/<code>minutes</code>) nhất quán ở cả 3 nhánh, tái tạo đúng ví dụ quy tắc 2 và 3, và cho ra "1 hour 20 minutes" (không phải "1 hour(s) 20 minute(s)") cho trường hợp quy tắc 1 — cách đọc nhất quán về ngữ pháp, không phải chép nguyên văn từng ký tự của đề bài.</p>`,
  ),
  rubric: [
    { id: 'folding_time_conversion_correct', criterion: B('foldingTime is converted to hours/minutes using grammatically consistent singular/plural output across all three cases (both, hours-only, minutes-only), matching the paper\'s "60 → 1 hour" and "50 → 50 minutes" examples exactly.', 'foldingTime quy đổi giờ/phút với ngữ pháp số ít/nhiều nhất quán ở cả 3 trường hợp (cả hai, chỉ giờ, chỉ phút), khớp đúng ví dụ đề "60 → 1 hour" và "50 → 50 minutes".'), weight: 1, maxScore: 0.6 },
    { id: 'all_required_fields_shown', criterion: B('modelName, progress (as %), imageUri, difficulty, colors (as badges/tags for multiple), designer, and isSingleSheet (styled like Home) are all displayed.', 'modelName, progress (dạng %), imageUri, difficulty, colors (dạng badge/tag cho nhiều màu), designer, và isSingleSheet (style giống Home) đều được hiển thị.'), weight: 1, maxScore: 0.6 },
    { id: 'colors_shown_as_badges_for_multiple', criterion: B('When a model has more than one color, each is shown as a distinct badge/tag rather than a single joined string.', 'Khi mẫu có nhiều hơn 1 màu, mỗi màu hiện thành badge/tag riêng biệt thay vì 1 chuỗi nối liền.'), weight: 1, maxScore: 0.3 },
    { id: 'favorite_state_shown_and_toggleable', criterion: B('The current favorite state for this specific model is shown and can be toggled, persisting to AsyncStorage.', 'Trạng thái favorite của đúng mẫu này được hiện và đổi được, lưu vào AsyncStorage.'), weight: 1, maxScore: 0.25 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 4. Implement some actions at the Favorite screen.</strong></p><ul>` +
    `<li>(0.5 marks) On the Favorite screen, show the list of origami models saved in AsyncStorage.</li>` +
    `<li>(0.75 marks) Let the user change the favorite state of one model or of all models (e.g., remove a single model or clear the whole list) after confirming a notification. The screen must update the favorite list once the action completes successfully.</li>` +
    `<li>(0.25 marks) Clicking a model's image should take the user to the Detail screen.</li></ul>`,
    `<p><strong>Task 4. Triển khai hành động ở màn hình Favorite.</strong></p><ul>` +
    `<li>(0.5 điểm) Ở Favorite, hiện danh sách mẫu origami lưu trong AsyncStorage.</li>` +
    `<li>(0.75 điểm) Cho đổi trạng thái favorite của 1 mẫu hoặc toàn bộ (VD xoá 1 mẫu hoặc xoá sạch danh sách) sau khi xác nhận 1 thông báo. Màn hình phải cập nhật danh sách favorite ngay sau khi hành động hoàn tất.</li>` +
    `<li>(0.25 điểm) Bấm ảnh mẫu chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/FavoriteScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ModelCard from "../components/ModelCard";

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
        return <View style={styles.empty}><Text>No favorite models</Text></View>;
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
                    <ModelCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
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
import ModelCard from "../components/ModelCard";

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
        Alert.alert("Confirm", "Remove this model from favorites?", [
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
        return <View style={styles.empty}><Text>No favorite models</Text></View>;
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
                    <ModelCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
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
    `<p>Every model shown here is already a favorite, so every action on this screen is a REMOVAL — both the single-model removal (reusing <code>ModelCard</code>'s <code>onChangeFavList</code> unchanged from Home) and "Remove All" are wrapped in <code>Alert.alert</code>, matching "after confirming a notification" for this screen. <code>useFocusEffect</code> (not a mount-only effect) is required because a favorite added or removed from the Detail screen (Task 3) or Explore screen (Task 5) must be reflected here the next time this tab regains focus.</p>`,
    `<p>Mọi mẫu hiện ở đây đã là favorite sẵn, nên mọi hành động ở màn hình này đều là XOÁ — cả xoá 1 mẫu (tái dùng <code>onChangeFavList</code> của <code>ModelCard</code> nguyên vẹn từ Home) lẫn "Remove All" đều bọc trong <code>Alert.alert</code>, khớp đúng "sau khi xác nhận 1 thông báo" của màn hình này. <code>useFocusEffect</code> (không phải effect chỉ chạy lúc mount) cần thiết vì 1 favorite thêm/xoá từ màn hình Detail (Câu 3) hoặc Explore (Câu 5) phải phản ánh đúng ở đây lần kế tiếp tab này lấy lại focus.</p>`,
  ),
  rubric: [
    { id: 'lists_favorites_from_asyncstorage', criterion: B('The screen displays the model list stored in AsyncStorage, refreshed whenever the screen gains focus.', 'Màn hình hiện danh sách mẫu lưu trong AsyncStorage, nạp lại mỗi lần lấy lại focus.'), weight: 1, maxScore: 0.5 },
    { id: 'single_and_remove_all_with_confirmation', criterion: B('Both single-model removal and a "remove all" action are available, each requiring confirmation before the change takes effect.', 'Có cả xoá 1 mẫu và "remove all", mỗi hành động đều cần xác nhận trước khi có hiệu lực.'), weight: 1, maxScore: 0.6 },
    { id: 'list_updates_after_removal', criterion: B('The displayed list updates correctly after a confirmed removal (single or all).', 'Danh sách hiện đúng cập nhật sau khi xoá đã xác nhận (1 hoặc tất cả).'), weight: 1, maxScore: 0.15 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image navigates to the Detail screen.', 'Chạm ảnh điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.25 },
  ],
};

const q5 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Task 5. Implement some actions at the Explore screen.</strong></p><ul>` +
    `<li>(2.5 marks) On the Explore screen, show a list of origami models meeting the conditions below: exclude all models designed by "Traditional"; folding time must be between 5 minutes and 6 hours (inclusive); exclude all models that have Green in their colors list. After filtering, arrange the results in the following order: first, by progress ascending (low to high); if two models have the same progress, sort by modelName descending (Z to A).</li>` +
    `<li>(0.25 marks) Allow the favorite state of individual models to be changed via a confirmation dialog. The screen must refresh the favorite list after the action completes successfully.</li>` +
    `<li>(0.25 marks) Clicking a model's image or the modelName title should take the user to the Detail screen.</li></ul>`,
    `<p><strong>Task 5. Triển khai hành động ở màn hình Explore.</strong></p><ul>` +
    `<li>(2.5 điểm) Ở Explore, hiện danh sách mẫu origami thoả các điều kiện: loại mẫu do "Traditional" thiết kế; foldingTime phải trong khoảng 5 phút đến 6 giờ (2 đầu ĐÓNG); loại mẫu có màu Green trong danh sách colors. Sau khi lọc, sắp xếp: trước hết theo progress TĂNG dần (thấp→cao); nếu 2 mẫu cùng progress, sắp theo modelName GIẢM dần (Z→A).</li>` +
    `<li>(0.25 điểm) Cho đổi trạng thái favorite của từng mẫu qua hộp thoại xác nhận. Màn hình phải làm mới danh sách favorite sau khi hành động hoàn tất.</li>` +
    `<li>(0.25 điểm) Bấm ảnh mẫu hoặc tiêu đề modelName chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/ExploreScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { OrigamiAPI } from "../api/OrigamiAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ModelCard from "../components/ModelCard";

const ExploreScreen = () => {
    const [models, setModels] = useState([]);
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
                data={models}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <ModelCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
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
import { OrigamiAPI } from "../api/OrigamiAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import ModelCard from "../components/ModelCard";

const ExploreScreen = () => {
    const [models, setModels] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, sort ----------
            (async () => {
                const api = new OrigamiAPI();
                const data = await api.getAllModels();

                const filtered = data.filter(
                    (item) =>
                        item.designer !== "Traditional" &&
                        item.foldingTime >= 5 &&
                        item.foldingTime <= 360 && // 6 hours = 360 minutes
                        !item.colors.includes("Green"),
                );
                const sorted = filtered.sort((a, b) => {
                    if (a.progress !== b.progress) return a.progress - b.progress; // ascending
                    return b.modelName.localeCompare(a.modelName); // descending Z-A on tie
                });
                setModels(sorted);
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
            exists ? "Remove this model from favorites?" : "Add this model to favorites?",
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
                data={models}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <ModelCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default ExploreScreen;`,
  explanation: B(
    `<p><b>"Between 5 minutes and 6 hours"</b> is read as an inclusive range on both ends (<code>foldingTime &gt;= 5 &amp;&amp; foldingTime &lt;= 360</code>, converting "6 hours" to 360 minutes to match the field's own unit) — the paper doesn't say "exclusive," and treating boundary values as valid is the more common convention when a range's edges aren't explicitly excluded. Unlike Home/Favorite (where the favorite icon acts immediately, or the action is always a removal), <b>Explore explicitly requires a confirmation dialog even for ADDING a favorite here</b> — this screen's own wording says "allow the favorite state... to be changed... via a confirmation dialog" without carving out an exception for adding, unlike the Home/Premiere-style screens elsewhere in this course that only ever describe confirmation for removal. The sort is a genuine two-key comparator (progress ascending first, modelName descending only as a tiebreaker) — sorting by modelName alone whenever progress ties would silently violate the primary ascending-progress ordering for every other pair.</p>`,
    `<p><b>"Trong khoảng 5 phút đến 6 giờ"</b> đọc là khoảng ĐÓNG cả 2 đầu (<code>foldingTime &gt;= 5 &amp;&amp; foldingTime &lt;= 360</code>, quy đổi "6 giờ" thành 360 phút khớp đơn vị field) — đề không nói "exclusive", và coi giá trị biên là hợp lệ là quy ước phổ biến hơn khi đề không loại trừ rõ 2 đầu. Khác Home/Favorite (icon favorite tác dụng ngay, hoặc hành động luôn là xoá), <b>Explore yêu cầu rõ hộp thoại xác nhận NGAY CẢ KHI THÊM favorite ở đây</b> — câu chữ riêng màn hình này ghi "cho đổi trạng thái favorite... qua hộp thoại xác nhận" không loại trừ trường hợp thêm, khác các màn hình kiểu Home/Premiere khác trong môn chỉ mô tả xác nhận cho hành động xoá. Sắp xếp là so sánh 2 KHOÁ thật (progress tăng dần trước, modelName giảm dần chỉ là tie-break) — sắp theo modelName đơn thuần mỗi khi progress bằng nhau sẽ âm thầm phá vỡ thứ tự tăng dần chính cho mọi cặp khác.</p>`,
  ),
  rubric: [
    { id: 'excludes_traditional_designer', criterion: B('Models designed by "Traditional" are excluded.', 'Loại đúng mẫu do "Traditional" thiết kế.'), weight: 1, maxScore: 0.5 },
    { id: 'folding_time_range_correct', criterion: B('Only models with foldingTime between 5 and 360 minutes (6 hours, converted to the field\'s own unit) are included.', 'Chỉ giữ mẫu foldingTime trong khoảng 5 đến 360 phút (6 giờ, quy đổi đúng đơn vị field).'), weight: 1, maxScore: 0.6 },
    { id: 'excludes_green_colors', criterion: B('Models with "Green" anywhere in their colors list are excluded.', 'Loại đúng mẫu có "Green" trong danh sách colors.'), weight: 1, maxScore: 0.5 },
    { id: 'two_key_sort_correct', criterion: B('Results are sorted primarily by progress ascending, with modelName descending as the correct tiebreaker only when progress is equal.', 'Kết quả sắp trước hết theo progress tăng dần, modelName giảm dần chỉ dùng làm tie-break đúng khi progress bằng nhau.'), weight: 1, maxScore: 0.6 },
    { id: 'favorite_toggle_requires_confirmation', criterion: B('Changing the favorite state of a model on this screen (whether adding or removing) requires confirmation via a dialog, and the list refreshes after the action completes.', 'Đổi trạng thái favorite của 1 mẫu ở màn hình này (thêm hay xoá) đều cần xác nhận qua hộp thoại, danh sách làm mới sau khi hoàn tất.'), weight: 1, maxScore: 0.4 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or modelName title navigates to the Detail screen.', 'Chạm ảnh hoặc tiêu đề modelName điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'MMA301' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE3',
    title: 'MMA301 – Practical Exam (Fall 2025), Origami Model Catalog App|||MMA301 – Thi thực hành (Fall 2025), App Danh mục Origami',
    description: 'MMA301 PE (CODE): React Native + Expo app fetching from a MockAPI.io resource (Home/Favorite/Explore tabs, designer filter, favorites via AsyncStorage, Detail screen with a folding-time formatter, multi-condition Explore filter+two-key sort), AI-graded.|||PE MMA301 (viết mã): app React Native + Expo lấy dữ liệu từ resource MockAPI.io (tab Home/Favorite/Explore, lọc designer, favorite qua AsyncStorage, màn Detail định dạng thời gian gấp, lọc đa điều kiện+sắp 2 khoá ở Explore), chấm AI.',
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
