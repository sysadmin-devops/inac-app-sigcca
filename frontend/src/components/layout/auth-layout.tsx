import Loading from '@/components/common/loading';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function AuthLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <section className='bg-white py-4 lg:py-0 h-full lg:h-screen flex justify-center lg:justify-between'>
        <ToastContainer />
        <article className='hidden p-10 bg-authcover bg-cover w-6/12 lg:flex flex-col justify-between'>
          <img
            src='/logo2.png'
            alt='Logo'
            width={180}
            height={60}
            className='w-28 object-cover'
          />
          <div className='text-white font-medium flex flex-col gap-2 w-9/12'>
            <p className='font-sm'>
              {`"As crianças são sementes que plantamos com amor, e o amanhã colherá
            os frutos dessa semeadura."`}
            </p>
            <span>Autor desconhecido</span>
          </div>
        </article>
        <article className='w-full lg:w-6/12 h-full flex items-center justify-center'>
          <Outlet />
        </article>
      </section>
    </Suspense>
  );
}
