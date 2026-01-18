import { useEffect, useMemo, useState, useRef } from "react"
import {v4 as uuidv4} from "uuid"

const STORAGE_KEY = "kenc-taskapp:v1"

function TaskItem({task, onDelete, onToggleDone, onStartEdit }) {
    return (
        <li style={{ display: "flex", gap: 12, alignItems: "center"}}>
            <input type="checkbox"
                   checked={task.done}
                   onChange={() => onToggleDone(task.id)}
            />
            <span style={{ textDecoration: task.done ? "line-through" : "none"}}>
                { task.title }
            </span>

            <button onClick={() => onStartEdit(task.id)}>編集</button>
            <button onClick={() => onDelete(task.id)}>削除</button>
        </li>
    )
}

export default function App() {
    // 1) 初期化は空、読み込みはuseEffectで行う(= 副作用)
    const hasLoaded = useRef(false);
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState("");
    const [visible, setVisible] = useState(true);

    //編集状態(どのタスクを編集中か)
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // 2) 初回マウント時:localstrageから読み込み(useEffect
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        console.log(raw);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setTasks(parsed);
                    hasLoaded.current = true;
                    return;
                }
            } catch {
                // 壊れてたら無視
            }
        }
        // サンプルデータで初期化
        setTasks([
            {id: uuidv4(), title: "Reactの勉強", done: false},
            {id: uuidv4(), title: "応用情報の勉強", done: false},
            {id: uuidv4(), title: "デザイン練習", done: false},
        ]);
        hasLoaded.current = true;
    }, []);

    // 3) tasksが変わるたびlocalStorageへ保存(useEffect)
    useEffect(() => {
        if (!hasLoaded.current) {
            console.log("skip save (not loaded yet");
            return;
        };
        console.log("saving...", tasks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    // 追加
    function addTask(){
        const title = text.trim();
        if (!title) return;

        setTasks((prev) => [...prev, {id: uuidv4(), title, done:false}])
        setText("")
    }

    // 削除(prev版)
    function deleteTask(id) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setEditingText("");
        }
    }

    // 完了切り替え(更新:map)
    function toggleDone(id) {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? {...t, done: !t.done} : t))
        );
    }

    // 編集開始
    function startEdit(id) {
        const target = tasks.find((t) => t.id === id);
        if (!target) return;
        setEditingId(target.id);
        setEditingText(target.title);
    }

    // 編集確定(更新:map)
    function saveEdit() {
        const title = editingText.trim();
        if (!editingId || !title) return;

        setTasks((prev) =>
            prev.map((t) => (t.id === editingId ? { ...t, title } : t))
        );
        setEditingId(null);
        setEditingText("");
    }

    // 表示用(ロジック分離)
    const taskItems = useMemo(
        () =>
            tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    onToggleDone={toggleDone}
                    onStartEdit={startEdit}
                />
            )),
        [tasks]
    );

    const doneCount = tasks.filter((t) => t.done).length;

    return(
        <div style={{ padding: 24 }}>
            <h1>Lv3 Task App</h1>

            {/* 追加 */}
            <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="新しいタスク"
                />
                <button onClick={addTask}>追加</button>
            </div>

            {/* 編集 */}
            {editingId && (
                <div style={{marginTop: 12, display: "flex", gap: 8}}>
                    <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        placeholder="編集内容"
                    />
                    <button onClick={saveEdit}>保存</button>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setEditingText("");
                        }}>
                        キャンセル
                    </button>
                </div>
            )}

            {/* 表示切り替え */}
            <div style={{marginTop: 12}}>
                <button onClick={() => setVisible((v) => !v)}>
                    {visible ? "隠す" : "表示する"}
                </button>
                <span style={{ marginLeft: 12}}>
                    全{tasks.length}件 / 完了{doneCount}件
                </span>
            </div>

            {/* リスト */}
            {visible && <ul style={{ paddingLeft: 18}}>{taskItems}</ul> }
        </div>
    );
}