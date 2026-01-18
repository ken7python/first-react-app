import { useState } from "react"
import TaskItem from "./components/TaskItem.jsx";

export default function App() {
    const [tasks, setTasks] = useState([
        "Reactの勉強",
        "応用情報の勉強",
        "デザイン練習"
    ]);
    const [text, setText] = useState("");
    const [visible, setVisible] = useState(true);

    // 表示用データを事前に作成(ロジック分離)
    console.log(tasks);
    const taskItems = tasks.map((task, index) => {
        const label = `${index + 1}. ${task}`;
        return <TaskItem key={index} task={label}/>
    });
    console.log(taskItems)

    function addTask() {
        if (!text) return;
        setTasks([...tasks, text]);
        setText("");
    }

    function toggleVisible() {
        setVisible(!visible);
    }

    return (
        <div style={{padding: 24}}>
            <h1>Lv2 Clean React</h1>

            {/* 入力エリア */}
            <div>
                <input value={text}
                       onChange={(e) => setText(e.target.value)}
                       placeholder="新しいタスク"
                />
                <button onClick={addTask}>追加</button>
            </div>

            {/* 表示切り替え */}
            <button onClick={toggleVisible}>
                {visible ? "隠す" : "表示する"}
            </button>

            {/* リスト表示 */}
            {visible && <ul>{taskItems}</ul>}
        </div>
    );
}