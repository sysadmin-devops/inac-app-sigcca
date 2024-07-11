import { AuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';
import useSWR from 'swr';
import * as Dialog from '@radix-ui/react-dialog';
import Cookies from 'js-cookie';

export default function SobreCentro() {
  const { userData } = useContext(AuthContext);
  const token = Cookies.get('token');
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_API}/api/centroAcolhimento/${
      userData.centroAcolhimento
    }`,
    () =>
      fetch(
        `${import.meta.env.VITE_API}/api/centroAcolhimento/${
          userData.centroAcolhimento
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json())
  );

  if (error)
    return (
      <button
        disabled={true}
        className='flex gap-2 items-center cursor-not-allowed text-white font-semibold bg-red-500 hover:bg-red-600 px-16 rounded'
      >
        Erro ao buscar dados
      </button>
    );
  if (isLoading)
    return (
      <button
        disabled={true}
        className='flex gap-2 items-center cursor-wait text-white font-semibold bg-gray-800 hover:bg-black px-16 rounded'
      >
        <Loader2 className='animate-spin w-5 h-5 text-green-500' />
      </button>
    );
  return (
    <>
      {data && (
        <Dialog.Root>
          <Dialog.Trigger asChild className='group'>
            <button className='flex gap-2 items-center text-white font-semibold bg-gray-800 hover:bg-black px-3 rounded'>
              Sobre o centro
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='bg-black/40 backdrop-blur-[2px] fixed inset-0' />
            <Dialog.Content className='overflow-y-scroll md:overflow-y-auto data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white px-4 py-3 focus:outline-none'>
              <Dialog.Title className='text-xl md:text-2xl text-green-600 font-semibold border-b pb-2 border-green-600'>
                Informações do Centro
              </Dialog.Title>
              <Dialog.Description className='py-3 space-y-1'>
                <div className=''>
                  <h2 className='font-medium text-xl'>{data.nome}</h2>
                  <p>Endereço: {data.endereco}</p>
                  <p>Telefone: {data.telefone}</p>
                </div>
              </Dialog.Description>
              <Dialog.Close className='w-full flex justify-end outline-none'>
                <button className='py-2 px-5 bg-gray-700 hover:bg-gray-900 text-white transition-colors rounded'>
                  Fechar
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}
