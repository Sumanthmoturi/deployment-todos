import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../../utils/axios';  
import { useRouter } from 'next/router';  
import { useState } from 'react';
import styles from '../../styles/Form.module.css';



type TodoFormData = {
  name: string;
  description: string;
  time: number;
  status: string;
};

const statusOptions = [
  { value: 'In progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

export default function CreateTodo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/todos', data);
      alert('Todo created successfully');
      router.push('/todos');
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Error creating Todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Todo</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name', {
            required: 'Name is required',
            maxLength: {
              value: 50,
              message: 'Name cannot exceed 50 characters',
            },
          })}
          placeholder="Name"
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}

        <input
          {...register('description', {
            required: 'Description is required',
            maxLength: {
              value: 200,
              message: 'Description cannot exceed 200 characters',
            },
          })}
          placeholder="Description"
        />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}

        <input
          {...register('time', {
            required: 'Time is required',
            valueAsNumber: true,
            min: {
              value: 1,
              message: 'Time must be at least 1 hour',
            },
            max: {
              value: 24,
              message: 'Time cannot exceed 24 hours',
            },
          })}
          placeholder="Time in Hours"
          type="number"
        />
        {errors.time && <p className={styles.error}>{errors.time.message}</p>}

        <select
          {...register('status', {
            required: 'Status is required',
          })}
        >
          <option value="">Select Status</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.status && <p className={styles.error}>{errors.status.message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
