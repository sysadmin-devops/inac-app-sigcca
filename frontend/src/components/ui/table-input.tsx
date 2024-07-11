import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InputTable({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <div className='group flex items-center border border-gray-300 px-2 rounded-md bg-white focus-within:border-green-600'>
      <label htmlFor='inputtable'><Search className='w-5 h-5 text-gray-400 group-focus-within:text-green-600' /></label>
      <input
        {...props}
        id='inputtable'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='border-none bg-transparent focus:ring-0 px-2 placeholder:text-gray-400'
        placeholder='Pesquisar nome...'
      />
    </div>
  );
}
