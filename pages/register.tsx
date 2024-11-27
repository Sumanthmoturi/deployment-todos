import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';
import Select, { SingleValue, MultiValue } from 'react-select';
import { AxiosError } from 'axios';

type Option = { value: string; label: string };

const countries: Option[] = [
  { value: 'India', label: 'India' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Japan', label: 'Japan' },
  { value: 'USA', label: 'USA' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Other', label: 'Other' },
];

const hobbiesOptions: Option[] = [
  { value: 'Music', label: 'Music' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Painting', label: 'Painting' },
  { value: 'Reading', label: 'Reading' },
  { value: 'Coding', label: 'Coding' },
  { value: 'Other', label: 'Other' },
];

type FormData = {
  name: string;
  mobile: string;
  gender: string;
  country: string;
  otherCountry?: string;
  hobbies: string[];
  otherHobby?: string;
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit,clearErrors, formState: { errors }, setValue, setError } = useForm<FormData>();
  const router = useRouter();

  const [showOtherCountry, setShowOtherCountry] = useState(false);
  const [showOtherHobby, setShowOtherHobby] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState<MultiValue<Option>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (data.country=== 'Other') {
        data.country = data.otherCountry || '';
      }

      if (selectedHobbies.some((hobby) => hobby.value === 'Other')) {
        data.hobbies = [
          ...selectedHobbies.filter((hobby) => hobby.value !== 'Other').map((h) => h.label),
          data.otherHobby || '',
        ];
      } else {
        data.hobbies = selectedHobbies.map((hobby) => hobby.label);
      }

      const response = await axios.post('/auth/register', data);
      console.log('Registration Response:', response.data);

      alert('Registration successful!');
      router.push('/login');
    } catch (err:unknown) {
      if (err instanceof AxiosError) {
        console.error('Registration Error:', err);
        const errorMessage = err.response?.data?.error || err.response?.data?.message;

        console.log('Error Message:', errorMessage);
        if (errorMessage.includes('Email already exists')) {
          setError('email', { message: 'Email already exists' });
        } else if (errorMessage.includes('Mobile already exists')) {
          setError('mobile', { message: 'Mobile already exists' });
        } else {
          alert('Registration failed. Please try again');
        }
      } else {
        console.error('Unexpected Error:', err);
        alert('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
    
  

  const handleCountryChange = (selectedOption: SingleValue<Option>) => {
    setValue('country', selectedOption?.value || '');
    setShowOtherCountry(selectedOption?.value === 'Other');
    if (selectedOption?.value !== 'Other') {
      setValue('otherCountry', '');
    }
  };

  const handleHobbyChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedHobbies(selectedOptions);
    setShowOtherHobby(selectedOptions.some((option) => option.value === 'Other'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.sticker1}></div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Name"   
          className={errors.name ? styles.errorField : ''}
        />
        <p className={styles.error}>{errors.name?.message}</p>

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
          className={errors.mobile ? styles.errorField : ''}
        />
        {errors.mobile && <p className={styles.error}>{errors.mobile.message}</p>}
        <select {...register('gender', { required: 'Gender is required' })} defaultValue="" className={errors.gender ? styles.errorField : ''}>
          <option value="" disabled hidden>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <p className={styles.error}>{errors.gender?.message}</p>

        <Select
          options={countries}
          onChange={handleCountryChange}
          placeholder="Select Country"
        />
        <p className={styles.error}>{errors.country?.message}</p>

        {showOtherCountry && (
          <input
            {...register('otherCountry', { required: 'Enter your country' })}
            placeholder="Enter your country"
            className={errors.otherCountry ? styles.errorField : ''}
          />
        )}
        <p className={styles.error}>{errors.otherCountry?.message}</p>

        <Select
          isMulti
          options={hobbiesOptions}
          onChange={handleHobbyChange}
          placeholder="Select Hobby"
          classNamePrefix="react-select"
          className={styles.multiSelect}
          
        />
        <p className={styles.error}>{errors.hobbies?.message}</p>

        {showOtherHobby && (
          <input
            {...register('otherHobby', { required: 'Enter your hobby' })}
            placeholder="Enter your hobby"
            className={errors.otherHobby ? styles.errorField : ''}
          />
        )}
        <p className={styles.error}>{errors.otherHobby?.message}</p>

        <input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email format'
            }
          })}
          placeholder="Email"
          className={errors.email ? styles.errorField : ''}
          disabled={isSubmitting}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <input
  type="password"
  {...register('password', {
    required: 'Password is required',
    minLength: {
      value: 5,
      message: 'Password should be at least 5 characters long',
    },
    maxLength: {
      value: 20,
      message: 'Password should be at most 20 characters long',
    },
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,20}$/,
      message: 'Password must contain at least one special character and one number',
    },
  })}
  placeholder="Password"
  className={errors.password ? styles.errorField : ''}
  
/>
        <p className={styles.error}>{errors.password?.message}</p>

        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
}
