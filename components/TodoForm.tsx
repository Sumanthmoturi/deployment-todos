import { useForm } from 'react-hook-form';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';


interface TodoFormData {
  name: string;
  description: string;
  time: number;
  status:string;
}

export default function TodoForm() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<TodoFormData>(); 
  const router = useRouter();

  const onSubmit = async (data: TodoFormData) => { 
    try {
      const token = localStorage.getItem('token');
      await axios.post('/todo', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Todo created Successfully');
      router.push('/todos');
    } catch (error:any) {
      if (error.response?.data.message.includes('Name already exists')) {
        setError('name', {
          type: 'manual',
          message: 'Name already exists. Please choose another one.',
        });
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Todo</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
      <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Name"
          className={errors.name ? styles.errorField : ''}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        <input
          {...register('description', { required: 'Description is required' })}
          placeholder="Description"
          className={errors.description ? styles.errorField : ''}
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}
        <input
          {...register('time', {
            required: 'Time is required',
            valueAsNumber: true,
            validate: (value) => value > 0 || 'Time must be greater than 0',
          })}
          type="number"
          placeholder="Time (in minutes)"
          className={errors.time ? styles.errorField : ''}
        />
        {errors.time && <p className={styles.error}>{errors.time.message}</p>}

        <select
          {...register('status', { required: 'Status is required' })}
          className={errors.status ? styles.errorField : ''}
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {errors.status && <p className={styles.error}>{errors.status.message}</p>}

        <button type="submit">Create</button>
      </form>
    </div>
  );
}