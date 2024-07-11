import { InputWrapper } from '@/components/ui/input';
import { LoaderCircle, Mail, MailCheck } from 'lucide-react';
import { resetPasswordFormSchema } from '@/utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import useDocumentTitle from '@/utils/use-title';

type resetPasswordSchema = z.infer<typeof resetPasswordFormSchema>;

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  useDocumentTitle(emailSent ? 'Email de redefinição enviado' : 'Redefinição de senha')
  const [userEmail, setUserEmail] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<resetPasswordSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  async function onSubmit(data: z.output<typeof resetPasswordFormSchema>) {
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
      // navigate('/password/sent');
      setUserEmail(data.email);
      setEmailSent(true);
    } catch (error) {
      errorMessage();
      console.error('Houve um erro ao fazer a redefinição', error);
    }
  }

  function handleChangeEmail() {
    setEmailSent(false);
  }

  function handleResendEmail() {
    sucessMessage();
  }

  const sucessMessage = () =>
    toast.success('Email enviado!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });

  const errorMessage = () =>
    toast.error(
      'Houve um erro no envio verifique o seu email e tente novamente',
      {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      }
    );

  return (
    <>
      {emailSent ? (
        <section className='space-y-4 px-4'>
          <div className='border-2 p-3 border-green-500 rounded-md space-y-2 w-full sm:w-[500px]'>
            <MailCheck className='w-8 h-8 text-green-500' />
            <div className='flex flex-col gap-3'>
              <h1 className='text-xl font-medium text-gray-900'>
                Email enviado!
              </h1>
              <p className='text-gray-600'>
                Um email foi enviado para{' '}
                <span className='text-green-600'>{userEmail}</span> verifique
                sua caixa de entrada e siga as instruções para concluir o
                processo.
              </p>
              <span
                onClick={handleResendEmail}
                className='group cursor-pointer'
              >
                Não recebeu um email?{' '}
                <span className='text-green-600 group-hover:text-green-700'>
                  Reenviar email
                </span>
              </span>
              <span
                onClick={handleChangeEmail}
                className='group cursor-pointer'
              >
                Endereço de email errado?{' '}
                <span className='text-green-600 group-hover:text-green-700'>
                  Mudar email
                </span>
              </span>
            </div>
          </div>
          <Link to='/login' className='button'>
            Voltar
          </Link>
        </section>
      ) : (
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
              <h1 className='text-2xl font-semibold'>Recuperação de conta</h1>
              <p className='text-base font-normal text-gray-600'>
                Digite seu e-mail para iniciar a recuperação de sua conta
              </p>
            </div>
            <div className='flex flex-col gap-3'>
              <InputWrapper
                label='Email'
                icon={Mail}
                hasError={errors.email && true}
              >
                <input
                  type='email'
                  placeholder='Seu endereço de email'
                  autoComplete='email'
                  {...register('email', { value: userEmail })}
                  className='inputUnstyle'
                />
              </InputWrapper>
              {errors && (
                <span className='text-red-500'>{errors.email?.message}</span>
              )}
            </div>

            <button disabled={isSubmitting} className='button' type='submit'>
              {isSubmitting ? (
                <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
              ) : (
                'Enviar e-mail'
              )}
            </button>
            <Link
              to='/login'
              className='text-center font-medium font-base text-green-600 hover:text-green-700'
            >
              Voltar para a tela de login
            </Link>
          </form>
        </section>
      )}
    </>
  );
}
