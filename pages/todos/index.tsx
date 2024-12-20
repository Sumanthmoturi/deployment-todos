import { GetServerSidePropsContext } from 'next';
import axios from '../../utils/axios';
import styles from '../../styles/Todos.module.css';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';

type Todo = {
  id: number;
  name: string;
  description: string;
  status: string;
};

interface TodosPageProps {
  initialTodos: Todo[];
  statusFilter: string;
}

export default function Todos({ initialTodos, statusFilter }: TodosPageProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [currentStatusFilter, setStatusFilter] = useState<string>(statusFilter);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilteredTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get('access_token');
      const response = await axios.get('/todo', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: currentStatusFilter || undefined },
      });
      console.log('Todos fetched from server:', response.data.todos);
      setTodos(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;

      console.error('Failed to fetch todos:', axiosError);

      if (axiosError.response?.status === 401) {
        alert('You are not authorized. Please login.');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [currentStatusFilter, router]);

  useEffect(() => {
    fetchFilteredTodos();
  }, [currentStatusFilter, fetchFilteredTodos]);

  const toggleTodoStatus = async (todo: Todo) => {
    const updatedStatus = todo.status === 'Completed' ? 'In progress' : 'Completed';
    setTodos((prevTodos) =>
      prevTodos.filter((t) =>
        t.id === todo.id ? updatedStatus === currentStatusFilter || !currentStatusFilter : true
      )
    );
  
    try {
      const response = await axios.patch(`/todo/${todo.id}/status`, {
        status: updatedStatus,
      });
      if (response.data.updatedStatus !== updatedStatus) {
        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.id === todo.id ? { ...t, status: response.data.updatedStatus } : t
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating todo status');
      setTodos((prevTodos) => [...prevTodos, todo]);
    }
  };
  

  const handleLogout = async () => {
    Cookies.remove('access_token');
    alert('You have been logged out.');
    router.push('/login');
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
        value={currentStatusFilter}
      >
        <option value="">All</option>
        <option value="In progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
       
      <div className={styles.todoGrid}>
      {todos.length > 0 ? (
        todos.map((todo) => (
          <div key={todo.id} className={styles.todoItem}>
            <h3 className={styles.heading3}>Name: {todo.name}</h3>
            <p className={styles.paragraph}>Description: {todo.description}</p>
            <p className={styles.paragraph}>Status: {todo.status}</p>
            <button onClick={() => toggleTodoStatus(todo)} className={styles.button1}>
              Mark as {todo.status === 'Completed' ? 'In Progress' : 'Completed'}
            </button>
          </div>
        ))
      ) : (
        <p className={styles.endpara}>No todos available.</p>
      )}
    </div>
  </div>
);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies['access_token'];
  const statusFilter = context.query.status || '';

  if (!token) {
    return {
      props: {
        initialTodos: [],
        statusFilter: statusFilter as string,
      },
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.get('/todo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { status: statusFilter || undefined },
    });
    console.log('Todos fetched from server:', response.data);

    return {
      props: {
        initialTodos: response.data.todos|| [],
        statusFilter: statusFilter as string,
      },
    };
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return {
      props: {
        initialTodos: [],
        statusFilter: statusFilter as string, 
      },
    };
  }
}
