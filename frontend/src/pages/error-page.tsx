import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <section className='flex flex-col items-center justify-center h-screen text-center'>
      <img
        src='/404error.svg'
        alt='Imagem sem autorização'
        className='max-w-sm'
      />
      <h1 className='text-xl lg:text-2xl font-bold text-black'>A página solicitada não foi encontrada</h1>
      <p>Verifique se o endereço está correto ou volte para a página inicial</p>
      <Link
        to={'/'}
        replace
        className='mt-4 py-2 px-6 rounded bg-green-600 text-white'
      >
        Voltar
      </Link>
    </section>
  );
}
