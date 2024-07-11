import { InputWrapper } from '@/components/ui/input';
import { registerFormSchema } from '@/utils/schemas';
import useDocumentTitle from '@/utils/use-title';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

type registerFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  useDocumentTitle('Criação de conta')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  async function onSubmit(data: z.output<typeof registerFormSchema>) {
    console.log(data);
  }

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-col items-center'>
        <img
          src='/logo.png'
          alt='Logo white version'
          width={180}
          height={60}
          className='w-28 object-cover lg:hidden'
        />
        <h1 className='text-2xl font-semibold'>Crie sua conta</h1>
        <p className='text-base font-normal text-gray-600 text-center'>
          Preencha o formulário abaixo para criar sua conta.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 w-full px-3 lg:px-0 lg:w-[400px]'
      >
        <div className='flex flex-col gap-3'>
          <InputWrapper label='Nome' icon={User} hasError={errors.name && true}>
            <input
              type='text'
              placeholder='Seu nome'
              autoComplete='name'
              {...register('name')}
              className='inputUnstyle'
            />
          </InputWrapper>
          {errors && (
            <span className='text-red-500 text-sm lg:text-base'>{errors.name?.message}</span>
          )}
          <InputWrapper label='Email' icon={Mail} hasError={errors.email && true}>
            <input
              type='email'
              placeholder='Seu endereço de email'
              autoComplete='email'
              {...register('email')}
              className='inputUnstyle'
            />
          </InputWrapper>
          {errors && (
            <span className='text-red-500 text-sm lg:text-base'>{errors.email?.message}</span>
          )}
          <InputWrapper label='Senha' icon={Lock} hasError={errors.password && true}>
            <input
              type='password'
              placeholder='Sua senha'
              autoComplete='new-password'
              {...register('password')}
              className='inputUnstyle'
            />
          </InputWrapper>
          {errors && (
            <span className='text-red-500 text-sm lg:text-base'>{errors.password?.message}</span>
          )}
        </div>
        <button disabled={isSubmitting} className='button' type='submit'>
          {isSubmitting ? (
            <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
          ) : (
            'Criar conta'
          )}
        </button>
        <Link to='/login' className='group text-center font-medium font-base'>
          Já tem uma conta?{' '}
          <span className='text-green-500 group-hover:text-green-600'>
            Entrar na sua conta
          </span>
        </Link>
      </form>
    </section>
  );
}
