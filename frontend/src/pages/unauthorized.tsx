import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <section className='flex flex-col items-center justify-center h-screen text-center'>
      <img
        src='/403error.svg'
        alt='Imagem sem autorização'
        className='max-w-md'
      />
      <h1 className='text-xl lg:text-2xl font-bold'>Sem autorização</h1>
      <p>Desculpa, você não está autorizado a ver está página.</p>
      <Link to={'/'} replace className='mt-4 py-2 px-6 rounded bg-green-600 text-white'>
        Voltar
      </Link>
    </section>
  );
}
