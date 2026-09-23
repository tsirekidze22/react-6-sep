import { useEffect, useRef, useState } from "react";
import Trashcan from "./assets/trashcan.svg";
import EditIcon from "./assets/edit.svg";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("https://dummyjson.com/todos?limit=3"); // API Endpoint
        // const response2 = await fetch("https://dummyjson.com/todos?limit=3", {
        //   method: "get"
        // }); // API Endpoint
        // console.log(response);
        // const data = await response.json();
        // console.log(data.todos);
        // setTodos(data.todos);

        const response = await axios.get("https://dummyjson.com/todos?limit=5");
        const data = response.data;
        setTodos(data.todos);
        console.log(data.todos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // დამატება - POST METHOD
  const addTodo = async () => {
    const value = inputRef.current.value;

    if (value === "") return;

    try {
      const response = await axios.post(`https://dummyjson.com/todos/add`, {
        completed: false,
        todo: value,
        userId: 13,
      });
      console.log(response);
      const data = response.data;
      const updatedTodos = [data, ...todos];
      setTodos(updatedTodos);
      inputRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  // განახლება - PATCH
  const handleToggle = async (itemId) => {
    const todo = todos.find((item) => item.id === itemId);
    console.log(todo);
    try {
      const response = await axios.patch(
        `https://dummyjson.com/todos/${itemId}`,
        {
          completed: !todo.completed,
        },
      );
      const data = response.data;
      const updatedTodos = todos.map((item) =>
        item.id === itemId ? data : item,
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setSelectedTodo(item);
  };

  // განახლება - PATCH
  const handleSave = async (todoId) => {
    const newTodoValue = editInputRef.current.value;

    try {
      const response = await axios.patch(
        `https://dummyjson.com/todos/${todoId}`,
        {
          todo: newTodoValue,
        },
      );
      const data = response.data;
      const updatedTodos = todos.map((item) =>
        item.id === todoId ? data : item,
      );
      setTodos(updatedTodos);
      setSelectedTodo(null);
    } catch (error) {
      console.log(error);
    }
  };

  // წაშლა - DELETE
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`https://dummyjson.com/todos/${itemId}`);
      const filteredTodos = todos.filter((item) => item.id !== itemId);
      setTodos(filteredTodos);
    } catch (error) {
      console.log(error);
    }
  };

  // Client = React => fetch => request => API => server => database
  // Server => response
  // API = Application Programming Interface
  // REST API => ინფორმაციის წამოღება - /todos, ინფორმაციის განახლება - /todos/X,
  // ინფორმაციის წაშლა - /todos/X, ინფორმაციის დამატება - /todos/add

  // HTTP = წესებისა/პროტოკოლის ერთობლიობა
  // Methods: POST - დამატება, GET - წამოღება, PATCH - განახლება, DELETE - წაშლა
  // API endpoint = url, რომელზე წვდომასაც სერვერი გვაძლევს

  // CRUD ოპერაციები - Create, Read, Update, Delete
  // https://dummyjson.com/todos/21, method: delete, method: patch

  return (
    <>
      {selectedTodo && (
        <div className="fixed inset-0 bg-gray-800/70 flex justify-center items-center">
          <div className="w-100 p-4 rounded-md bg-white">
            <button onClick={() => setSelectedTodo(null)}>X</button>

            <input
              type="text"
              defaultValue={selectedTodo.todo}
              className="w-full my-3 p-2 border-1 border-stone-800
      rounded-md outline-0"
              ref={editInputRef}
            />
            <button
              className="bg-green-400 text-white cursor-pointer rounded-md px-4 py-2"
              onClick={() => handleSave(selectedTodo.id)}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Enter todo..."
        className="w-100 m-3 p-2 border-1 border-stone-800
      rounded-md outline-0"
        ref={inputRef}
      />
      <button
        className="bg-green-400 text-white cursor-pointer rounded-md px-4 py-2"
        onClick={addTodo}
      >
        Add
      </button>
      <ul>
        {todos.map((item) => (
          <li
            key={item.id}
            className="flex justify-between m-3 border-1 rounded-md p-3 w-120 border-stone-800"
          >
            <h3>{item.todo}</h3>

            <div className="flex gap-x-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(item.id)}
              />

              <button onClick={() => handleDelete(item.id)}>
                <img src={Trashcan} alt="trash can" width={20} />
              </button>

              <button onClick={() => handleEdit(item)}>
                <img src={EditIcon} alt="edit icon" width={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
