/**
 * build-mma301-pe5.mjs — sinh content/exams/MMA301-PE5.mjs.
 *
 * Nguồn thật: "MMA301 - SU 2024 - PE" (MMA301PE_20240701) — app React
 * Native/Expo "Football Player Catalog" (Home/Favorite/Captains). Có
 * 1 bài làm SINH VIÊN THẬT đính kèm (thư mục tên
 * "PE_MMA301_SE150473_TranNguyenAnhHao" — mã số + tên thật, không
 * phải "given" mẫu) — đã đọc kỹ, đối chiếu paper.pdf + data.json, và
 * bắt được NHIỀU lỗi/thiếu sót thật (không copy mù):
 *
 * ⚠️ LỖI 1 (nghiêm trọng, lặp lại ở 3 nơi): tuổi tính bằng
 * `2024 - value.YoB` — NĂM HIỆN TẠI GẮN CỨNG 2024 (năm thi), không
 * phải `new Date().getFullYear() - YoB`. Bài làm sẽ tính SAI tuổi mọi
 * lúc chấm sau năm 2024. Đã sửa dùng năm động ở cả Home/Detail/
 * Captains.
 * ⚠️ LỖI 2: Home screen KHÔNG CÓ lọc theo team nào — Task 2.1 yêu cầu
 * rõ "players are filtered by pressing on a team", bài làm chỉ liệt
 * nguyên danh sách không lọc. Đã tự viết TeamFilter (giống
 * DesignerFilter/OriginFilter các đề MMA301 khác trong môn).
 * ⚠️ LỖI 3 (Task 3): isCaptain=true phải "style as a special icon"
 * ở Detail — bài làm chỉ hiện chữ "Yes"/"No" thô, không có icon nào.
 * Đã tự thêm icon huy hiệu riêng cho true.
 * ⚠️ LỖI 4 (Task 5, quan trọng nhất): đề yêu cầu "Implement the
 * AUTOMATIC sorting function (ascending)" cho Captains — bài làm lại
 * bắt người dùng BẤM NÚT xoay vòng 3 trạng thái (none→tăng→giảm→none)
 * mới sắp xếp, KHÔNG "tự động" chút nào. Đã sửa: danh sách Captains
 * LUÔN tự sắp tăng dần theo MinutesPlayed ngay khi tải, không cần
 * thao tác gì.
 *
 * ⚠️ Task 1.1 bị MẤT SỐ ĐIỂM do lỗi scan/OCR ("(? mark)") — suy ra
 * = 0.75 từ tổng các mục còn lại đã đọc được cộng lại đúng 9.25, và
 * tổng đề chuẩn là 10 (khớp mẫu Task1 luôn 0.75 ở mọi đề MMA301 khác
 * trong môn) — ghi rõ đây là SUY LUẬN, không phải số đọc được trực
 * tiếp từ scan.
 *
 * Điểm gốc: Task1=0.75+0.25=1.0(suy luận), Task2=3.5, Task3=1.0,
 * Task4=1.5, Task5=3.0 (tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MMA301-PE5.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/MMA301-PE5.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const appContext = B(
  `<div class="pe-system"><b>Player data shape (from data.json, imported into a MockAPI.io resource named after your member code/username):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  playerName: string,
  YoB: number,             // year of birth — NOTE: the paper's "age" is computed from this, not stored directly
  MinutesPlayed: number,
  position: string,
  isCaptain: boolean,
  image: string,
  team: string,
  PassingAccuracy: number, // 0-1 fraction, display as a percentage (*100)
}</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu cầu thủ (từ data.json, nạp vào resource MockAPI.io đặt tên theo mã thành viên/username):</b>` +
  `<pre><code class="language-javascript">{
  id: string,
  playerName: string,
  YoB: number,             // năm sinh — LƯU Ý: "age" đề nói phải TÍNH từ đây, không phải field lưu sẵn
  MinutesPlayed: number,
  position: string,
  isCaptain: boolean,
  image: string,
  team: string,
  PassingAccuracy: number, // phân số 0-1, hiện dạng % (*100)
}</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>MMA301 – Practical Exam (Summer 2024) — Football Player Catalog app</strong>. Built with React Native + Expo, player data fetched from a MockAPI.io resource, favorites stored locally with AsyncStorage. This exam room has no live Expo/device runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. Screens must switch back and forth quickly. A score of 0 is given for a program with syntax/compilation errors, or for code unrelated to the test.</p>` + appContext,
  `<p><strong>MMA301 – Thi thực hành (Summer 2024) — App danh mục cầu thủ bóng đá</strong>. Xây bằng React Native + Expo, dữ liệu cầu thủ lấy từ resource MockAPI.io, favorite lưu cục bộ bằng AsyncStorage. Phòng thi này không có môi trường Expo/thiết bị sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Màn hình phải chuyển qua lại nhanh. Điểm 0 nếu chương trình có lỗi cú pháp/biên dịch, hoặc có code không liên quan đề.</p>` + appContext,
);

const q1 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 1. Set up the application.</strong></p><ul>` +
    `<li>(0.75 marks — inferred, see note) Set up a React Native application with the required number of screens. Your app includes 3 Bottom Tabs, and all screens must be switchable to each other with one touch.</li>` +
    `<li>(0.25 mark) Create a resource on the mockapi.io tool that stores the player data. The resource name must be your member code or username (the username used to log in to PEA or EOS).</li></ul>` +
    `<p><i>Note: the paper's scan is illegible for the exact point value of the first bullet ("? mark") — 0.75 is inferred so the five tasks sum to the standard 10, matching every sibling MMA301 paper's Task 1 total.</i></p>`,
    `<p><strong>Task 1. Thiết lập ứng dụng.</strong></p><ul>` +
    `<li>(0.75 điểm — suy luận, xem ghi chú) Thiết lập ứng dụng React Native với đủ số màn hình cần thiết. App có 3 Bottom Tabs, mọi màn hình chuyển được sang nhau chỉ 1 lần chạm.</li>` +
    `<li>(0.25 điểm) Tạo 1 resource trên mockapi.io lưu dữ liệu cầu thủ. Tên resource phải là mã thành viên hoặc username (username đăng nhập PEA hoặc EOS).</li></ul>` +
    `<p><i>Ghi chú: bản scan của đề bị mờ không đọc được đúng điểm của mục đầu ("? mark") — suy ra 0.75 để tổng 5 Task = 10 chuẩn, khớp đúng Task 1 của mọi đề MMA301 khác trong môn.</i></p>`,
  ),
  starterCode:
`// ===== .env =====
EXPO_PUBLIC_BASEURL=https://<your-mockapi-project-id>.mockapi.io

// ===== package.json (relevant excerpt) =====
{
  "name": "se150473",
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
EXPO_PUBLIC_BASEURL=https://6661a66863e6a0189feaed91.mockapi.io

// ===== package.json (relevant excerpt) =====
{
  "name": "se150473",
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
import CaptainsScreen from "../screen/CaptainsScreen";
import DetailsScreen from "../screen/DetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
    // ---------- Student's code starts from here ----------
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorite" component={FavoriteScreen} />
            <Tab.Screen name="Captains" component={CaptainsScreen} />
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
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Player Details" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    // -------------------------------------------------------
};`,
  explanation: B(
    `<p>Three bottom tabs (Home, Favorite, Captains) fixed here become the vocabulary every later task's screen file follows, and the Detail screen is kept OUTSIDE the tab navigator in the wrapping Stack — the real student submission for this exact paper skipped naming things this clearly (its screens were literally called "Product"/"Page3"/"Like", leftovers from an unrelated e-commerce template), which made every later requirement harder to verify against the paper's own vocabulary.</p>`,
    `<p>3 tab dưới (Home, Favorite, Captains) chốt ở đây trở thành tên gọi mọi file màn hình câu sau theo đúng, và màn hình Detail nằm NGOÀI tab navigator trong Stack bọc ngoài — bài làm sinh viên thật cho đúng đề này lại KHÔNG đặt tên rõ ràng vậy (màn hình của họ gọi thẳng "Product"/"Page3"/"Like", còn sót từ template thương mại điện tử không liên quan), khiến mọi yêu cầu sau khó đối chiếu với đúng tên gọi của đề.</p>`,
  ),
  rubric: [
    { id: 'three_bottom_tabs', criterion: B('The app uses a bottom tab navigator with exactly three tabs (Home, Favorite, Captains), each switchable in a single touch.', 'App dùng bottom tab navigator với đúng 3 tab (Home, Favorite, Captains), chuyển được chỉ 1 chạm.'), weight: 1, maxScore: 0.4 },
    { id: 'detail_screen_reachable', criterion: B('A Details screen exists and is reachable via navigation from within the tab screens.', 'Có màn hình Details và điều hướng được từ trong các tab.'), weight: 1, maxScore: 0.35 },
    { id: 'mockapi_resource_named_after_member_code', criterion: B('A MockAPI.io resource named after the member code/username is set up to store player data, referenced via an env-configured base URL.', 'Resource MockAPI.io đặt tên theo mã thành viên/username được lập để lưu dữ liệu cầu thủ, tham chiếu qua base URL cấu hình bằng env.'), weight: 1, maxScore: 0.25 },
  ],
};

const q2 = {
  kind: 'CODE', points: 3.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 2. Implement some actions on the Home screen.</strong></p><ul>` +
    `<li>(2.0 marks) Build the Home screen. On this screen, players are filtered by pressing on a team. The data includes: playerName, isCaptain, image, position, age (the age value, not the year of birth). The isCaptain value and the favorite state must stand out. This screen displays the full players list, in descending order by id, belonging to their team, with the favorite state loaded from AsyncStorage. Use the Bottom Tabs to switch between the 3 screens: Home, Favorite and Captains. Design and arrange this component as well as possible.</li>` +
    `<li>(0.5 mark) On the Home screen, pressing the player's image or the playerName title switches to the Detail screen.</li>` +
    `<li>(1.0 mark) On the Home screen, use AsyncStorage to implement the favorite list. Pressing the favorite icon on a player view adds that player to the favorite list.</li></ul>`,
    `<p><strong>Task 2. Triển khai hành động ở màn hình Home.</strong></p><ul>` +
    `<li>(2.0 điểm) Dựng màn hình Home. Ở màn hình này, cầu thủ được lọc bằng cách bấm vào 1 team. Dữ liệu gồm: playerName, isCaptain, image, position, age (giá trị tuổi, không phải năm sinh). isCaptain và trạng thái favorite phải NỔI BẬT. Màn hình hiện đủ danh sách cầu thủ, sắp giảm dần theo id, thuộc đúng team đã chọn, trạng thái favorite lấy từ AsyncStorage. Dùng Bottom Tabs chuyển giữa 3 màn hình: Home, Favorite, Captains. Thiết kế/bố trí component này tốt nhất có thể.</li>` +
    `<li>(0.5 điểm) Ở Home, bấm ảnh cầu thủ hoặc tiêu đề playerName chuyển sang màn hình Detail.</li>` +
    `<li>(1.0 điểm) Ở Home, dùng AsyncStorage triển khai danh sách favorite. Bấm icon favorite của 1 cầu thủ thì thêm cầu thủ đó vào danh sách favorite.</li></ul>`,
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

// ===== src/utils/age.js =====
export const getAge = (yob) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

// ===== src/screen/HomeScreen.js =====
import { useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { PlayerAPI } from "../api/PlayerAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import PlayerCard from "../components/PlayerCard";
import TeamFilter from "../components/TeamFilter";

const HomeScreen = () => {
    const [players, setPlayers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by id ----------

        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply team filter ----------

        // -------------------------------------------------------
    }, [selectedTeam, players]);

    const toggleFavorite = async (item) => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    const isFavorite = (id) => favorites.some((f) => f.id === id);
    const teams = [...new Set(players.map((p) => p.team))];

    return (
        <SafeAreaView style={styles.container}>
            <TeamFilter data={teams} selected={selectedTeam} onSelect={setSelectedTeam} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PlayerCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/PlayerCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAge } from "../utils/age";

const PlayerCard = ({ item, favorite, onChangeFavList }) => {
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
                <Text style={styles.name}>{item.playerName}</Text>
                <Text style={styles.meta}>{item.position} · {getAge(item.YoB)} yrs</Text>
                {item.isCaptain && (
                    <View style={styles.captainBadge}>
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={styles.captainBadgeText}>Captain</Text>
                    </View>
                )}
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
    meta: { fontSize: 11, color: "#666", marginTop: 2 },
    captainBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#d32f2f", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
    captainBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default PlayerCard;`,
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

// ===== src/utils/age.js =====
export const getAge = (yob) => {
    // ---------- Student's code starts from here ----------
    return new Date().getFullYear() - yob;
    // -------------------------------------------------------
};

// ===== src/screen/HomeScreen.js =====
import { useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { PlayerAPI } from "../api/PlayerAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import PlayerCard from "../components/PlayerCard";
import TeamFilter from "../components/TeamFilter";

const HomeScreen = () => {
    const [players, setPlayers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        // ---------- Student's code starts from here: fetch + sort desc by id ----------
        (async () => {
            const api = new PlayerAPI();
            const data = await api.getAllPlayers();
            const sorted = [...data].sort((a, b) => Number(b.id) - Number(a.id));
            setPlayers(sorted);
        })();
        (async () => {
            const stored = await getFavorites();
            setFavorites(stored);
        })();
        // -------------------------------------------------------
    }, []);

    useEffect(() => {
        // ---------- Student's code starts from here: apply team filter ----------
        if (!selectedTeam) {
            setFiltered(players);
        } else {
            setFiltered(players.filter((p) => p.team === selectedTeam));
        }
        // -------------------------------------------------------
    }, [selectedTeam, players]);

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
    const teams = [...new Set(players.map((p) => p.team))];

    return (
        <SafeAreaView style={styles.container}>
            <TeamFilter data={teams} selected={selectedTeam} onSelect={setSelectedTeam} />
            <FlatList
                data={filtered}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PlayerCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => toggleFavorite(item)} />
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#fafafa" } });
export default HomeScreen;

// ===== src/components/PlayerCard.js =====
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAge } from "../utils/age";

const PlayerCard = ({ item, favorite, onChangeFavList }) => {
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
                <Text style={styles.name}>{item.playerName}</Text>
                <Text style={styles.meta}>{item.position} · {getAge(item.YoB)} yrs</Text>
                {item.isCaptain && (
                    <View style={styles.captainBadge}>
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={styles.captainBadgeText}>Captain</Text>
                    </View>
                )}
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
    meta: { fontSize: 11, color: "#666", marginTop: 2 },
    captainBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#d32f2f", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
    captainBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
    fav: { position: "absolute", top: 10, right: 10 },
});

export default PlayerCard;`,
  explanation: B(
    `<p><b>Age must be computed from the current year, never a hardcoded one</b> — <code>getAge(yob) = new Date().getFullYear() - yob</code>, not <code>2024 - yob</code>. A real student submission for this exact paper hardcoded <code>2024</code> in three separate places (Home card, Detail screen, and the Captains age filter); every one of those computations would silently drift wrong starting the very next year, which is exactly the kind of bug that doesn't show up when the exam is graded in the same year it was written, only later. <code>TeamFilter</code> is required here — the real student submission this paper came from had NO team filter at all (it just listed every player unfiltered), missing this line of the requirement entirely. The favorite-icon toggle and captain badge are two SEPARATE visual signals so both can "stand out" independently, since a captain can be a favorite or not and vice versa.</p>`,
    `<p><b>Tuổi phải tính từ năm hiện tại, không bao giờ gắn cứng</b> — <code>getAge(yob) = new Date().getFullYear() - yob</code>, không phải <code>2024 - yob</code>. Bài làm sinh viên thật cho đúng đề này gắn cứng <code>2024</code> ở 3 chỗ riêng biệt (card Home, màn Detail, và bộ lọc tuổi Captains); mỗi phép tính đó sẽ âm thầm sai lệch ngay từ năm sau, đúng kiểu lỗi không lộ ra khi chấm cùng năm viết đề, chỉ lộ về sau. <code>TeamFilter</code> là bắt buộc ở đây — bài làm sinh viên thật cho đề này KHÔNG có bộ lọc team nào cả (chỉ liệt mọi cầu thủ không lọc), thiếu hẳn dòng yêu cầu này. Icon favorite và huy hiệu captain là 2 tín hiệu thị giác TÁCH BIỆT để cả 2 đều "nổi bật" độc lập, vì 1 captain có thể là favorite hoặc không và ngược lại.</p>`,
  ),
  rubric: [
    { id: 'fetches_sorts_filters_correctly', criterion: B('Players are fetched, correctly filtered by the selected team, and sorted in descending order by id.', 'Cầu thủ lấy từ MockAPI, lọc đúng theo team đã chọn, sắp giảm dần theo id.'), weight: 1, maxScore: 1 },
    { id: 'age_computed_not_hardcoded', criterion: B('age is computed as the current year minus YoB using a dynamic current-year source, not a hardcoded year.', 'age tính bằng năm hiện tại (động) trừ YoB, không gắn cứng năm nào.'), weight: 1, maxScore: 0.7 },
    { id: 'iscaptain_and_favorite_stand_out', criterion: B('isCaptain and the favorite state are both shown with a visually distinct, stand-out treatment (not plain unstyled text).', 'isCaptain và trạng thái favorite đều hiện rõ nổi bật (không phải chữ thô không style).'), weight: 1, maxScore: 0.6 },
    { id: 'shows_required_fields', criterion: B('Each item shows playerName, isCaptain, image, position, and age.', 'Mỗi item hiện playerName, isCaptain, image, position, và age.'), weight: 1, maxScore: 0.4 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or the playerName title navigates to the Detail screen for that item.', 'Chạm ảnh hoặc tiêu đề playerName điều hướng sang màn hình Detail đúng item.'), weight: 1, maxScore: 0.4 },
    { id: 'favorite_toggle_persists_to_asyncstorage', criterion: B('Pressing the favorite icon correctly adds the player to an AsyncStorage-backed favorite list.', 'Bấm icon favorite thêm đúng cầu thủ vào danh sách favorite lưu qua AsyncStorage.'), weight: 1, maxScore: 0.4 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 3. Implement some actions at the Detail screen (1.0 mark).</strong></p>` +
    `<p>On the Detail screen, display all information of the player: playerName, PassingAccuracy (displayed as a percentage), image, age, position, MinutesPlayed, team and the isCaptain value (for the true value, style it as a special icon). You also display the favorite state, and you can change the favorite state of this player (add to / remove from the Favorite list). Design and arrange this component as well as possible.</p>`,
    `<p><strong>Task 3. Triển khai hành động ở màn hình Detail (1.0 điểm).</strong></p>` +
    `<p>Hiện đầy đủ thông tin cầu thủ: playerName, PassingAccuracy (hiện %), image, age, position, MinutesPlayed, team và giá trị isCaptain (với giá trị true, style thành 1 icon đặc biệt). Cũng hiện trạng thái favorite, và cho đổi trạng thái favorite của cầu thủ này (thêm/xoá khỏi danh sách Favorite). Bố trí component này tốt nhất có thể.</p>`,
  ),
  starterCode:
`// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { getAge } from "../utils/age";

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
            <Image source={{ uri: item.image }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{item.playerName}</Text>
                <Text>Age: {getAge(item.YoB)}</Text>
                <Text>Position: {item.position}</Text>
                <Text>Team: {item.team}</Text>
                <Text>Minutes Played: {item.MinutesPlayed}</Text>
                <Text>Passing Accuracy: {Math.round(item.PassingAccuracy * 100)}%</Text>
                <View style={styles.captainRow}>
                    <Text>Captain: </Text>
                    {/* ---------- Student's code starts from here: special icon only when isCaptain is true ---------- */}
                    {/* ------------------------------------------------------- */}
                </View>
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
    captainRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
});

