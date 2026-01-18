import { useState } from "react"
import {v4 as uuidv4} from "uuid"
// import TaskItem from "./components/TaskItem.jsx";
function TaskItem({ task, onDelete }) {
    return (
        <li>
            { task.title }
            <button onClick={() => onDelete(task.id)} style={{marginLeft: 20}}>削除</button>
        </li>
    )
}

export default function App() {
    const [tasks, setTasks] = useState([
        {id: uuidv4(), title: "Reactの勉強"},
        {id: uuidv4(), title: "応用情報の勉強"},
        {id: uuidv4(), title: "デザイン練習"}
    ]);
    const [text, setText] = useState("");
    const [visible, setVisible] = useState(true);

    function deleteTask(id) {
        console.log(`deleteTask called for index: ${id}`)
        setTasks((prev) => prev.filter(task => task.id !== id));
    }

    // 表示用データを事前に作成(ロジック分離)
    console.log(tasks);
    const taskItems = tasks.map((task) => {
        return <TaskItem key={task.id} task={task} onDelete={deleteTask}/>
    });
    console.log(taskItems)

    function addTask() {
        if (!text) return;
        setTasks((prev) => [...prev, {id: uuidv4(), title: text} ]);
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