import Loading from '@/components/common/loading';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/sidebar';
import Header from '../common/header';
import { ToastContainer } from 'react-toastify';

export default function RootLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <div className='flex h-screen'>
        <Sidebar />
        <div className='flex flex-col w-full flex-grow'>
          <Header />
          <main className='bg-slate-100 text-gray-700 flex-grow overflow-y-auto p-4'>
            <ToastContainer />
            <Outlet />
          </main>
          <footer className='rounded-lg w-full flex justify-center bg-white py-2 text-gray-500'>
            <a
              href='https://sysadmin.it.ao/'
              target='_blank'
              className='hover:text-green-600 transition-colors'
            >
              &copy; Todos os direitos reservados, 2024. By SYSADMIN-T.I, LDA
            </a>
          </footer>
        </div>
      </div>
    </Suspense>
  );
}
