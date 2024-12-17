import { useEffect, useState , useCallback} from 'react';
import axios from '../../utils/axios';
import styles from '../../styles/Todos.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

type Todo = {
  id: number;
  name: string;
  description: string;
  status: string;
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(''); 
  const router=useRouter();
  const { id } = router.query;

  const fetchTodo = useCallback(async () => {
      const token = Cookies.get('access_token');
      if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        router.push('/login');
        return;
      }
    try {
      const response = await axios.get(`/todo/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todo:', error);
      alert('Session expired. Please log in again.');
      router.push('/login');
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchTodo();
    }
  }, [id, fetchTodo]);

  const toggleTodoStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'Completed' ? 'In progress' : 'Completed';
      console.log('Sending status:', newStatus);
      const token = Cookies.get('access_token'); 
      if (!token) {
      throw new Error('Token is missing');
    }
      const response = await axios.patch(`/todo/${todo.id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setTodos(prevTodos => 
        prevTodos.map(t => 
          t.id === todo.id ? { ...t, status: response.data.status } : t
        )
      );
    } catch (error) {
      console.error('Failed to update todo status:', error);
      alert('Error updating the todo status');
    }
  };
  
  
  const handleLogout = () => {
    Cookies.remove('access_token'); 
    alert('You have been logged out.');
  };


  const handleCreateTodo = () => {
    router.push('/todos/create');
  };

  return (
    <div className={styles.container}>
      <h2>Todos</h2>

      <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      <button className={styles.createButton} onClick={handleCreateTodo}>Create Todo</button>

     
      <select
        className={styles.select}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="In progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <div className={styles.todoList}>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>

              <p>
                Status:{' '}
                <span
                  className={
                    todo.status === 'Completed'
                      ? styles.completed
                      : styles.inProgress
                  }
                >
                  {todo.status}
                </span>
              </p>

              
              <button onClick={() => toggleTodoStatus(todo)}>
                Mark as {todo.status === 'Completed' ? 'In Progress' : 'Completed'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No todos available.</p> 
      )}
    </div>
  </div>
  );
}
