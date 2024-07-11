import { GlobalContext } from '@/context/global-context';
import useDocumentTitle from '@/utils/use-title';
import { useContext } from 'react';
import * as Avatar from '@radix-ui/react-avatar';

export default function Profile() {
  useDocumentTitle('Perfil');
  const { usuario, obterIniciais } = useContext(GlobalContext);

  return (
    <section className='mb-[8.5rem]'>
      <div className='space-y-1 leading-relaxed bg-profile bg-cover bg-center py-20 rounded-xl relative flex justify-center mb-10 md:mb-24'>
        <Avatar.Root className='inline-flex select-none items-center justify-center overflow-hidden align-middle rounded-xl w-28 h-28 md:w-36 md:h-36 absolute'>
          <Avatar.Image
            className='h-full w-full rounded-[inherit] object-cover'
            src={`${import.meta.env.VITE_API}/uploads/${usuario?.imagem}`}
            alt={usuario?.nome}
          />
          <Avatar.Fallback
            className='text-green-500 leading-1 flex h-full w-full items-center justify-center bg-slate-200 text-5xl font-medium'
            delayMs={600}
          >
            {obterIniciais(usuario?.nome as string)}
          </Avatar.Fallback>
        </Avatar.Root>
      </div>
      <div className='flex flex-col items-center text-gray-700'>
        <h2 className='text-xl text-black font-medium'>{usuario?.nome}</h2>
        <p className='text-green-600 font-medium'>{usuario?.cargo}</p>
        <p> {usuario?.email}</p>
      </div>
    </section>
  );
}
