import { useEffect, useState, useCallback } from 'react';
import axios from '../../utils/axios';
import styles from '../../styles/Todos.module.css';

type Todo = {
  id: number;
  name: string;
  description: string;
  status: string;
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(''); 

  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/todo', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: statusFilter || undefined },
      });
      setTodos(response.data as Todo[]);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  }, [statusFilter]); 

  useEffect(() => {
    if (statusFilter || !statusFilter) fetchTodos();
  }, [statusFilter, fetchTodos]); 

  const toggleTodoStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'completed' ? 'in progress' : 'completed';
      const token = localStorage.getItem('token');
      await axios.patch(`/todo/${todo.id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

     
      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, status: newStatus } : t)));
    } catch (error) {
      console.error('Failed to update todo status:', error);
      alert('Error updating the todo status');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Todos</h2>

     
      <select
        className={styles.select}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <div className={styles.todoList}>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>

              {/* Status Display */}
              <p>
                Status:{' '}
                <span
                  className={
                    todo.status === 'completed'
                      ? styles.completed
                      : styles.inProgress
                  }
                >
                  {todo.status}
                </span>
              </p>

              
              <button onClick={() => toggleTodoStatus(todo)}>
                Mark as {todo.status === 'completed' ? 'In Progress' : 'Completed'}
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

export async function getServerSideProps() {
  try {
    const response = await axios.get('/todo'); // Fetch todos from your backend API
    return {
      props: { initialTodos: response.data },
    };
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return { props: { initialTodos: [] } };
  }
}