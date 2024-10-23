
import { useForm } from 'react-hook-form';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    console.log('Login Data:', data); // Debug: Ensure form data is correct
    try {
      const response = await axios.post('/auth/login', data);
      console.log('Login Response:', response.data); // Debug: Check the response data

      localStorage.setItem('token', response.data.accessToken);
      alert('Login successful');
      router.push('/todos/create'); // Redirect to Todos page
    } catch (error) {
      console.error('Login Error:', error); // Debug: Log any errors
      alert('Invalid credentials');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('mobile', { required: true })}
          placeholder="Mobile"
        />
        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
