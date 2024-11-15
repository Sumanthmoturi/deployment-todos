import { useForm } from 'react-hook-form';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';


interface TodoFormData {
  name: string;
  description: string;
  time: number;
}

export default function TodoForm() {
  const { register, handleSubmit } = useForm<TodoFormData>(); // Specify the form data type here
  const router = useRouter();

  const onSubmit = async (data: TodoFormData) => { // Use the TodoFormData type
    try {
      const token = localStorage.getItem('token');
      await axios.post('/todo', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Todo created');
      router.push('/todos');
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Todo</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name', { required: true })} placeholder="Name" />
        <input {...register('description', { required: true })} placeholder="Description" />
        <input {...register('time', { required: true })} placeholder="Time" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
