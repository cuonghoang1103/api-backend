/**
 * build-mma301-pe1.mjs — sinh content/exams/MMA301-PE1.mjs.
 *
 * Nguồn thật: "MMA301 - PE - FA 2024" (Fall 2024 Practice Exam) — ứng
 * dụng React Native/Expo "Land Manager" (quản lý lô đất cho nhân viên
 * môi giới). Không có solution/seed đính kèm — chỉ có paper.pdf, tự
 * thiết kế toàn bộ từ đặc tả đề.
 *
 * ⚠️ KHÁC HẲN cấu trúc SDN302: đây là app React Native THUẦN CLIENT
 * (Expo + AsyncStorage cục bộ, KHÔNG có backend/API nào) — không có
 * môi trường Expo/thiết bị thật để chạy, chấm hoàn toàn bằng rubric AI
 * đọc code JS/JSX (component, hook, AsyncStorage, react-navigation,
 * react-native-maps), không compile/không diff output.
 *
 * Điểm gốc: Q1=0.5 (khởi tạo project), Q2=3 (màn hình chính+tìm kiếm),
 * Q3=3 (thêm/sửa lô đất), Q4=1.5 (bản đồ), Q5=1 (xoá), Q6=1 (cấu trúc
 * dự án+UI/UX) — tổng 10.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MMA301-PE1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/MMA301-PE1.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const appContext = B(
  `<div class="pe-system"><b>Context:</b> Lac works as a land market employee. His job is to find real estate investment opportunities, so he frequently travels to inspect sites, meet customers, and keep information on land projects up to date. Managing this information on paper has become hard to keep track of, so Lac wants a mobile app called <b>"Land Manager"</b> that lets him and his colleagues record, edit, and delete plot-of-land details, see plots on a map, and share information between staff.</div>` +
  `<pre><code class="language-javascript">// Plot of land (shape agreed across the whole app — no fixed schema is given by the paper,
// this is the field set implied by every requirement: name, address, price, coordinates, and
// "other detailed information")
{
  id: string,           // unique id, e.g. generated with Date.now().toString()
  name: string,
  address: string,
  price: number,
  coordinates: { latitude: number, longitude: number },
  description: string,  // "other detailed information"
}</code></pre>`,
  `<div class="pe-system"><b>Bối cảnh:</b> Lạc làm nhân viên môi giới bất động sản. Việc của anh là tìm cơ hội đầu tư đất, nên thường xuyên đi khảo sát, gặp khách hàng, cập nhật thông tin dự án đất. Quản lý thông tin trên giấy ngày càng khó theo dõi, nên Lạc muốn 1 app di động tên <b>"Land Manager"</b> để anh và đồng nghiệp ghi/sửa/xoá thông tin lô đất, xem lô đất trên bản đồ, và chia sẻ thông tin giữa nhân viên.</div>` +
  `<pre><code class="language-javascript">// Lô đất (hình dạng thống nhất toàn app — đề không cho schema cố định,
// đây là tập field ngầm định từ mọi yêu cầu: tên, địa chỉ, giá, toạ độ, và
// "thông tin chi tiết khác")
{
  id: string,           // id duy nhất, VD sinh bằng Date.now().toString()
  name: string,
  address: string,
  price: number,
  coordinates: { latitude: number, longitude: number },
  description: string,  // "thông tin chi tiết khác"
}</code></pre>`,
);

const instructions = ML(
  `<p><strong>MMA301 – Practical Exam (Fall 2024) — "Land Manager" location management app</strong>. Built with React Native + Expo, local storage only (AsyncStorage), no backend server. This exam room has no live Expo/device runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. Note: 0 points for missing features, typos, or unclear code; the source code must be clear and easy to understand; free to design the interface as long as it fulfills the requirements.</p>` + appContext,
  `<p><strong>MMA301 – Thi thực hành (Fall 2024) — App quản lý vị trí "Land Manager"</strong>. Xây bằng React Native + Expo, chỉ lưu cục bộ (AsyncStorage), không có server backend. Phòng thi này không có môi trường Expo/thiết bị sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Lưu ý: 0 điểm nếu thiếu tính năng, lỗi chính tả, hoặc code khó hiểu; source code phải rõ ràng dễ hiểu; tự do thiết kế giao diện miễn đủ yêu cầu.</p>` + appContext,
);

const q1 = {
  kind: 'CODE', points: 0.5, language: 'javascript',
  prompt: B(
    `<p><strong>1. Create a project (0.5 points)</strong></p><ul>` +
    `<li>Create a new project with Expo using the "blank" template.</li>` +
    `<li>Name the project after your student ID number.</li>` +
    `<li>Configure the project in advance so that it can run as a web application.</li></ul>`,
    `<p><strong>1. Khởi tạo dự án (0.5 điểm)</strong></p><ul>` +
    `<li>Tạo dự án mới bằng Expo, dùng template "blank".</li>` +
    `<li>Đặt tên dự án theo mã số sinh viên.</li>` +
    `<li>Cấu hình sẵn dự án để chạy được như một ứng dụng web.</li></ul>`,
  ),
  starterCode:
`// ===== package.json (relevant excerpt) =====
{
  "name": "se180000",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-web": "~0.19.10",
    "react-dom": "18.2.0"
  }
}

// ===== app.json (relevant excerpt) =====
{
  "expo": {
    "name": "se180000",
    "slug": "se180000",
    "web": {
      "bundler": "metro"
    }
  }
}

// ===== App.js =====
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
}`,
  sampleSolution:
`// ===== package.json (relevant excerpt) =====
{
  "name": "se180000",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-web": "~0.19.10",
    "react-dom": "18.2.0",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.9.26",
    "react-native-screens": "~3.31.1",
    "react-native-safe-area-context": "4.10.1",
    "@react-native-async-storage/async-storage": "1.23.1",
    "react-native-maps": "1.14.0"
  }
}

// ===== app.json (relevant excerpt) =====
{
  "expo": {
    "name": "se180000",
    "slug": "se180000",
    "web": {
      "bundler": "metro"
    }
  }
}

// ===== App.js =====
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./screens/MainScreen";
import PlotFormScreen from "./screens/PlotFormScreen";
import PlotDetailScreen from "./screens/PlotDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    // ---------- Student's code starts from here ----------
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={MainScreen} options={{ title: "Land Manager" }} />
                <Stack.Screen name="PlotDetail" component={PlotDetailScreen} options={{ title: "Plot Detail" }} />
                <Stack.Screen name="PlotForm" component={PlotFormScreen} options={{ title: "Add / Edit Plot" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    // -------------------------------------------------------
}`,
  explanation: B(
    `<p>"Configure the project in advance so it can run as a web application" means the project must declare Expo's web support (<code>react-native-web</code>/<code>react-dom</code> dependencies plus <code>expo.web.bundler</code> in <code>app.json</code>) BEFORE the grader ever tries <code>npx expo start --web</code> — a project that only happens to work on iOS/Android simulators does not satisfy this line. <code>App.js</code> is the right place to root the <code>NavigationContainer</code>/<code>Stack.Navigator</code> used by every later question, since Question 2 requires tap-to-navigate and Question 3 requires a separate add/edit screen — designing the navigation skeleton here (even though it earns 0 points on its own) is what makes those later requirements possible without restructuring.</p>`,
    `<p>"Cấu hình sẵn dự án để chạy được như ứng dụng web" nghĩa là dự án phải khai báo hỗ trợ web của Expo (dependency <code>react-native-web</code>/<code>react-dom</code> cộng <code>expo.web.bundler</code> trong <code>app.json</code>) TRƯỚC KHI giám khảo thử <code>npx expo start --web</code> — dự án chỉ tình cờ chạy được trên simulator iOS/Android là chưa đạt dòng này. <code>App.js</code> là nơi hợp lý để đặt gốc <code>NavigationContainer</code>/<code>Stack.Navigator</code> mà mọi câu sau dùng, vì Câu 2 cần chạm-để-điều-hướng và Câu 3 cần màn hình thêm/sửa riêng — dựng khung điều hướng ở đây (dù tự nó 0 điểm) mới khiến các yêu cầu sau khả thi mà không phải dựng lại cấu trúc.</p>`,
  ),
  rubric: [
    { id: 'expo_blank_template', criterion: B('Project is created from the Expo "blank" template.', 'Dự án tạo từ template Expo "blank".'), weight: 1, maxScore: 0.15 },
    { id: 'named_after_student_id', criterion: B('Project name matches a student ID number pattern (e.g. package.json "name" / app.json "slug").', 'Tên dự án khớp mẫu mã số sinh viên (package.json "name" / app.json "slug").'), weight: 1, maxScore: 0.15 },
    { id: 'configured_for_web', criterion: B('Project is pre-configured to run as a web application (react-native-web/react-dom dependencies and app.json web config), not left to be discovered at run time.', 'Dự án đã cấu hình SẴN để chạy web (dependency react-native-web/react-dom và cấu hình web trong app.json), không để tới lúc chạy mới phát hiện thiếu.'), weight: 1, maxScore: 0.2 },
  ],
};

const q2 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>2. Main screen (3 points)</strong></p><ul>` +
    `<li>Show a list of the saved plots of land (use one of the ListView types covered in the course). The interface must display at least 2 pieces of information: plot name and plot address. You may also display other information you consider necessary.</li>` +
    `<li>Provide a search function on the plot list, allowing users to search by name or address.</li>` +
    `<li>Let users tap on a plot of land to view its details (use Navigator to navigate to the detail screen).</li></ul>`,
    `<p><strong>2. Màn hình chính (3 điểm)</strong></p><ul>` +
    `<li>Hiện danh sách lô đất đã lưu (dùng 1 kiểu ListView đã học trong môn). Giao diện phải hiện ít nhất 2 thông tin: tên lô và địa chỉ lô. Có thể hiện thêm thông tin khác nếu cần.</li>` +
    `<li>Có chức năng tìm kiếm trên danh sách, cho phép tìm theo tên hoặc địa chỉ.</li>` +
    `<li>Cho phép chạm vào 1 lô đất để xem chi tiết (dùng Navigator điều hướng sang màn hình chi tiết).</li></ul>`,
  ),
  starterCode:
`// ===== screens/MainScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadPlots } from "../utils/storage";

export default function MainScreen({ navigation }) {
    const [plots, setPlots] = useState([]);
    const [query, setQuery] = useState("");

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here ----------

            // -------------------------------------------------------
        }, []),
    );

    const filteredPlots = plots; // ---------- Student's code: apply search filter here ----------

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Search by name or address"
                value={query}
                onChangeText={setQuery}
            />
            <FlatList
                data={filteredPlots}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => {
                            // ---------- Student's code starts from here ----------

                            // -------------------------------------------------------
                        }}
                    >
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>{item.address}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No plots saved yet.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("PlotForm")}>
                <Text style={styles.addButtonText}>+ Add plot</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    search: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
    row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
    name: { fontSize: 16, fontWeight: "600" },
    address: { fontSize: 14, color: "#666" },
    addButton: { marginTop: 12, backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center" },
    addButtonText: { color: "#fff", fontWeight: "600" },
});`,
  sampleSolution:
`// ===== screens/MainScreen.js =====
import { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { loadPlots } from "../utils/storage";

export default function MainScreen({ navigation }) {
    const [plots, setPlots] = useState([]);
    const [query, setQuery] = useState("");

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here ----------
            let isActive = true;
            (async () => {
                const data = await loadPlots();
                if (isActive) setPlots(data);
            })();
            return () => {
                isActive = false;
            };
            // -------------------------------------------------------
        }, []),
    );

    const filteredPlots = plots.filter((plot) => {
        const term = query.trim().toLowerCase();
        if (!term) return true;
        return (
            plot.name.toLowerCase().includes(term) ||
            plot.address.toLowerCase().includes(term)
        );
    });

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Search by name or address"
                value={query}
                onChangeText={setQuery}
            />
            <FlatList
                data={filteredPlots}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => {
                            // ---------- Student's code starts from here ----------
                            navigation.navigate("PlotDetail", { plotId: item.id });
                            // -------------------------------------------------------
                        }}
                    >
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>{item.address}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No plots saved yet.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("PlotForm")}>
                <Text style={styles.addButtonText}>+ Add plot</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    search: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
    row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
    name: { fontSize: 16, fontWeight: "600" },
    address: { fontSize: 14, color: "#666" },
    addButton: { marginTop: 12, backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center" },
    addButtonText: { color: "#fff", fontWeight: "600" },
});`,
  explanation: B(
    `<p>Reloading happens in <code>useFocusEffect</code> (not <code>useEffect</code>) — the main screen is revisited every time the user comes back from adding/editing/deleting a plot on another screen, and a plain mount-only <code>useEffect</code> would keep showing stale data after those round-trips since the component never unmounts between screen navigations in a stack navigator. The search only PASSES the plot ID through navigation params (not the whole object) so the detail screen always re-reads the authoritative copy from storage rather than risking a stale snapshot captured at list-render time.</p>`,
    `<p>Nạp lại dữ liệu đặt trong <code>useFocusEffect</code> (không phải <code>useEffect</code>) — màn hình chính được quay lại mỗi khi người dùng quay về sau khi thêm/sửa/xoá 1 lô ở màn hình khác, và <code>useEffect</code> thuần chỉ chạy lúc mount sẽ tiếp tục hiện dữ liệu cũ sau các vòng đó vì component không unmount giữa các lần điều hướng trong stack navigator. Tìm kiếm chỉ CHUYỂN ID lô qua tham số điều hướng (không phải cả object) để màn hình chi tiết luôn đọc lại đúng bản gốc từ storage thay vì rủi ro dùng bản chụp cũ lúc render danh sách.</p>`,
  ),
  rubric: [
    { id: 'listview_shows_required_fields', criterion: B('A ListView-type component (FlatList/SectionList/etc.) renders the saved plots, showing at least name and address for each.', 'Component dạng ListView (FlatList/SectionList/...) hiện danh sách lô đã lưu, mỗi lô có ít nhất tên và địa chỉ.'), weight: 1, maxScore: 1 },
    { id: 'search_by_name_or_address', criterion: B('A search input correctly filters the list by name or address.', 'Ô tìm kiếm lọc đúng danh sách theo tên hoặc địa chỉ.'), weight: 1, maxScore: 0.8 },
    { id: 'tap_navigates_to_detail', criterion: B('Tapping a plot uses the navigator to go to a detail screen for that specific plot.', 'Chạm vào 1 lô dùng navigator điều hướng sang màn hình chi tiết đúng lô đó.'), weight: 1, maxScore: 0.8 },
    { id: 'refreshes_on_focus', criterion: B('The list reflects changes made on other screens (add/edit/delete) when the user returns to the main screen, not just on first mount.', 'Danh sách phản ánh đúng thay đổi làm ở màn hình khác (thêm/sửa/xoá) khi người dùng quay lại màn hình chính, không chỉ lúc mount lần đầu.'), weight: 1, maxScore: 0.4 },
  ],
};

const q3 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>3. Add/edit plot screen (3 points)</strong></p><ul>` +
    `<li>Build an input form for the plot name, price, address, coordinates, and other detailed information.</li>` +
    `<li>Save data to AsyncStorage.</li>` +
    `<li>When the user edits the land information, update that data.</li></ul>`,
    `<p><strong>3. Màn hình thêm/sửa lô đất (3 điểm)</strong></p><ul>` +
    `<li>Dựng form nhập tên lô, giá, địa chỉ, toạ độ, và thông tin chi tiết khác.</li>` +
    `<li>Lưu dữ liệu vào AsyncStorage.</li>` +
    `<li>Khi người dùng sửa thông tin đất, cập nhật đúng dữ liệu đó.</li></ul>`,
  ),
  starterCode:
`// ===== utils/storage.js =====
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "land_manager_plots";

export const loadPlots = async () => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

export const savePlot = async (plot) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

export const deletePlot = async (plotId) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

// ===== screens/PlotFormScreen.js =====
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { loadPlots, savePlot } from "../utils/storage";

export default function PlotFormScreen({ route, navigation }) {
    const editingPlotId = route.params?.plotId ?? null;
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    }, [editingPlotId]);

    const handleSubmit = async () => {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>Price</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />
            <Text style={styles.label}>Latitude</Text>
            <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
            <Text style={styles.label}>Longitude</Text>
            <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} keyboardType="numeric" />
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{editingPlotId ? "Update" : "Save"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
    submitButton: { marginTop: 20, backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center" },
    submitButtonText: { color: "#fff", fontWeight: "600" },
});`,
  sampleSolution:
`// ===== utils/storage.js =====
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "land_manager_plots";

export const loadPlots = async () => {
    // ---------- Student's code starts from here ----------
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
    // -------------------------------------------------------
};

export const savePlot = async (plot) => {
    // ---------- Student's code starts from here ----------
    const plots = await loadPlots();
    const existingIndex = plots.findIndex((p) => p.id === plot.id);

    if (existingIndex >= 0) {
        plots[existingIndex] = plot;
    } else {
        plots.push(plot);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plots));
    // -------------------------------------------------------
};

export const deletePlot = async (plotId) => {
    // ---------- Student's code starts from here ----------
    const plots = await loadPlots();
    const remaining = plots.filter((p) => p.id !== plotId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    // -------------------------------------------------------
};

// ===== screens/PlotFormScreen.js =====
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { loadPlots, savePlot } from "../utils/storage";

export default function PlotFormScreen({ route, navigation }) {
    const editingPlotId = route.params?.plotId ?? null;
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        // ---------- Student's code starts from here ----------
        if (!editingPlotId) return;
        (async () => {
            const plots = await loadPlots();
            const existing = plots.find((p) => p.id === editingPlotId);
            if (!existing) return;
            setName(existing.name);
            setPrice(String(existing.price));
            setAddress(existing.address);
            setLatitude(String(existing.coordinates.latitude));
            setLongitude(String(existing.coordinates.longitude));
            setDescription(existing.description);
        })();
        // -------------------------------------------------------
    }, [editingPlotId]);

    const handleSubmit = async () => {
        // ---------- Student's code starts from here ----------
        const plot = {
            id: editingPlotId ?? Date.now().toString(),
            name,
            price: Number(price),
            address,
            coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
            description,
        };
        await savePlot(plot);
        navigation.goBack();
        // -------------------------------------------------------
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>Price</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />
            <Text style={styles.label}>Latitude</Text>
            <TextInput style={styles.input} value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
            <Text style={styles.label}>Longitude</Text>
            <TextInput style={styles.input} value={longitude} onChangeText={setLongitude} keyboardType="numeric" />
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{editingPlotId ? "Update" : "Save"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
    submitButton: { marginTop: 20, backgroundColor: "#2563eb", padding: 14, borderRadius: 8, alignItems: "center" },
    submitButtonText: { color: "#fff", fontWeight: "600" },
});`,
  explanation: B(
    `<p>A single screen serves BOTH add and edit (the paper only calls for one "Add/edit plot screen", not two separate screens) — <code>route.params?.plotId</code> being present or absent is the sole signal that decides which mode is active, both for pre-filling the form (the <code>useEffect</code> only reads existing data when <code>editingPlotId</code> is truthy) and for whether <code>savePlot</code> should overwrite an existing array entry or append a new one. <code>savePlot</code> is written generically (find-by-id, overwrite if found else push) so the SAME function correctly handles both create and update — the screen never needs a separate "updatePlot" path, and there is only one place (<code>utils/storage.js</code>) that touches <code>AsyncStorage</code> directly, which is also what Question 5's delete flow reuses.</p>`,
    `<p>1 màn hình phục vụ CẢ thêm lẫn sửa (đề chỉ nói 1 "màn hình thêm/sửa lô đất", không phải 2 màn hình riêng) — <code>route.params?.plotId</code> có hay không là dấu hiệu DUY NHẤT quyết định đang ở chế độ nào, cả cho việc điền sẵn form (<code>useEffect</code> chỉ đọc dữ liệu có sẵn khi <code>editingPlotId</code> có giá trị) lẫn việc <code>savePlot</code> nên ghi đè phần tử có sẵn trong mảng hay thêm mới. <code>savePlot</code> viết TỔNG QUÁT (tìm theo id, ghi đè nếu thấy, không thì thêm mới) nên CÙNG 1 hàm xử lý đúng cả tạo lẫn sửa — màn hình không cần đường "updatePlot" riêng, và chỉ có đúng 1 chỗ (<code>utils/storage.js</code>) đụng trực tiếp <code>AsyncStorage</code>, cũng là chỗ luồng xoá ở Câu 5 dùng lại.</p>`,
  ),
  rubric: [
    { id: 'form_has_all_required_fields', criterion: B('The form collects name, price, address, coordinates, and a field for other detailed information.', 'Form thu thập tên, giá, địa chỉ, toạ độ, và 1 field cho thông tin chi tiết khác.'), weight: 1, maxScore: 0.6 },
    { id: 'saves_to_asyncstorage', criterion: B('Submitting the form correctly persists the plot to AsyncStorage.', 'Gửi form lưu đúng lô đất vào AsyncStorage.'), weight: 1, maxScore: 1 },
    { id: 'edit_prefills_and_updates_existing_entry', criterion: B('When editing an existing plot, the form is pre-filled with its current data, and submitting updates the SAME entry rather than creating a duplicate.', 'Khi sửa 1 lô có sẵn, form điền sẵn đúng dữ liệu hiện tại, và gửi form cập nhật ĐÚNG entry đó thay vì tạo bản trùng.'), weight: 1, maxScore: 1 },
    { id: 'single_screen_reused_for_add_and_edit', criterion: B('One shared screen (not two separate ones) correctly branches between add and edit mode based on whether a plot id was passed in.', 'Dùng chung 1 màn hình (không phải 2 màn hình riêng) rẽ nhánh đúng giữa thêm và sửa dựa vào có truyền plot id hay không.'), weight: 1, maxScore: 0.4 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>4. Map integration (1.5 points)</strong></p><ul>` +
    `<li>Display a map with the location of the saved land (using React Native Maps).</li>` +
    `<li>Mark the plots on the map according to the entered coordinates.</li></ul>`,
    `<p><strong>4. Tích hợp bản đồ (1.5 điểm)</strong></p><ul>` +
    `<li>Hiện bản đồ với vị trí đất đã lưu (dùng React Native Maps).</li>` +
    `<li>Đánh dấu các lô trên bản đồ theo đúng toạ độ đã nhập.</li></ul>`,
  ),
  starterCode:
`// ===== screens/MapScreen.js =====
import { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { loadPlots } from "../utils/storage";

export default function MapScreen() {
    const [plots, setPlots] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here ----------

            // -------------------------------------------------------
        }, []),
    );

    return (
        <MapView style={styles.map} initialRegion={{ latitude: 21.0278, longitude: 105.8342, latitudeDelta: 0.5, longitudeDelta: 0.5 }}>
            {/* ---------- Student's code starts from here ---------- */}
            {/* ------------------------------------------------------- */}
        </MapView>
    );
}

