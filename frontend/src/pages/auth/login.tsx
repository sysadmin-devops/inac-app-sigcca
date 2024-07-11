import LoginForm from '@/components/login-form';
import useDocumentTitle from '@/utils/use-title';

export default function Login() {
  useDocumentTitle('Entre na sua conta');
  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-col items-center'>
        <img
          src='/logo.png'
          alt='Logo'
          width={180}
          height={60}
          className='w-28 object-cover lg:hidden'
        />
        <h1 className='antialiased text-2xl font-semibold'>Bem-vindo!</h1>
        <p className='text-base font-normal text-gray-600 text-center'>
          Digite seu e-mail e senha para acessar sua conta
        </p>
      </div>
      <LoginForm />
    </section>
  );
}
