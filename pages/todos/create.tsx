import { useForm } from 'react-hook-form';
import axios from '../../utils/axios';
import { useRouter } from 'next/router';
import styles from '../../styles/Form.module.css';

export default function CreateTodo() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const token = localStorage.getItem('token');
    await axios.post('/todo', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Todo created');
    router.push('/todos');
  };

  return (

    <div className={styles.container}>

      <h2>Create Todo</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input {...register('name', { required: true })} placeholder="Name" />

        <input {...register('description', { required: true })} placeholder="Description" />

        <input {...register('time', { required: true })} placeholder="Time" />

        <select {...register('status', { required: true })}>

          <option value="in progress">In Progress</option>

          <option value="completed">Completed</option>

        </select>

        <button type="submit">Create</button>

      </form>

    </div>

  );

}
