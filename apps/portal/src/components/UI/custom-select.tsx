import { UseFormRegisterReturn } from 'react-hook-form';

interface CustomSelectProps {
  label?: string;
  error?: string;
  required?: boolean;
  register: UseFormRegisterReturn<any>;
  placeholder?: string;
  children?: React.ReactNode;
  hideLabel?: boolean;
  options: { value: string; label: string }[];
}

export const CustomSelect = (props: CustomSelectProps) => {
  const { label, error, required, register, hideLabel, options, placeholder } =
    props;
  return (
    <div className="space-y-2">
      {!hideLabel && (
        <label htmlFor={register.name} className="block text-gray-700">
          {label ||
            register.name.charAt(0).toUpperCase() + register.name.slice(1)}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        {...register}
        required
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
