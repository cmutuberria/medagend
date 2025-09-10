import { UseFormRegisterReturn } from 'react-hook-form';

interface CustomInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  register: UseFormRegisterReturn<any>;
  type?: string;
  placeholder?: string;
  children?: React.ReactNode;
  hideLabel?: boolean;
  rows?: number;
}

export const CustomInput = (props: CustomInputProps) => {
  const {
    label,
    error,
    required,
    register,
    type,
    placeholder,
    children,
    hideLabel,
    rows,
  } = props;
  return (
    <div className="space-y-2">
      {!hideLabel && (
        <label htmlFor={register.name} className="block text-gray-700">
          {label ||
            register.name.charAt(0).toUpperCase() + register.name.slice(1)}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder || ''}
          {...register}
          required={required}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      ) : (
        <div className="relative">
          <input
            type={type || 'text'}
            placeholder={placeholder || ''}
            {...register}
            required={required}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {children && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {children}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
