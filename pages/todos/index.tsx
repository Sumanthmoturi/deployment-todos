import { GetServerSidePropsContext } from 'next'; 
import axios from '../../utils/axios';
import styles from '../../styles/Todos.module.css';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

type Todo = {
  id: number;
  name: string;
  description: string;
  status: string;
};

interface TodosPageProps {
  initialTodos: Todo[];
}

export default function Todos({ initialTodos }: TodosPageProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilteredTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/todo', {
        params: { status: statusFilter || undefined },
      });
      setTodos(response.data.todos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchFilteredTodos();
  }, [statusFilter, fetchFilteredTodos]);

  const toggleTodoStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'Completed' ? 'In progress' : 'Completed';
    setLoading(true);

    try {
      const response = await axios.patch(`/todo/${todo.id}/update-status`, { 
        status: newStatus 
      });
      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, status: response.data.updatedStatus } : t)));
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating todo status');
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      alert('You have been logged out.');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Error logging out');
    }
  };

  const handleCreateTodo = () => {
    router.push('/todos/create'); 
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading2}>Todos</h2>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
      <button onClick={handleCreateTodo} className={styles.createButton}>
        Create Todo
      </button>

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
              <h3 className={styles.heading3}>Name: {todo.name}</h3>
              <p className={styles.paragraph}>Description: {todo.description}</p>
              <p className={styles.paragraph}>Status: {todo.status}</p>


              <button onClick={() => toggleTodoStatus(todo)} className={styles.button1}>
                Mark as {todo.status === 'Completed' ? 'In Progress' : 'Completed'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.endpara}>No todos available.</p>
      )}
    </div>
    </div>
  );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {

    try {
      
      const response = await axios.get('/todos');
    return {
      props: {
        initialTodos: response.data,
      },
    };
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return {
      props: {
        initialTodos: [],
      },
    };
  }
  
}