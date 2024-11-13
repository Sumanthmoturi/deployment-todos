import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import styles from '../styles/Form.module.css';
import Select from 'react-select';


const countries = [
  { value: 'India', label: 'India' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Japan', label: 'Japan' },
  { value: 'USA', label: 'USA' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Other', label: 'Other' },
];

const hobbiesOptions = [
  { value: 'Music', label: 'Music' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Painting', label: 'Painting' },
  { value: 'Reading', label: 'Reading' },
  { value: 'Coding', label: 'Coding' },
  { value: 'Other', label: 'Other' },
];

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const router = useRouter();

  const [showOtherCountry, setShowOtherCountry] = useState(false);
  const [showOtherHobby, setShowOtherHobby] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState<any[]>([]);

  const onSubmit = async (data: any) => {
    try {
      if (data.country.value === 'Other') data.country = data.otherCountry;
      if (selectedHobbies.some((hobby) => hobby.value === 'Other')) {
        data.hobbies = [
          ...selectedHobbies.filter((hobby) => hobby.value !== 'Other').map((h) => h.label),
          data.otherHobby,
        ];
      } else {
        data.hobbies = selectedHobbies.map((hobby) => hobby.label);
      }

      // Check for required fields
      if (!data.name || !data.email || !data.mobile || !data.password) {
        alert('All fields are required');
        return;
      }

      // Make API call to register
      await axios.post('/auth/register', data);
      alert('User registered successfully!');
      router.push('/login');
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  const handleCountryChange = (selectedOption: any) => {
    setValue('country', selectedOption);
    setShowOtherCountry(selectedOption.value === 'Other');
    if (selectedOption.value !== 'Other') setValue('otherCountry', '');
  };

  const handleHobbyChange = (selectedOptions: any) => {
    setSelectedHobbies(selectedOptions);
    setShowOtherHobby(selectedOptions.some((option: any) => option.value === 'Other'));
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Name"
        />
        <p className={styles.error}>{errors.name?.message?.toString()}</p>

        <input
          {...register('mobile', { required: 'Mobile is required' })}
          placeholder="Mobile"
        />
        <p className={styles.error}>{errors.mobile?.message?.toString()}</p>

        <select
  {...register('gender', { required: 'Gender is required' })}
  defaultValue=""
>
  <option value="" disabled hidden>
    Select Gender
  </option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>
        <p className={styles.error}>{errors.gender?.message?.toString()}</p>

        <Select
          options={countries}
          onChange={handleCountryChange}
          placeholder="Select Country"
        />
        <p className={styles.error}>{errors.country?.message?.toString()}</p>

        {showOtherCountry && (
          <input
            {...register('otherCountry', { required: 'Enter your country' })}
            placeholder="Enter your country"
          />
        )}
        <p className={styles.error}>{errors.otherCountry?.message?.toString()}</p>

        <Select
          isMulti
          options={hobbiesOptions}
          onChange={handleHobbyChange}
          placeholder="Select Hobby"
          classNamePrefix="react-select"
          className={styles.multiSelect}
        />
        <p className={styles.error}>{errors.hobbies?.message?.toString()}</p>

        {showOtherHobby && (
          <input
            {...register('otherHobby', { required: 'Enter your hobby' })}
            placeholder="Enter your hobby"
          />
        )}
        <p className={styles.error}>{errors.otherHobby?.message?.toString()}</p>

        <input
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="Email"
        />
        <p className={styles.error}>{errors.email?.message?.toString()}</p>

        <input
          {...register('password', { required: 'Password is required' })}
          type="password"
          placeholder="Password"
        />
        <p className={styles.error}>{errors.password?.message?.toString()}</p>

    
        <button type="submit" className={styles.registerButton}>
          Register
        </button>
      </form>
    </div>
  );
}