export default DetailsScreen;`,
  sampleSolution:
`// ===== src/screen/DetailsScreen.js =====
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { getAge } from "../utils/age";

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // ---------- Student's code starts from here ----------
        (async () => {
            const stored = await getFavorites();
            setIsFavorite(stored.some((p) => p.id === item.id));
        })();
        // -------------------------------------------------------
    }, [item.id]);

    const toggleFavorite = async () => {
        // ---------- Student's code starts from here ----------
        const stored = await getFavorites();
        const updated = isFavorite
            ? stored.filter((p) => p.id !== item.id)
            : [...stored, item];
        await saveFavorites(updated);
        setIsFavorite(!isFavorite);
        // -------------------------------------------------------
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <TouchableOpacity style={styles.heart} onPress={toggleFavorite}>
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ff3b5c" : "#d1d1d1"} />
            </TouchableOpacity>
            <View style={styles.infoBox}>
                <Text style={styles.name}>{item.playerName}</Text>
                <Text>Age: {getAge(item.YoB)}</Text>
                <Text>Position: {item.position}</Text>
                <Text>Team: {item.team}</Text>
                <Text>Minutes Played: {item.MinutesPlayed}</Text>
                <Text>Passing Accuracy: {Math.round(item.PassingAccuracy * 100)}%</Text>
                <View style={styles.captainRow}>
                    <Text>Captain: </Text>
                    {/* ---------- Student's code starts from here: special icon only when isCaptain is true ---------- */}
                    {item.isCaptain ? (
                        <Ionicons name="ribbon" size={22} color="#d32f2f" />
                    ) : (
                        <Text>No</Text>
                    )}
                    {/* ------------------------------------------------------- */}
                </View>
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
    captainRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
});