const styles = StyleSheet.create({ map: { flex: 1 } });`,
  sampleSolution:
`// ===== screens/MapScreen.js =====
import { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { loadPlots } from "../utils/storage";

export default function MapScreen() {
    const [plots, setPlots] = useState([]);

    useFocusEffect(
        useCallback(() => {
            // ---------- Student's code starts from here ----------
            let isActive = true;
            (async () => {
                const data = await loadPlots();
                if (isActive) setPlots(data);
            })();
            return () => {
                isActive = false;
            };
            // -------------------------------------------------------
        }, []),
    );

    return (
        <MapView style={styles.map} initialRegion={{ latitude: 21.0278, longitude: 105.8342, latitudeDelta: 0.5, longitudeDelta: 0.5 }}>
            {/* ---------- Student's code starts from here ---------- */}
            {plots.map((plot) => (
                <Marker
                    key={plot.id}
                    coordinate={plot.coordinates}
                    title={plot.name}
                    description={plot.address}
                />
            ))}
            {/* ------------------------------------------------------- */}
        </MapView>
    );
}

const styles = StyleSheet.create({ map: { flex: 1 } });`,
  explanation: B(
    `<p>The map loads the SAME <code>loadPlots()</code> helper used everywhere else (not a separate map-specific data source), so a plot added or edited via Question 3's form is immediately reflected as a marker without any extra syncing code — reusing <code>useFocusEffect</code> here for the same reason as Question 2's list: the map screen must re-read storage every time it regains focus, not just on first mount. Each <code>Marker</code>'s <code>coordinate</code> comes directly from the plot's own stored <code>coordinates</code> object (matching the shape saved by the form), so a marker's position always matches the coordinates the user actually typed in, not a hardcoded or re-derived value.</p>`,
    `<p>Bản đồ nạp CÙNG hàm <code>loadPlots()</code> dùng ở mọi nơi khác (không phải nguồn dữ liệu riêng cho bản đồ), nên 1 lô vừa thêm/sửa ở form Câu 3 lập tức hiện thành marker mà không cần thêm code đồng bộ nào — dùng lại <code>useFocusEffect</code> ở đây cùng lý do với danh sách Câu 2: màn hình bản đồ phải đọc lại storage mỗi lần lấy lại focus, không chỉ lúc mount lần đầu. <code>coordinate</code> của mỗi <code>Marker</code> lấy trực tiếp từ object <code>coordinates</code> đã lưu của lô (khớp đúng hình dạng form đã lưu), nên vị trí marker luôn khớp đúng toạ độ người dùng thật sự đã nhập, không phải giá trị hardcode hay tính lại.</p>`,
  ),
  rubric: [
    { id: 'map_rendered_with_react_native_maps', criterion: B('A MapView from react-native-maps is rendered on its own screen/component.', 'MapView của react-native-maps được render trên màn hình/component riêng.'), weight: 1, maxScore: 0.5 },
    { id: 'markers_reflect_saved_plots', criterion: B('Every saved plot is shown as a marker on the map.', 'Mọi lô đã lưu được hiện thành marker trên bản đồ.'), weight: 1, maxScore: 0.6 },
    { id: 'marker_coordinates_match_entered_data', criterion: B('Each marker\'s position uses the plot\'s own entered coordinates (not a fixed/placeholder location).', 'Vị trí mỗi marker dùng đúng toạ độ đã nhập của lô đó (không phải vị trí cố định/giữ chỗ).'), weight: 1, maxScore: 0.4 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>5. Land deletion function (1 point)</strong></p><ul>` +
    `<li>Allow the user to delete a plot from the list and update the interface.</li></ul>`,
    `<p><strong>5. Chức năng xoá lô đất (1 điểm)</strong></p><ul>` +
    `<li>Cho phép người dùng xoá 1 lô khỏi danh sách và cập nhật giao diện.</li></ul>`,
  ),
  starterCode:
`// ===== screens/MainScreen.js (excerpt — delete swipe/button) =====
import { deletePlot } from "../utils/storage";

const handleDelete = async (plotId, setPlots) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

// Wire into the row, e.g.:
// <TouchableOpacity onPress={() => handleDelete(item.id, setPlots)}>
//   <Text>Delete</Text>
// </TouchableOpacity>`,
  sampleSolution:
`// ===== screens/MainScreen.js (excerpt — delete swipe/button) =====
import { Alert } from "react-native";
import { deletePlot, loadPlots } from "../utils/storage";

const handleDelete = async (plotId, setPlots) => {
    // ---------- Student's code starts from here ----------
    Alert.alert("Delete plot", "Are you sure you want to delete this plot?", [
        { text: "Cancel", style: "cancel" },
        {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
                await deletePlot(plotId);
                const updated = await loadPlots();
                setPlots(updated);
            },
        },
    ]);
    // -------------------------------------------------------
};

// Wire into the row, e.g.:
// <TouchableOpacity onPress={() => handleDelete(item.id, setPlots)}>
//   <Text>Delete</Text>
// </TouchableOpacity>`,
  explanation: B(
    `<p>"Update the interface" is satisfied by re-reading storage and calling <code>setPlots</code> with the fresh array right after <code>deletePlot</code> resolves — NOT by filtering the local <code>plots</code> state in place, since the local state and AsyncStorage could otherwise drift apart if any other screen (the map, a future multi-device sync) also reads storage independently. Reusing the same <code>deletePlot(plotId)</code> helper from <code>utils/storage.js</code> (rather than re-implementing the removal logic inline) keeps the single source of truth for what "delete" means established back in Question 3.</p>`,
    `<p>"Cập nhật giao diện" được thoả bằng cách đọc lại storage và gọi <code>setPlots</code> với mảng mới NGAY sau khi <code>deletePlot</code> hoàn tất — KHÔNG phải lọc state <code>plots</code> cục bộ tại chỗ, vì state cục bộ và AsyncStorage có thể lệch nhau nếu màn hình khác (bản đồ, sau này đồng bộ nhiều thiết bị) cũng đọc storage độc lập. Dùng lại đúng hàm <code>deletePlot(plotId)</code> từ <code>utils/storage.js</code> (thay vì viết lại logic xoá ngay tại chỗ) giữ đúng 1 nguồn định nghĩa "xoá" đã lập từ Câu 3.</p>`,
  ),
  rubric: [
    { id: 'delete_action_available', criterion: B('The user has a way to trigger deletion of a specific plot from the list.', 'Người dùng có cách kích hoạt xoá đúng 1 lô cụ thể từ danh sách.'), weight: 1, maxScore: 0.4 },
    { id: 'deletion_persisted_to_storage', criterion: B('The deleted plot is actually removed from AsyncStorage, not just hidden from view.', 'Lô bị xoá thực sự được gỡ khỏi AsyncStorage, không chỉ ẩn khỏi màn hình.'), weight: 1, maxScore: 0.4 },
    { id: 'ui_reflects_deletion_immediately', criterion: B('The list UI updates immediately after deletion to reflect the new state, re-read from storage.', 'Giao diện danh sách cập nhật ngay sau khi xoá, đọc lại đúng trạng thái mới từ storage.'), weight: 1, maxScore: 0.2 },
  ],
};

const q6 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>6. Project structure and UI + UX (1 point)</strong></p><ul>` +
    `<li>Organize the project structure clearly so that it is easy to understand, and provide an easy-to-use interface.</li></ul>` +
    `<p>Note (applies to the whole app): the source code must be clear and easy to understand; missing features, typos, or unclear code may lead to demerits.</p>`,
    `<p><strong>6. Cấu trúc dự án và UI + UX (1 điểm)</strong></p><ul>` +
    `<li>Tổ chức cấu trúc dự án rõ ràng, dễ hiểu, và cung cấp giao diện dễ dùng.</li></ul>` +
    `<p>Lưu ý (áp dụng cho cả app): source code phải rõ ràng dễ hiểu; thiếu tính năng, lỗi chính tả, hoặc code khó hiểu có thể bị trừ điểm.</p>`,
  ),
  starterCode:
`// ===== Project structure (target layout) =====
// se180000/
// ├── App.js                       — navigation root (Question 1)
// ├── screens/
// │   ├── MainScreen.js             — list + search (Question 2) + delete (Question 5)
// │   ├── PlotFormScreen.js         — add/edit form (Question 3)
// │   └── MapScreen.js              — map + markers (Question 4)
// ├── components/
// │   └── PlotListItem.js
// └── utils/
//     └── storage.js                — AsyncStorage helpers (Question 3/5)

// ===== components/PlotListItem.js =====
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PlotListItem({ plot, onPress }) {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
}`,
  sampleSolution:
`// ===== Project structure (target layout) =====
// se180000/
// ├── App.js                       — navigation root (Question 1)
// ├── screens/
// │   ├── MainScreen.js             — list + search (Question 2) + delete (Question 5)
// │   ├── PlotFormScreen.js         — add/edit form (Question 3)
// │   └── MapScreen.js              — map + markers (Question 4)
// ├── components/
// │   └── PlotListItem.js
// └── utils/
//     └── storage.js                — AsyncStorage helpers (Question 3/5)

// ===== components/PlotListItem.js =====
import { Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PlotListItem({ plot, onPress }) {
    // ---------- Student's code starts from here ----------
    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <Text style={styles.name}>{plot.name}</Text>
            <Text style={styles.address}>{plot.address}</Text>
        </TouchableOpacity>
    );
    // -------------------------------------------------------
}

const styles = StyleSheet.create({
    row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
    name: { fontSize: 16, fontWeight: "600" },
    address: { fontSize: 14, color: "#666" },
});`,
  explanation: B(
    `<p>This question has no functional behavior of its own to test — it grades whether the OTHER five questions' code was organized the way this file lays out (one folder per concern: <code>screens/</code>, <code>components/</code>, <code>utils/</code>) rather than, say, one giant <code>App.js</code> containing every screen inline. Extracting the repeated list-row markup (used identically in Question 2's <code>FlatList renderItem</code>) into a standalone <code>PlotListItem</code> component is the concrete piece of evidence a grader can point to for "clear project structure" — it is the same JSX Question 2's inline row already contains, just named and separated so it is reusable and independently readable.</p>`,
    `<p>Câu này không có hành vi chức năng riêng để kiểm tra — nó chấm xem mã của 5 câu KHÁC có được tổ chức đúng theo cách file này bày ra hay không (mỗi mối quan tâm 1 thư mục: <code>screens/</code>, <code>components/</code>, <code>utils/</code>) thay vì gom hết vào 1 <code>App.js</code> khổng lồ chứa mọi màn hình lồng nhau. Tách phần markup dòng danh sách lặp lại (dùng y hệt trong <code>renderItem</code> của FlatList ở Câu 2) thành component <code>PlotListItem</code> riêng là bằng chứng cụ thể giám khảo có thể chỉ ra cho "cấu trúc dự án rõ ràng" — đúng là JSX dòng đã có sẵn ở Câu 2, chỉ đặt tên và tách ra để dùng lại được và đọc độc lập được.</p>`,
  ),
  rubric: [
    { id: 'clear_folder_organization', criterion: B('Screens, reusable components, and storage/utility logic live in clearly separated files/folders rather than one monolithic file.', 'Màn hình, component dùng lại, và logic storage/utility nằm ở file/thư mục tách bạch rõ ràng, không dồn vào 1 file khổng lồ.'), weight: 1, maxScore: 0.4 },
    { id: 'reusable_component_extracted', criterion: B('Repeated UI (like the plot list row) is extracted into its own component rather than duplicated inline.', 'UI lặp lại (như dòng danh sách lô) được tách thành component riêng thay vì lặp lại tại chỗ.'), weight: 1, maxScore: 0.3 },
    { id: 'easy_to_use_interface', criterion: B('The interface provides clear affordances for every required action (search, view detail, add, edit, delete) without hidden or ambiguous controls.', 'Giao diện có cách thao tác rõ ràng cho mọi hành động yêu cầu (tìm kiếm, xem chi tiết, thêm, sửa, xoá), không có control ẩn hoặc mơ hồ.'), weight: 1, maxScore: 0.3 },
  ],
};

const spec = {
  course: { courseCode: 'MMA301' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE1',
    title: 'MMA301 – Practical Exam (Fall 2024), Land Manager App|||MMA301 – Thi thực hành (Fall 2024), App Land Manager',
    description: 'MMA301 PE (CODE): React Native + Expo client-only app (AsyncStorage, react-navigation, react-native-maps) for managing land plots — list+search, add/edit form, map markers, delete, project structure/UX, AI-graded.|||PE MMA301 (viết mã): app React Native + Expo thuần client (AsyncStorage, react-navigation, react-native-maps) quản lý lô đất — danh sách+tìm kiếm, form thêm/sửa, marker bản đồ, xoá, cấu trúc dự án/UX, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5, q6],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
