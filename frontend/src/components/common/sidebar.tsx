import * as Accordion from '@radix-ui/react-accordion';
import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  PieChart,
  User,
  Users,
  Store,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LogoutDialog from './logout-dialog';
import { twMerge } from 'tailwind-merge';
import RenderOnRole from '@/utils/render-on-role';

interface ILink {
  path: string;
  title: string;
}

interface GroupItem {
  title: string;
  icon: React.ReactElement;
  id: string;
  links: ILink[];
}

const CriancaGroup: GroupItem[] = [
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

const FuncionarioGroup: GroupItem[] = [
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

const CentrosGroup: GroupItem[] = [
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

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className='hidden lg:flex bg-white w-80 flex-col justify-between py-3 px-5 border-r border-gray-300'>
      <div className='space-y-6'>
        <div className='flex w-full justify-center'>
          <img src='/logo.png' className='w-28' alt='INAC Logo' />
        </div>
        <ul className='space-y-5'>
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
      </div>
      <div className=''>
        <LogoutDialog />
      </div>
    </aside>
  );
}

export function LinkGroup({ group }: { group: GroupItem[] }) {
  return (
    <div>
      <Accordion.Root className='w-full' type='single' collapsible>
        {group &&
          group.map(({ title, icon, id, links }) => (
            <Accordion.Item
              key={id + title}
              className='AccordionItem group'
              value={id}
            >
              <Accordion.Trigger
                className={twMerge(
                  'group text-gray-700 hover:text-green-500 flex items-center justify-between w-full rounded-md'
                )}
              >
                <span className='flex gap-2 items-center text-base'>
                  {icon}
                  {title}
                </span>
                <ChevronDown className='group-data-[state=open]:rotate-180 w-5 h-5' />
              </Accordion.Trigger>
              <Accordion.Content className='group-data-[state=open]:mt-3 overflow-hidden pl-6 flex flex-col gap-3'>
                {links.map(({ path, title }) => (
                  <Link
                    to={path}
                    key={path + title}
                    className={'text-base text-gray-700 hover:text-green-500'}
                  >
                    {title}
                  </Link>
                ))}
              </Accordion.Content>
            </Accordion.Item>
          ))}
      </Accordion.Root>
    </div>
  );
}

interface IMenu {
  title: string;
  path: string;
  Icon?: React.ElementType;
}

const menu: IMenu[] = [
  {
    title: 'Perfil',
    path: '/perfil',
    Icon: User,
  },
  {
    title: 'Configurações',
    path: '/configuracoes',
    Icon: Settings,
  },
];

export function Menu() {
  const location = useLocation();

  return (
    <>
      {menu.map(({ path, title, Icon }) => (
        <li key={path + title} className='group flex gap-2 items-center'>
          {Icon && (
            <Icon
              className={twMerge(
                'w-5 h-5 text-gray-700 group-hover:text-green-500',
                location.pathname === path && 'text-green-500'
              )}
            />
          )}
          <Link
            to={path}
            className={twMerge(
              'text-gray-700 group-hover:text-green-500 text-base w-full',
              location.pathname === path && 'text-green-500'
            )}
          >
            {title}
          </Link>
        </li>
      ))}
    </>
  );
}
