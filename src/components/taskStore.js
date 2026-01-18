import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export const useTaskStore = create(
    persist(
        (set, get) => ({
            tasks: [],

            addTask: (title) =>
                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        { id: uuidv4(), title, done: false },
                    ],
                })),

            deleteTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== id),
                })),

            toggleDone: (id) =>
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, done: !t.done } : t
                    ),
                })),

            updateTask: (id, title) =>
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, title } : t
                    ),
                })),
        }),
        {
            name: "kenc-taskapp-zustand", // localStorageキー
        }
    )
);
