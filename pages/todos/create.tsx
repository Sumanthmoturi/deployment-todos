import { useForm } from 'react-hook-form';
import axios from '../../utils/axios';  
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';  
import styles from '../../styles/Form.module.css';

const statusOptions = [
  { value: 'in progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function CreateTodo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem('token');

    // Make sure status is stored as a string (either "in progress" or "completed")
    const status = statusOptions.find(option => option.label === data.status)?.value || '';

    // Add status as a string to the data before sending to the API
    const payload = { ...data, status };

    try {
      const response = await axios.post('/todo', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Todo created successfully');
      router.push('/todos');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        alert(`Error: ${error.response?.data.message}`);
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
        {errors.name && <p className={styles.error}>{String(errors.name.message)}</p>}

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
        {errors.description && <p className={styles.error}>{String(errors.description.message)}</p>}

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
        {errors.time && <p className={styles.error}>{String(errors.time.message)}</p>}

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
        {errors.status && <p className={styles.error}>{String(errors.status.message)}</p>}

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
