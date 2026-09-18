import { useEffect, useRef, useState } from "react";
import Trashcan from "./assets/trashcan.svg";
import EditIcon from "./assets/edit.svg";

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/todos?limit=3");
        const data = await response.json();
        console.log(data.todos);
        setTodos(data.todos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (itemId) => {
    // გადავუაროთ todo სიას, ვიპოვოთ ელემენტი, რომელზეც მომხმარებელი აჭერს
    // განვაახლოთ completed მნიშვნელობა საპირისპიროთი
    const updatedTodos = todos.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    );
    setTodos(updatedTodos);
    // console.log(itemId, updatedTodos);
  };

  const handleDelete = (itemId) => {
    // გადავუაროთ todo სიას და გავფილტროთ ელემენტები, id-ზე დაყრდნობით
    const filteredTodos = todos.filter((item) => item.id !== itemId);
    setTodos(filteredTodos);
  };

  const addTodo = () => {
    const value = inputRef.current.value;

    if (value === "") return;

    const newTodo = {
      completed: false,
      id: Date.now(),
      todo: value,
    };

    // todos.push(newTodo);
    const updatedTodos = [newTodo, ...todos];
    console.log(updatedTodos);
    setTodos(updatedTodos);
    inputRef.current.value = "";
    // todos - [1, 2, 3] - მისამართი A
    // todos.push(4) - [1, 2, 3, 4] - მისამართი A
    // მისამართი A === მისამართი A
  };

  // const num1 = 5;
  // const num2 = 5;
  // console.log(num1 === num2);
  // const var1 = "Georgia";
  // const var2 = "Georgia";
  // console.log(var1 === var2);

  // const arr1 = [1, 2, 3]; // მისამართი C
  // const arr2 = [1, 2, 3]; // მისამართი D
  // console.log(arr1 === arr2); // C !== D

  const handleEdit = (item) => {
    setSelectedTodo(item);
  };

  const handleSave = (todoId) => {
    const newTodoValue = editInputRef.current.value;

    const updatedTodos = todos.map((item) =>
      item.id === todoId ? { ...item, todo: newTodoValue } : item,
    );
    setTodos(updatedTodos);
    setSelectedTodo(null);
  };
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
