import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios'; 
import customAxios from '../utils/axios'; 
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';


type LoginFormData = {
  mobile: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    console.log('Login Data:', data);
    try {
      const response = await customAxios.post('/auth/login', data);
      console.log('Login Response:', response.data);

      localStorage.setItem('token', response.data.accessToken);
      alert('Login successful');
      router.push('/todos/create');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Login Error:', err);

       
    setError('mobile', { message: '' });
    setError('password', { message: '' });

       
        const errorMessage = err.response?.data?.message;

        if (errorMessage === 'Incorrect mobile number') {
          setError('mobile', { message: 'Incorrect mobile number' });
        } else if (errorMessage === 'Incorrect password') {
          setError('password', { message: 'Incorrect password' });
        } else if (errorMessage === 'Both mobile number and password are incorrect') {
          setError('mobile', { message: 'Incorrect mobile number' });
          setError('password', { message: 'Incorrect password' });
        } else {
          alert('Invalid Credentials');
        }
      } else {
        console.error('Unexpected Error:', err);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('mobile', { required: 'Mobile number is required' })}
          placeholder="Mobile"
        />
        {errors.mobile && <p className={styles.error}>{errors.mobile.message}</p>}

        <input
          {...register('password', { required: 'Password is Required' })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
