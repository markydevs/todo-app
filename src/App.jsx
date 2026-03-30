import React, { useState, useEffect } from "react";
import supabase from "./helper/supabaseClient";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo() {
    if (title.trim() === "") {
      alert("Please enter a todo title.");
      return;
    }

    const { error } = await supabase
      .from("todos")
      .insert({ title, completed: false });

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      setTitle("");
      fetchTodos();
    }
  }

  async function deleteTodo(id) {
    await supabase.from("todos").delete().eq("id", id);
    fetchTodos();
  }

  async function updateTodo(id, currentTitle) {
    const newTitle = prompt("Enter new title:", currentTitle);

    if (!newTitle || newTitle.trim() === "") return;

    await supabase.from("todos").update({ title: newTitle }).eq("id", id);
    fetchTodos();
  }

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data || []);
    }
  }

  async function completeTodo(id) {
    await supabase.from("todos").update({ completed: true }).eq("id", id);
    fetchTodos();
  }

  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Todo List</h1>

        <div className="mb-8 flex gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          />
          <button
            onClick={addTodo}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Incomplete Todos
          </h2>

          <div className="space-y-3">
            {incompleteTodos.length === 0 ? (
              <p className="text-gray-500">No incomplete todos.</p>
            ) : (
              incompleteTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
                >
                  <span className="text-gray-800">{todo.title}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => completeTodo(todo.id)}
                      className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateTodo(todo.id, todo.title)}
                      className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Completed Todos
          </h2>

          <div className="space-y-3">
            {completedTodos.length === 0 ? (
              <p className="text-gray-500">No completed todos.</p>
            ) : (
              completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
                >
                  <span className="text-gray-500 line-through">
                    {todo.title}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;