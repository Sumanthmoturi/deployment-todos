import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Use SubmitHandler for better type handling
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
  country: Option | string;
  otherCountry?: string;
  hobbies: string[];
  otherHobby?: string;
  email: string;
  password: string;
};

export default function Register() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const router = useRouter();

  const [showOtherCountry, setShowOtherCountry] = useState(false);
  const [showOtherHobby, setShowOtherHobby] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState<MultiValue<Option>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsSubmitting(true);
    console.log('Registration form data:', data);
  
    try {
      // Basic frontend validation
      if (!data.name || !data.email || !data.mobile || !data.password) {
        alert('All fields are required');
        setIsSubmitting(false);
        return;
      }
  
      // Country validation
      if (!data.country || (data.country === 'Other' && !data.otherCountry)) {
        alert('Please select or enter a country');
        setIsSubmitting(false);
        return;
      }
  
      if ((data.country as Option).value === 'Other') {
        data.country = data.otherCountry || '';
      }
  
      // Handling 'Other' hobby
      if (selectedHobbies.some((hobby) => hobby.value === 'Other')) {
        data.hobbies = [
          ...selectedHobbies.filter((hobby) => hobby.value !== 'Other').map((h) => h.label),
          data.otherHobby || '',
        ];
      } else {
        data.hobbies = selectedHobbies.map((hobby) => hobby.label);
      }
  
      // API call
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://deployment-todo-backend.onrender.com';
      const response = await axios.post(`${apiUrl}/auth/register`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
  
      console.log('Registration success:', response.data);
      alert('User registered successfully!');
      router.push('/login');
    } catch (error: unknown) {
      setIsSubmitting(false);
  
      
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data;
        if (errorResponse && Array.isArray(errorResponse.response)) {
          alert(`Registration failed: \n${errorResponse.response.join('\n')}`);
        } else {
          alert('Invalid input. Please check your form and try again.');
        }
  
        if (error.response?.status === 409) {
          alert('Email or Mobile already exists!');
        } else {
          alert('An unexpected server error occurred.');
        }
      } else {
        console.error('Unknown error:', error);
        alert('An unknown error occurred.');
      }
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
        />
        <p className={styles.error}>{errors.name?.message}</p>

        <input
          {...register('mobile', { required: 'Mobile is required' })}
          placeholder="Mobile"
        />
        <p className={styles.error}>{errors.mobile?.message}</p>

        <select {...register('gender', { required: 'Gender is required' })} defaultValue="">
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
        />
        <p className={styles.error}>{errors.email?.message}</p>

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
      value: /[A-Za-z0-9!@#$%^&*(),.?":{}|<>]/,
      message: 'Password must contain at least one special character and one number',
    },
  })}
  placeholder="Password"
/>
<p className={styles.error}>{errors.password?.message}</p>

        <button type="submit" disabled={isSubmitting}>Register</button>
      </form>
    </div>
  );
}
