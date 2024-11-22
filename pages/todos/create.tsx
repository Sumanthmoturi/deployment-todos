import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../../utils/axios';  
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';  
import styles from '../../styles/Form.module.css';

const statusOptions = [
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

type TodoFormInputs = {
  name: string;
  description: string;
  time: number;
  status: string;
};

export default function CreateTodo() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TodoFormInputs>(); 
  const router = useRouter();

  const onSubmit: SubmitHandler<TodoFormInputs> = async (data) => {
    const token = localStorage.getItem('token');

    const status = statusOptions.find(option => option.label === data.status)?.value || '';
    const payload = { ...data, status };

    try {
      // Ensure token is available
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return router.push('/login');
      }

      await axios.post('/todo', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Todo created successfully');
      router.push('/todos');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;

        // Handle specific error messages
        if (errorMessage === 'Name is required') {
          setError('name', { message: 'Name is required' });
        } else if (errorMessage === 'Description is required') {
          setError('description', { message: 'Description is required' });
        } else if (errorMessage === 'Invalid status') {
          setError('status', { message: 'Please select a valid status' });
        } else {
          alert(`Error: ${errorMessage}`);
        }
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Todo</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
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

        {/* Description Field */}
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

        {/* Time Field */}
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

        {/* Status Dropdown */}
        <select
          {...register('status', {
            required: 'Status is required',
            validate: (value) => !!statusOptions.find(option => option.label === value) || 'Invalid status',
          })}
        >
          <option value="" disabled hidden>Select Status</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.status && <p className={styles.error}>{errors.status.message}</p>}

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
