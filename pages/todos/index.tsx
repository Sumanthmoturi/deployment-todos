import { GetServerSidePropsContext } from 'next'; 
import axios from '../../utils/axios';
import Link from 'next/link';
import styles from '../../styles/Todos.module.css';
import { useEffect, useState } from 'react';

type Todo = {
  id: number;
  name: string;
  description: string;
  status: string; // "in progress" or "completed"
};

interface TodosPageProps {
  initialTodos: Todo[];
}

export default function Todos({ initialTodos }: TodosPageProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    if (statusFilter) fetchFilteredTodos();
  }, [statusFilter]);

  const fetchFilteredTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/todo', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: statusFilter },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch filtered todos:', error);
    }
  };

  const toggleTodoStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'completed' ? 'in progress' : 'completed';
      const token = localStorage.getItem('token');
      await axios.patch(`/todo/${todo.id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodos(todos.map(t => (t.id === todo.id ? { ...t, status: newStatus } : t)));
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

      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>
              <p>Status: {todo.status}</p>

              <Link href={`/todos/${todo.id}`}>
                <button>Edit</button>
              </Link>

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
  );
}

// Server-side function with correct type
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies['token'];

  try {
    const response = await axios.get('/todo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { props: { initialTodos: response.data } };
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return { props: { initialTodos: [] } };
  }
}