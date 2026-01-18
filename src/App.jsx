import { useState } from "react";
import { useTaskStore } from "./components/taskStore";

// UIコンポーネント
function TaskItem({ task, onDelete, onToggleDone, onStartEdit }) {
    return (
        <li style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleDone(task.id)}
            />

            <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
        {task.title}
      </span>

            <button onClick={() => onStartEdit(task.id)}>編集</button>
            <button onClick={() => onDelete(task.id)}>削除</button>
        </li>
    );
}

export default function App() {
    // Zustand ストアから取得
    const { tasks, addTask, deleteTask, toggleDone, updateTask } =
        useTaskStore();

    // UI専用のstate
    const [text, setText] = useState("");
    const [visible, setVisible] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // 追加
    function handleAdd() {
        const title = text.trim();
        if (!title) return;

        addTask(title);
        setText("");
    }

    // 編集開始
    function startEdit(id) {
        const target = tasks.find((t) => t.id === id);
        if (!target) return;

        setEditingId(id);
        setEditingText(target.title);
    }

    // 編集保存
    function saveEdit() {
        const title = editingText.trim();
        if (!editingId || !title) return;

        updateTask(editingId, title);
        setEditingId(null);
        setEditingText("");
    }

    // 表示用リスト
    const taskItems = tasks.map((task) => (
        <TaskItem
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onToggleDone={toggleDone}
            onStartEdit={startEdit}
        />
    ));

    const doneCount = tasks.filter((t) => t.done).length;

    return (
        <div style={{ padding: 24 }}>
            <h1>Lv4 Zustand Task App</h1>

            {/* 追加 */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="新しいタスク"
                />
                <button onClick={handleAdd}>追加</button>
            </div>

            {/* 編集 */}
            {editingId && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
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
                        }}
                    >
                        キャンセル
                    </button>
                </div>
            )}

            {/* 表示切り替え */}
            <div style={{ marginTop: 12 }}>
                <button onClick={() => setVisible((v) => !v)}>
                    {visible ? "隠す" : "表示する"}
                </button>
                <span style={{ marginLeft: 12 }}>
          全{tasks.length}件 / 完了{doneCount}件
        </span>
            </div>

            {/* リスト */}
            {visible && <ul style={{ paddingLeft: 18 }}>{taskItems}</ul>}
        </div>
    );
}