export default DetailsScreen;`,
  explanation: B(
    `<p>The paper is explicit that <b>only the true value</b> needs special icon styling ("for the true value, style it as a special icon") — the false case can stay plain text, which is why the branch is asymmetric (icon vs. plain "No"), not two icons. A real submission for this exact paper showed plain "Yes"/"No" text for BOTH values, missing the "special icon" requirement entirely; the fix reuses the same visual language (a captain badge) already established on the Home screen in Question 2, so the same cue means the same thing across the whole app.</p>`,
    `<p>Đề nói rõ <b>chỉ giá trị true</b> cần style icon đặc biệt ("with the true value, style it as a special icon") — false có thể vẫn là chữ thô, đó là lý do nhánh không đối xứng (icon vs. chữ "No" thường), không phải 2 icon. Bài làm thật cho đúng đề này hiện chữ "Yes"/"No" thô cho CẢ 2 giá trị, thiếu hẳn yêu cầu "icon đặc biệt"; bản sửa dùng lại đúng ngôn ngữ hình ảnh (huy hiệu captain) đã lập ở màn Home Câu 2, để cùng 1 tín hiệu mang cùng 1 ý nghĩa xuyên suốt cả app.</p>`,
  ),
  rubric: [
    { id: 'all_required_fields_shown', criterion: B('playerName, PassingAccuracy (as %), image, age, position, MinutesPlayed, and team are all displayed.', 'playerName, PassingAccuracy (dạng %), image, age, position, MinutesPlayed, và team đều được hiển thị.'), weight: 1, maxScore: 0.4 },
    { id: 'iscaptain_true_shown_as_special_icon', criterion: B('isCaptain, when true, is shown as a distinct special icon (not plain text like the false case).', 'isCaptain khi true hiện thành icon đặc biệt riêng biệt (không phải chữ thô như trường hợp false).'), weight: 1, maxScore: 0.3 },
    { id: 'age_computed_not_hardcoded', criterion: B('age is computed from the current year, not a hardcoded year.', 'age tính từ năm hiện tại, không gắn cứng năm nào.'), weight: 1, maxScore: 0.15 },
    { id: 'favorite_state_shown_and_toggleable', criterion: B('The current favorite state for this specific player is shown and can be toggled, persisting to AsyncStorage.', 'Trạng thái favorite của đúng cầu thủ này được hiện và đổi được, lưu vào AsyncStorage.'), weight: 1, maxScore: 0.15 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 4. Implement some actions at the Favorite screen.</strong></p><ul>` +
    `<li>(0.5 mark) On the Favorite screen, display the list of players stored in AsyncStorage.</li>` +
    `<li>(1.0 mark) The favorite state of each player or of all players can be changed (remove a player from the list / remove all) with a confirmation notification. The screen updates the favorite list after a successful action. Pressing the image of a player or the playerName title switches to the Detail screen.</li></ul>`,
    `<p><strong>Task 4. Triển khai hành động ở màn hình Favorite.</strong></p><ul>` +
    `<li>(0.5 điểm) Ở Favorite, hiện danh sách cầu thủ lưu trong AsyncStorage.</li>` +
    `<li>(1.0 điểm) Trạng thái favorite của 1 hoặc mọi cầu thủ có thể đổi (xoá 1 cầu thủ / xoá tất cả) kèm xác nhận. Màn hình cập nhật danh sách favorite sau khi hành động thành công. Bấm ảnh hoặc tiêu đề playerName chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/FavoriteScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import PlayerCard from "../components/PlayerCard";

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
        return <View style={styles.empty}><Text>No favorite players</Text></View>;
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
                    <PlayerCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
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
import PlayerCard from "../components/PlayerCard";

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
        Alert.alert("Confirm", "Remove this player from favorites?", [
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
        return <View style={styles.empty}><Text>No favorite players</Text></View>;
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
                    <PlayerCard item={item} favorite={true} onChangeFavList={() => removeFavorite(item.id)} />
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
    `<p>Every player shown here is already a favorite, so every action is a REMOVAL — both single-player removal (reusing <code>PlayerCard</code>'s <code>onChangeFavList</code> unchanged from Home) and "Remove All" are wrapped in <code>Alert.alert</code>. The real student submission this paper came from DID confirm single removal here, but its "Remove All" flow lived in a separate modal component rather than the simpler inline <code>Alert.alert</code> pattern used consistently for every other confirmation in this app — functionally similar, but the inline pattern is reused directly from Question 5's Captains screen, keeping one confirmation mechanism throughout instead of two.</p>`,
    `<p>Mọi cầu thủ hiện ở đây đã là favorite sẵn, nên mọi hành động đều là XOÁ — cả xoá 1 cầu thủ (tái dùng <code>onChangeFavList</code> của <code>PlayerCard</code> nguyên vẹn từ Home) lẫn "Remove All" đều bọc trong <code>Alert.alert</code>. Bài làm sinh viên thật cho đúng đề này CÓ xác nhận xoá 1 cầu thủ ở đây, nhưng luồng "Remove All" của họ lại nằm trong 1 component modal riêng thay vì mẫu <code>Alert.alert</code> inline đơn giản hơn dùng nhất quán cho mọi xác nhận khác trong app — về chức năng tương tự, nhưng mẫu inline được tái dùng thẳng từ màn Captains Câu 5, giữ đúng 1 cơ chế xác nhận xuyên suốt thay vì 2.</p>`,
  ),
  rubric: [
    { id: 'lists_favorites_from_asyncstorage', criterion: B('The screen displays the player list stored in AsyncStorage, refreshed whenever the screen gains focus.', 'Màn hình hiện danh sách cầu thủ lưu trong AsyncStorage, nạp lại mỗi lần lấy lại focus.'), weight: 1, maxScore: 0.5 },
    { id: 'single_and_remove_all_with_confirmation', criterion: B('Both single-player removal and a "remove all" action are available, each requiring confirmation before the change takes effect.', 'Có cả xoá 1 cầu thủ và "remove all", mỗi hành động đều cần xác nhận trước khi có hiệu lực.'), weight: 1, maxScore: 0.6 },
    { id: 'list_updates_after_removal', criterion: B('The displayed list updates correctly after a confirmed removal (single or all).', 'Danh sách hiện đúng cập nhật sau khi xoá đã xác nhận (1 hoặc tất cả).'), weight: 1, maxScore: 0.15 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or playerName title navigates to the Detail screen.', 'Chạm ảnh hoặc tiêu đề playerName điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.25 },
  ],
};

const q5 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Task 5. Implement some actions at the Captains screen.</strong></p><ul>` +
    `<li>(2.0 marks) On the Captains screen, display the list of players who are captains (isCaptain = true) over 34 years old. Implement the automatic sorting function (ascending) and arrange the player list by MinutesPlayed.</li>` +
    `<li>(0.5 mark) The favorite state of each player or of all players can be changed (remove a player from the list / remove all) with a confirmation notification. The screen updates the favorite list after a successful action.</li>` +
    `<li>(0.5 mark) Pressing the image of a player or the playerName title switches to the Detail screen.</li></ul>`,
    `<p><strong>Task 5. Triển khai hành động ở màn hình Captains.</strong></p><ul>` +
    `<li>(2.0 điểm) Ở Captains, hiện danh sách cầu thủ là captain (isCaptain=true) TRÊN 34 tuổi. Triển khai sắp xếp TỰ ĐỘNG (tăng dần) theo MinutesPlayed.</li>` +
    `<li>(0.5 điểm) Trạng thái favorite của 1 hoặc mọi cầu thủ có thể đổi (xoá 1 / xoá tất cả) kèm xác nhận. Màn hình cập nhật danh sách favorite sau khi hành động thành công.</li>` +
    `<li>(0.5 điểm) Bấm ảnh hoặc tiêu đề playerName chuyển sang màn hình Detail.</li></ul>`,
  ),
  starterCode:
