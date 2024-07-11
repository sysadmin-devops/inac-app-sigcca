import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { LogOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/utils/use-auth';
import { useContext } from 'react';
import { GlobalContext } from '@/context/global-context';

export default function LogoutDialog({ className = '', noIcon = false }) {
  const auth = useAuth();
  const { isActive, setIsActive } = useContext(GlobalContext);

  return (
    <AlertDialog.Root open={isActive} onOpenChange={setIsActive}>
      <AlertDialog.Trigger asChild>
        <button
          onClick={() => setIsActive(true)}
          className={twMerge(
            'flex gap-2 items-center text-base text-white bg-red-500 w-full py-2 px-1 rounded transition-colors hover:bg-red-600',
            className
          )}
        >
          <LogOut
            className={twMerge('text-white w-5 h-5', noIcon && 'hidden')}
          />
          Sair
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className='bg-black/50 backdrop-blur-sm fixed inset-0' />
        <AlertDialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none'>
          <AlertDialog.Title className='text-mauve12 m-0 text-[17px] font-medium'>
            Tem a certeza que deseja sair?
          </AlertDialog.Title>
          <AlertDialog.Description className='text-mauve11 mt-4 mb-5 text-[15px] leading-normal'>
            Tem certeza de que deseja sair? Você será desconectado e seus dados
            de sessão serão apagados do navegador.
          </AlertDialog.Description>
          <div className='flex justify-end gap-6'>
            <AlertDialog.Cancel asChild>
              <button
                onClick={() => setIsActive(false)}
                className='text-white bg-black focus:shadow-green-900 inline-flex h-9 items-center justify-center rounded px-4 font-medium leading-none outline-none focus:shadow-[0_0_0_2px]'
              >
                Cancelar
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={auth.signOut}
                className='text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:shadow-red-700 inline-flex h-9 items-center justify-center rounded px-4 font-medium leading-none outline-none focus:shadow-[0_0_0_2px]'
              >
                Sim, desejo sair
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
