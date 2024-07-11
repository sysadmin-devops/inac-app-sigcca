import { GlobalContext } from '@/context/global-context';
import { useAuth } from '@/utils/use-auth';
import * as AvatarC from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

export default function Avatar() {
  const { userData } = useAuth();
  const { setIsActive, obterIniciais, formatarNomeCompleto, usuario } =
    useContext(GlobalContext);

  if (!userData) {
    return 'null';
  }

  const nome = usuario ? formatarNomeCompleto(usuario.nome) : 'Sem dados';
  const iniciais = usuario ? obterIniciais(nome) : '';
  return (
    <>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger asChild>
          <div className='cursor-pointer flex gap-2 items-center'>
            <div className='flex-col gap-0 space-y-0 hidden md:flex'>
              <p className='text-black text-sm'>{nome && nome}</p>
              <span className='text-gray-600 text-xs'>
                {userData.role === 'funcionario' && 'Funcionário'}
                {(userData.role === 'adminCentro' && 'Administrador') ||
                  (userData.role === 'adminGeral' && 'Administrador')}
              </span>
            </div>
            <AvatarC.Root className='inline-flex h-11 w-11 select-none items-center justify-center overflow-hidden rounded-full align-middle'>
              <AvatarC.Image
                className='h-full w-full rounded-[inherit] object-cover'
                src={`${import.meta.env.VITE_API}/uploads/${usuario?.imagem}`}
                alt={nome && nome}
              />
              <AvatarC.Fallback
                className='text-green-500 leading-1 flex h-full w-full items-center justify-center bg-slate-100 text-base font-medium'
                delayMs={600}
              >
                {iniciais && iniciais}
              </AvatarC.Fallback>
            </AvatarC.Root>
            <ChevronDown className='w-5 h-5 text-gray-800 hidden md:block' />
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className='min-w-[200px] font-medium text-sm bg-white rounded-md p-2 shadow-md will-change-[opacity,transform] mr-2 z-50'
            sideOffset={12}
            side='bottom'
          >
            <DropdownMenu.Item className='group leading-none text-gray-600 rounded flex items-center relative select-none outline-none data-[disabled]:text-gray-200 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-green-600'>
              <Link to='/perfil' className='w-full h-full p-4'>
                Perfil
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className='leading-none text-gray-600 rounded flex items-center relative select-none outline-none data-[disabled]:text-gray-200 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-green-600'>
              <Link to='/configuracoes' className='w-full h-full p-4'>
                Configurações
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className='h-[1px] bg-gray-300 m-2' />
            <DropdownMenu.Item
              onClick={() => setIsActive(true)}
              className='w-full p-4 bg-transparent hover:text-white leading-none text-gray-600 rounded flex items-center relative select-none outline-none data-[disabled]:text-gray-200 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-100 data-[highlighted]:text-green-600'
            >
              Sair
            </DropdownMenu.Item>
            <DropdownMenu.Arrow className='fill-white' />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
