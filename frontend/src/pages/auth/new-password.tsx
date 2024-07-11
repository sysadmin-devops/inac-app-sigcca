import { InputWrapper } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { newPasswordFormSchema } from '@/utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useDocumentTitle from '@/utils/use-title';

type newPassowrdSchema = z.infer<typeof newPasswordFormSchema>;

export default function NewPassword() {
  useDocumentTitle('Nova senha')
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<newPassowrdSchema>({
    resolver: zodResolver(newPasswordFormSchema),
  });

  async function onSubmit(data: z.output<typeof newPasswordFormSchema>) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/auth/forgot_password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error('Email inválidos');
      navigate('/');
    } catch (error) {
      message();
      console.error('Houve um erro ao fazer a redefinição', error);
    }
  }

  const message = () =>
    toast.error(
      'Houve um erro ao fazer a redefinição tente novamente',
      {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );

  return (
    <section className='flex flex-col gap-6'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 w-full px-2 lg:px-0 lg:w-[400px]'
      >
        <div className='flex flex-col items-center gap-3 text-center'>
          <img
            src='/logo.png'
            alt='Logo INAC'
            className='w-32'
            width={180}
            height={50}
          />
          <h1 className='text-2xl font-semibold'>Redefina sua senha agora</h1>
          <p className='text-base font-normal text-gray-600'>
            Para sua segurança, recomendamos que você utilize uma senha forte e
            exclusiva
          </p>
        </div>
        <div className='flex flex-col gap-3'>
          <InputWrapper label='Nova senha' hasError={errors.password && true}>
            <input
              type='password'
              placeholder='Digite a senha'
              autoComplete='new-password'
              {...register('password')}
              className='inputUnstyle'
            />
          </InputWrapper>
          {errors && (
            <span className='text-red-500'>{errors.password?.message}</span>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          <InputWrapper label='Confirmar senha' hasError={errors.password && true}>
            <input
              type='password'
              placeholder='Digite novamente a senha'
              autoComplete='new-password'
              {...register('password')}
              className='inputUnstyle'
            />
          </InputWrapper>
          {errors && (
            <span className='text-red-500'>{errors.password?.message}</span>
          )}
        </div>

        <button disabled={isSubmitting} className='button' type='submit'>
          {isSubmitting ? (
            <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
          ) : (
            'Redefinir senha'
          )}
        </button>
      </form>
    </section>
  );
}
