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
  const [existingEmail, setExistingEmail] = useState(false);
  const [existingMobile, setExistingMobile] = useState(false);

  const checkIfExists = async (field: 'email' | 'mobile', value: string) => {
    try {
      const response = await axios.get(`/check-${field}?${field}=${value}`);
      if (response.data.exists) {
        if (field === 'email') {
          setExistingEmail(true);
          setError('email', {
            type: 'manual',
            message: 'Email already exists',
          });
        } else if (field === 'mobile') {
          setExistingMobile(true);
          setError('mobile', {
            type: 'manual',
            message: 'Mobile number already exists',
          });
        }
      } else {
        if (field === 'email') {
          setExistingEmail(false);
          clearErrors('email');
        } else if (field === 'mobile') {
          setExistingMobile(false);
          clearErrors('mobile');
        }
      }
    } catch (error) {
      console.error(`Error checking ${field}:`, error);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    try {
      if ((data.country as any).value === 'Other') {
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

      await checkIfExists('email', data.email);
      await checkIfExists('mobile', data.mobile);
    
      if (Object.keys(errors).length === 0 && !existingEmail && !existingMobile) {
      const response = await axios.post('/auth/register', data);
      console.log(response)
      alert('Registration successful!');
      router.push('/login');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data.message || error.response.data.error;
        alert(`Registration failed: ${errorResponse}`);
      } else {
        alert('An unexpected error occurred.');
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
          className={`${styles.input} ${existingMobile || errors.mobile ? styles.errorField : ''}`}
          onBlur={() => checkIfExists('mobile', 'mobile')}
        />
        {existingMobile && <p className={styles.warning}>Mobile number already exists</p>}
        <p className={styles.error}>{errors.mobile?.message}</p>

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
          className={`${styles.input} ${existingEmail || errors.email ? styles.errorField : ''}`}
          onBlur={() => checkIfExists('email', 'email')}
        />
        {existingEmail && <p className={styles.warning}>Email already exists</p>}
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
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,20}$/,
      message: 'Password must contain at least one special character and one number',
    },
  })}
  placeholder="Password"
  className={errors.password ? styles.errorField : ''}
/>
        <p className={styles.error}>{errors.password?.message}</p>

        <button type="submit" disabled={isSubmitting}>Register</button>
      </form>
    </div>
  );
}
