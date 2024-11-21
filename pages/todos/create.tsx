import { useForm } from 'react-hook-form';
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
    formState: { errors },
  } = useForm<TodoFormInputs>(); 
  const router = useRouter();

  const onSubmit = async (data: TodoFormInputs) => {
    const token = localStorage.getItem('token');


    const status = statusOptions.find(option => option.label === data.status)?.value || '';

    const payload = { ...data, status };

    try {
      await axios.post('/todo', payload, {
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
        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Name"
        />
        {errors.name && <p className={styles.error}>{String(errors.name.message)}</p>}

        <input
          {...register('description', { required: 'Description is required' })}
          placeholder="Description"
        />
        {errors.description && <p className={styles.error}>{String(errors.description.message)}</p>}

        <input
          {...register('time', { required: 'Time is required' })}
          placeholder="Time in Hours"
          type="number"
        />
        {errors.time && <p className={styles.error}>{String(errors.time.message)}</p>}

        <select
          {...register('status', { required: 'Status is required' })}
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
