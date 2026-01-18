import { useState } from "react"
import Greeting from "./components/Greeting.jsx";

export default function App() {
    const [count, setCount] = useState(0)

    return (
        <div style={{ padding: 24 }}>
            <h1>React Lv1</h1>
            <Greeting name="けんちゃん" />

            <p>count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(0)} style={{marginLeft: 8}}>Reset</button>
        </div>
    )
}