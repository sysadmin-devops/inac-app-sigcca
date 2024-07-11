import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  children: ReactNode;
  hasError?: boolean;
}

export const InputWrapper: React.FC<InputProps> = ({
  name,
  label,
  icon: Icon,
  children,
  hasError,
  ...rest
}) => {
  return (
    <label
      htmlFor={name}
      title={label}
      className='text-gray-700 font-medium text-base'
    >
      {label}
      <div
        className={twMerge(
          'flex items-center group px-2 py-3 gap-1 focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-gray-50 border border-gray-300 rounded cursor-pointer',
          hasError && 'focus-within:outline-red-500 border-red-500',
          rest.className
        )}
      >
        {Icon && (
          <Icon
            className={twMerge(
              'w-5 h-5 text-gray-400 group-focus-within:text-green-500',
              hasError && 'group-focus-within:text-red-500 text-red-500'
            )}
          />
        )}
        {children}
      </div>
    </label>
  );
};
