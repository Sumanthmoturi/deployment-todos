
import { useForm } from 'react-hook-form';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/auth/register', data);
      alert('Registration successful');
      router.push('/login');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name', { required: true })} placeholder="Name" />
        <input {...register('mobile', {required: true })} placeholder="Mobile" />
        <input {...register('gender', { required: true })} placeholder="Gender" />
        <input {...register('country', { required: true })} placeholder="Country" />
        <input {...register('hobbies', { required: true })} placeholder="Hobbies" />
        <input {...register('email', { required: true })} type="email" placeholder="Email" />
        <input {...register('password', { required: true })} type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}


