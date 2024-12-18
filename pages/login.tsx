import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios'; 
import customAxios from '../utils/axios'; 
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';
import { useState } from 'react';
import Cookies from 'js-cookie';

type LoginFormData = {
  mobile: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await customAxios.post('/auth/login', data);
      alert('Login successful');
      router.push('/todos');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;

        if (errorMessage === 'Incorrect mobile number') {
          setError('mobile', { message: 'Incorrect mobile number' });
        } else if (errorMessage === 'Incorrect password') {
          setError('password', { message: 'Incorrect password' });
        } else if (errorMessage === 'Both mobile number and password are incorrect') {
          setError('mobile', { message: 'Incorrect mobile number' });
          setError('password', { message: 'Incorrect password' });
        } else {
          alert('Login failed. Please try again');
        }
      } else {
        console.error('Unexpected Error:', err);
        alert('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
      <input
          {...register('mobile', {
            required: 'Mobile number is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Mobile number must be exactly 10 digits'
            }
          })}
          placeholder="Mobile"
          disabled={isSubmitting}
        />
        {errors.mobile && <p className={styles.error}>{errors.mobile.message}</p>}

        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 5,
              message: 'Password should be at least 5 characters long'
            },
            maxLength: {
              value: 20,
              message: 'Password should be at most 20 characters long'
            }
          })}
          type="password"
          placeholder="Password"
          disabled={isSubmitting}
        />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</button>
      </form>
      <div className={styles.redirectButton}>
        <button onClick={() => router.push('/register')}>Go to Register</button>
      </div>
    </div>
  );
}
