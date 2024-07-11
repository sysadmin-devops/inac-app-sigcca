import useDocumentTitle from '@/utils/use-title';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { provincias } from '@/utils/utils';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useContext } from 'react';
import { GlobalContext } from '@/context/global-context';
import RenderOnRole from '@/utils/render-on-role';
import SobreCentro from './sobre-centro';

export default function Home() {
  useDocumentTitle('Inicio');
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  const { criancasByProvince, funcionarios, criancas, centros } =
    useContext(GlobalContext);

  const bars = {
    options: {
      chart: {
        id: 'Províncias',
      },
      xaxis: {
        categories: provincias,
      },
      plotOptions: {
        bar: {
          // horizontal: isSmallDevice ? true : false,
          columnWidth: isSmallDevice ? '80%' : '70%',
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: true,
      },
      fill: {
        colors: ['#8FD926'],
      },
    },
    series: [
      {
        name: 'Crianças',
        data: criancasByProvince,
      },
    ],
  };

  return (
    <section className='space-y-4'>
      <article className='flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center leading-relaxed border-b pb-4 border-gray-300'>
        <h1 className='text-xl md:text-2xl font-medium text-black'>
          Visão geral
        </h1>
        <div className='flex gap-2'>
          <RenderOnRole allowedRoles={['funcionario', 'adminCentro']}>
            <SobreCentro />
          </RenderOnRole>
          <RenderOnRole allowedRoles={['adminGeral']}>
            <Link
              to='/centros'
              className='font-semibold text-base rounded bg-gray-800 hover:bg-black text-white px-4 py-3 transition-colors disabled:bg-green-900 disabled:text-gray-300 disabled:cursor-wait hover:outline'
            >
              Centros
            </Link>
          </RenderOnRole>
          <RenderOnRole allowedRoles={['adminCentro', 'adminGeral']}>
            <Link
              to='/funcionarios'
              className='font-semibold text-base rounded bg-gray-800 hover:bg-black text-white px-4 py-3 transition-colors disabled:bg-green-900 disabled:text-gray-300 disabled:cursor-wait hover:outline'
            >
              Funcionários
            </Link>
          </RenderOnRole>
          <Link to='/criancas' className='button'>
            Lista de crianças
          </Link>
          <RenderOnRole allowedRoles={['funcionario']}>
            <Link
              to='/cadastrar-crianca'
              className='font-semibold text-base rounded bg-gray-800 hover:bg-black text-white px-4 py-3 transition-colors disabled:bg-green-900 disabled:text-gray-300 disabled:cursor-wait hover:outline'
            >
              Nova criança
            </Link>
          </RenderOnRole>
        </div>
      </article>
      <RenderOnRole allowedRoles={['adminCentro', 'adminGeral']}>
        <article className='flex flex-col md:flex-row justify-between gap-3'>
          <RenderOnRole allowedRoles={['adminGeral']}>
            <div className='flex flex-col items-start justify-center border bg-white py-6 px-4 rounded-lg w-full'>
              <span className='text-lg font-semibold'>Centros</span>
              <h3>{(centros && centros.length) || 0}</h3>
            </div>
          </RenderOnRole>
          <div className='flex flex-col items-start justify-center border bg-white py-6 px-4 rounded-lg w-full'>
            <span className='text-lg font-semibold'>Funcionários</span>
            <h3>{(funcionarios && funcionarios.length) || 0}</h3>
          </div>
          <div className='flex flex-col items-start justify-center border bg-white py-6 px-4 rounded-lg w-full'>
            <span className='text-lg font-semibold'>Crianças</span>
            <h3>{(criancas && criancas.length) || 0}</h3>
          </div>
        </article>
      </RenderOnRole>
      <article className='flex gap-4 w-full items-center justify-center pt-5 pl-4 rounded bg-white overflow-x-scroll'>
        <Chart
          options={bars.options}
          series={bars.series}
          type='bar'
          width={`${isSmallDevice ? '350%' : '350%'}`}
          height={`${isSmallDevice ? '1000px' : 'auto'}`}
        />
      </article>
    </section>
  );
}
