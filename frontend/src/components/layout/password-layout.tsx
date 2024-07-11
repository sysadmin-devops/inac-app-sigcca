import Loading from '@/components/common/loading';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function PasswordLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <main className='bg-white w-full h-screen flex items-center justify-center'>
        <ToastContainer />
        <Outlet />
      </main>
    </Suspense>
  );
}
