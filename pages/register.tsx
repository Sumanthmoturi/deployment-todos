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

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      if ((data.country as Option).value === 'Other') {
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

      if (!data.name || !data.email || !data.mobile || !data.password) {
        alert('All fields are required');
        return;
      }

      await axios.post('/auth/register', data);
      alert('User registered successfully!');
      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 409) {
          alert(error.response.data.message);
        } else {
          alert('Registration failed. Please try again.');
        }
      } else {
        alert('An unknown error occurred.');
      }
    }
  };

  const handleCountryChange = (selectedOption: SingleValue<Option>) => {
    setValue('country', selectedOption || '');
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
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="Email"
        />
        <p className={styles.error}>{errors.email?.message}</p>

        <input
          {...register('password', { required: 'Password is required' })}
          type="password"
          placeholder="Password"
        />
        <p className={styles.error}>{errors.password?.message}</p>

        <button type="submit" className={styles.registerButton}>
          Register
        </button>
      </form>
    </div>
  );
}
