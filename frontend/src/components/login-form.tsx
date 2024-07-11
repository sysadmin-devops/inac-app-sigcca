import { loginFormSchema } from '@/utils/schemas';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, Mail, Lock, LoaderCircle } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { InputWrapper } from './ui/input';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/use-auth';

type loginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(data: z.output<typeof loginFormSchema>) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/auth/authenticateUser`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error('Email ou senha inválidos');
      const res = await response.json();
      auth.signIn(res.token, res.user);
      navigate('/', { replace: true });
    } catch (error) {
      message();
      console.error('Houve um erro ao fazer login', error);
    }
  }

  const message = () =>
    toast.error('Erro email ou senha inválidos', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 w-full px-2 lg:px-0 lg:w-[400px]'
    >
      <div className='flex flex-col gap-3'>
        <InputWrapper
          type='email'
          label='Email'
          icon={Mail}
          hasError={errors.email && true}
        >
          <input
            type='email'
            {...register('email')}
            placeholder='Seu endereço de email'
            autoComplete='email'
            className='inputUnstyle'
          />
        </InputWrapper>
        {errors && (
          <span className='text-red-500 text-sm lg:text-base'>
            {errors.email?.message}
          </span>
        )}
        <InputWrapper label='Senha' icon={Lock} hasError={errors.senha && true}>
          <input
            type='password'
            {...register(`senha`)}
            placeholder='Sua senha'
            autoComplete='current-password'
            className='inputUnstyle'
          />
        </InputWrapper>
        {errors && (
          <span className='text-red-500 text-sm lg:text-base'>
            {errors.senha?.message}
          </span>
        )}
      </div>
      <div className='flex justify-between text-base max-[320px]:flex-col gap-3'>
        <label className='text-base leading-none text-gray-800 flex items-center gap-[6px]'>
          <Checkbox.Root
            className='checkbox'
            defaultChecked
            name='remember'
            aria-label='Lembre-se de mim'
          >
            <Checkbox.Indicator>
              <Check className='w-4 h-4 text-white' />
            </Checkbox.Indicator>
          </Checkbox.Root>
          Lembre-se de mim
        </label>
      </div>
      <button disabled={isSubmitting} className='button' type='submit'>
        {isSubmitting ? (
          <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
        ) : (
          'Entrar'
        )}
      </button>
      <Link
        to='/password/reset'
        className='text-green-600 hover:text-green-700 font-medium text-center'
      >
        Esqueceu a senha?
      </Link>
    </form>
  );
}
