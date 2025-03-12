import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/csrf-token');
      localStorage.setItem('XSRF-TOKEN', response.data.csrf_token);
      console.log('XSRF-TOKEN stocké :', response.data.csrf_token);
    } catch (error) {
      console.error('Erreur lors de la récupération du XSRF-TOKEN :', error);
    }
  };

  // Fonction pour récupérer les todos existants
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api');
      console.log('todos:', response.data);
      setTodos(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des todos :', error);
    }
  };

  useEffect(() => {
    fetchCsrfToken(); // Appeler la fonction pour récupérer le CSRF token
    fetchTodos(); // Récupérer les todos lors du premier rendu
  }, []);

  axios.interceptors.request.use(
    (config) => {
      const xsrfToken = localStorage.getItem('XSRF-TOKEN');
      if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = xsrfToken;
      } else {
        console.warn('XSRF-TOKEN non trouvé dans le localStorage');
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  const addTodo = (e) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '') return;

    axios
      .post('http://localhost:8000/api', { title, description })
      .then((response) => {
        console.log('Tâche ajoutée avec succès :', response.data);
        setTodos([...todos, response.data]);
        setTitle('');
        setDescription('');
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout de la tâche :", error)
      );
  };

  const toggleDone = (id) => {
    axios
      .patch(`http://localhost:8000/api/tasks/${id}`)
      .then((response) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, isDone: true } : todo
          )
        );
      })
      .catch((error) =>
        console.error('Erreur lors de la validation de la tâche :', error)
      );
  };

  const deleteTodo = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:8000/api/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) =>
        console.error('Erreur lors de la suppression de la tâche :', error)
      );
  };
  const editTodo = (e) => {
    e.preventDefault();
    if (!openPopup || !openPopup.id) return;
    console.log(openPopup.id);
    axios
      .patch(`http://localhost:8000/api/tasks/${openPopup.id}`, {
        title: editTitle,
        description: editDescription,
      })
      .then((response) => {
        setTodos(
          todos.map((todo) => (todo.id === openPopup.id ? response.data : todo))
        );
        setOpenPopup(false);
      })
      .catch((error) =>
        console.error("Erreur lors de l'édition de la tâche :", error)
      );
  };

  const handleEditClick = (todo) => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setOpenPopup(todo);
  };

  return (
    <div className="bg-gray-200 p-4 min-h-screen flex justify-center items-center">
      <div className="lg:w-2/4 py-6 bg-white rounded-xl shadow-lg p-6">
        <h1 className="font-bold text-5xl text-center mb-8">To Do List</h1>
        <form onSubmit={addTodo} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="The todo title"
            className="py-4 px-4 w-full bg-gray-200 rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Your description"
            className="py-3 px-4 bg-gray-100 rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="w-28 py-4 px-8 bg-red-500 rounded-xl text-white"
          >
            Add
          </button>
        </form>
        <hr />
        <div className="mt-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`py-4 flex items-center border-b border-gray-300 px-3 ${
                todo.isDone ? 'bg-green-200' : ''
              }`}
            >
              <div className="flex-1 pr-8">
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p className="text-gray-500">{todo.description}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => toggleDone(todo.id)}
                  className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleEditClick(todo)}
                  className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center"
                >
                  <CiEdit />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {openPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={editTodo} className="flex flex-col gap-4">
              <input
                type="text"
                className="py-2 px-4 border rounded-lg"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                className="py-2 px-4 border rounded-lg"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  onClick={() => setOpenPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
