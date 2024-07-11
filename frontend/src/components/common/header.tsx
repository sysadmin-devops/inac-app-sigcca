import {
  AlignLeft,
  LayoutDashboard,
  PieChart,
  Store,
  Users,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '../ui/sheet';
import Avatar from './avatar';
import { LinkGroup, Menu } from './sidebar';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import LogoutDialog from './logout-dialog';
import { useState } from 'react';
import RenderOnRole from '@/utils/render-on-role';

export default function Header() {
  const [sheet, setSheet] = useState(false);
  const location = useLocation();

  const CriancaGroup = [
    {
      title: 'Gestão de crianças',
      id: '1',
      icon: <PieChart className='w-5 h-5' />,
      links: [
        {
          title: 'Lista de crianças',
          path: 'criancas',
        },
        {
          title: 'Cadastrar criança',
          path: 'cadastrar-crianca',
        },
      ],
    },
  ];

  const FuncionarioGroup = [
    {
      title: 'Funcionários',
      id: '2',
      icon: <Users className='w-5 h-5' />,
      links: [
        {
          title: 'Lista de funcionário',
          path: 'funcionarios',
        },
        {
          title: 'Cadastrar funcionário',
          path: 'cadastrar-funcionario',
        },
      ],
    },
  ];

  const CentrosGroup = [
    {
      title: 'Centros',
      id: '3',
      icon: <Store className='w-5 h-5' />,
      links: [
        {
          title: 'Lista de centros',
          path: 'centros',
        },
        {
          title: 'Cadastrar centro',
          path: 'cadastrar-centro',
        },
      ],
    },
  ];

  return (
    <header className='bg-white px-4 py-3 w-full flex items-center justify-between lg:justify-end border-b border-gray-300'>
      <Sheet open={sheet} onOpenChange={setSheet}>
        <SheetTrigger className='lg:hidden'>
          <AlignLeft className='w-5 h-5' />
        </SheetTrigger>
        <SheetContent side={'left'} className='flex flex-col justify-between'>
          <section>
            <SheetHeader className='flex items-center mb-8'>
              <img src='/logo.png' className='w-32' alt='INAC Logo' />
            </SheetHeader>
            <ul className='space-y-4'>
              <li className='group flex gap-2 items-center'>
                <LayoutDashboard
                  className={twMerge(
                    'w-5 h-5 text-gray-700 group-hover:text-green-500',
                    location.pathname === '/' && 'text-green-500'
                  )}
                />
                <Link
                  to='/'
                  className={twMerge(
                    'text-gray-700 group-hover:text-green-500 text-base w-full',
                    location.pathname === '/' && 'text-green-500'
                  )}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <LinkGroup group={CriancaGroup} />
              </li>
              <RenderOnRole allowedRoles={['adminCentro', 'adminGeral']}>
                <li>
                  <LinkGroup group={FuncionarioGroup} />
                </li>
              </RenderOnRole>
              <RenderOnRole allowedRoles={['adminGeral']}>
                <li>
                  <LinkGroup group={CentrosGroup} />
                </li>
              </RenderOnRole>
              <Menu />
            </ul>
          </section>
          <SheetFooter
            onClick={(i) => setSheet(!i)}
            className='flex justify-end'
          >
            <LogoutDialog />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Avatar />
    </header>
  );
}