`// ===== src/screen/CaptainsScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PlayerAPI } from "../api/PlayerAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { getAge } from "../utils/age";
import PlayerCard from "../components/PlayerCard";

const CaptainsScreen = () => {
    const [captains, setCaptains] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, AUTO sort ascending by MinutesPlayed ----------

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
                data={captains}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <PlayerCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => removeFavorite(item.id)} />
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

export default CaptainsScreen;`,
  sampleSolution:
`// ===== src/screen/CaptainsScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PlayerAPI } from "../api/PlayerAPI";
import { getFavorites, saveFavorites } from "../utils/asyncStorage";
import { getAge } from "../utils/age";
import PlayerCard from "../components/PlayerCard";

const CaptainsScreen = () => {
    const [captains, setCaptains] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here: fetch, filter, AUTO sort ascending by MinutesPlayed ----------
            (async () => {
                const api = new PlayerAPI();
                const data = await api.getAllPlayers();

                const filtered = data.filter(
                    (item) => item.isCaptain === true && getAge(item.YoB) > 34,
                );
                // "Automatic" — sorted immediately on load, no button/tap required.
                const sorted = filtered.sort((a, b) => a.MinutesPlayed - b.MinutesPlayed);
                setCaptains(sorted);
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
        Alert.alert("Confirm", "Remove this player from favorites?", [
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
                data={captains}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <PlayerCard item={item} favorite={isFavorite(item.id)} onChangeFavList={() => removeFavorite(item.id)} />
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

export default CaptainsScreen;`,
  explanation: B(
    `<p><b>"Implement the automatic sorting function" means the list is sorted the moment it loads, with no user interaction required</b> — a real submission for this exact paper instead required the user to TAP a sort-icon button that cycled through three states (unsorted → ascending → descending → unsorted) before the list would sort at all, which is the opposite of "automatic." Here the ascending sort by <code>MinutesPlayed</code> runs unconditionally inside the same fetch effect, so the screen is already correctly ordered on first render. The age filter (<code>getAge(item.YoB) > 34</code>) reuses the SAME dynamic-year <code>getAge</code> helper from Question 2/3 rather than a second hardcoded-year computation, so a captain who is 34 the year the exam is written and 35 the year after is filtered consistently with how their age is displayed everywhere else in the app.</p>`,
    `<p><b>"Triển khai sắp xếp tự động" nghĩa là danh sách sắp xếp NGAY khi tải, không cần thao tác gì</b> — bài làm thật cho đúng đề này lại bắt người dùng BẤM nút icon sắp xếp xoay vòng 3 trạng thái (chưa sắp → tăng dần → giảm dần → chưa sắp) mới chịu sắp xếp, ngược hẳn với "tự động". Ở đây sắp tăng dần theo <code>MinutesPlayed</code> chạy VÔ ĐIỀU KIỆN ngay trong cùng effect lấy dữ liệu, nên màn hình đã đúng thứ tự ngay từ lần render đầu. Bộ lọc tuổi (<code>getAge(item.YoB) > 34</code>) dùng lại CHÍNH helper <code>getAge</code> năm-động từ Câu 2/3 thay vì 1 phép tính gắn cứng năm thứ hai, nên 1 captain 34 tuổi năm viết đề và 35 tuổi năm sau vẫn được lọc nhất quán với cách tuổi hiển thị ở mọi nơi khác trong app.</p>`,
  ),
  rubric: [
    { id: 'filters_captains_over_34', criterion: B('Only players with isCaptain=true and a computed age over 34 (using the current-year-based getAge, not a hardcoded year) are shown.', 'Chỉ hiện cầu thủ isCaptain=true và tuổi tính được trên 34 (dùng getAge theo năm hiện tại, không gắn cứng năm).'), weight: 1, maxScore: 0.8 },
    { id: 'automatically_sorted_on_load', criterion: B('The list is sorted ascending by MinutesPlayed automatically on load, without requiring any button press or user interaction to trigger the sort.', 'Danh sách tự động sắp tăng dần theo MinutesPlayed ngay khi tải, không cần bấm nút hay thao tác nào để kích hoạt sắp xếp.'), weight: 1, maxScore: 0.8 },
    { id: 'favorite_change_with_confirmation_and_update', criterion: B('Favorite state (single or all) can be changed with confirmation, and the favorite list updates after the action completes.', 'Trạng thái favorite (1 hoặc tất cả) đổi được kèm xác nhận, danh sách favorite cập nhật sau khi hoàn tất.'), weight: 1, maxScore: 0.7 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping the image or playerName title navigates to the Detail screen.', 'Chạm ảnh hoặc tiêu đề playerName điều hướng sang màn hình Detail.'), weight: 1, maxScore: 0.7 },
  ],
};

const spec = {
  course: { courseCode: 'MMA301' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE5',
    title: 'MMA301 – Practical Exam (Summer 2024), Football Player Catalog App|||MMA301 – Thi thực hành (Summer 2024), App Danh mục Cầu thủ',
    description: 'MMA301 PE (CODE): React Native + Expo app fetching from a MockAPI.io resource (Home/Favorite/Captains tabs, team filter, dynamically computed age, favorites via AsyncStorage, an auto-sorted Captains screen), AI-graded.|||PE MMA301 (viết mã): app React Native + Expo lấy dữ liệu từ resource MockAPI.io (tab Home/Favorite/Captains, lọc team, tính tuổi động, favorite qua AsyncStorage, màn Captains tự động sắp xếp), chấm AI.',
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
