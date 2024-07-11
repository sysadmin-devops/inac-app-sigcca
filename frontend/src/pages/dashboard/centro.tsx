/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import useDocumentTitle from '@/utils/use-title';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Centro() {
  useDocumentTitle('Informações do centro');

  const [preview, setPreview] = useState({
    name: '',
    src: '/placeholder.jpeg',
  });
  const [centro, setCentro] = useState({});
  const token = Cookies.get('token');
  const { id } = useParams();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/centroAcolhimento/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((centroId) => centroId.json())
      .then((centroId) => setCentro(centroId));
    if (centro?.imagem) {
      setPreview({
        name: centro?.nome,
        src: `${import.meta.env.VITE_API}/uploads/${centro?.imagem}`,
      });
    }
  }, [centro?.imagem, centro?.nome, id, token]);

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-col items-start text-black'>
        <h1 className='text-2xl font-semibold'>Informações do centro</h1>
        <p className='text-base font-normal text-gray-600 text-center'>
          Todas informações do centro.
        </p>
      </div>
      <form className='flex flex-col gap-4 w-full px-3 md:px-10'>
        <div className='flex flex-col items-center md:items-start gap-3'>
          <img
            src={preview.src || '/placeholder.jpeg'}
            alt='Preview'
            className='w-44 h-44 object-cover rounded-full'
          />
        </div>
        <article className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label htmlFor='nome' className='w-full'>
              Nome
              <input
                type='text'
                id='nome'
                disabled={true}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                value={centro?.nome || ''}
              />
            </label>
          </div>
          <div>
            <label htmlFor='endereco' className='w-full'>
              Endereço
              <input
                type='text'
                id='endereco'
                disabled={true}
                value={centro?.endereco || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='telefone' className='w-full'>
              Telefone
              <input
                type='number'
                id='telefone'
                disabled={true}
                value={centro?.telefone || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='email' className='w-full'>
              Email
              <input
                type='text'
                id='email'
                disabled={true}
                value={centro?.email || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='capacidade' className='w-full'>
              Capacidade
              <input
                type='number'
                id='capacidade'
                disabled={true}
                value={centro?.capacidade || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='modalidadeAcolhimento' className='w-full'>
              Modalidade acolhimento
              <input
                type='text'
                id='modalidadeAcolhimento'
                disabled={true}
                value={centro?.modalidadeAcolhimento || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='descricao' className='w-full'>
              Descrição
              <textarea
                id='descricao'
                disabled={true}
                value={centro?.descricao || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
        </article>

        {/* =========== INFRAESTRUTURA =========== */}
        <h2 className='mt-3 font-semibold text-lg text-black'>
          Infraestrutura
        </h2>
        <article className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label htmlFor='quartos' className='w-full'>
              Quartos
              <input
                type='number'
                id='quartos'
                disabled={true}
                value={centro?.infraestrutura?.quartos || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='areasConvivencia' className='w-full'>
              Áreas de convivência
              <input
                type='number'
                id='areasConvivencia'
                disabled={true}
                value={centro?.infraestrutura?.areasConvivencia || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='refeitorio' className='w-full'>
              Refeitório
              <select
                id='refeitorio'
                disabled={true}
                value={centro?.infraestrutura?.refeitorio || ''}
                className='w-full flex items-center px-3 disabled:text-black py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-400 rounded'
              >
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </label>
          </div>
          <div>
            <label htmlFor='outrosEspacos' className='w-full'>
              Outros espaços
              <input
                type='text'
                id='outrosEspacos'
                disabled={true}
                value={centro?.infraestrutura?.outrosEspacos || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='descricao_infra' className='w-full'>
              Descrição
              <textarea
                id='descricao_infra'
                disabled={true}
                value={centro?.infraestrutura?.descricao || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
        </article>

        {/* =========== RECURSO HUMANOS =========== */}
        <h2 className='mt-3 font-semibold text-lg text-black'>
          Recursos Humanos
        </h2>
        <article className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label htmlFor='assistentesSociais' className='w-full'>
              Assistentes sociais
              <input
                type='number'
                id='assistentesSociais'
                disabled={true}
                value={
                  centro?.recursosHumanos?.equipe?.assistentesSociais || ''
                }
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='psicologos' className='w-full'>
              Psicólogos
              <input
                type='number'
                id='psicologos'
                disabled={true}
                value={centro?.recursosHumanos?.equipe?.psicologos || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='educadores' className='w-full'>
              Educadores
              <input
                type='number'
                id='educadores'
                disabled={true}
                value={centro?.recursosHumanos?.equipe?.educadores || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='enfermeiros' className='w-full'>
              Enfermeiros
              <input
                type='number'
                id='enfermeiros'
                disabled={true}
                value={centro?.recursosHumanos?.equipe?.enfermeiros || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='outros' className='w-full'>
              Outros
              <textarea
                id='outros'
                disabled={true}
                value={centro?.recursosHumanos?.equipe?.outros || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
          <div>
            <label htmlFor='descricao_recursos' className='w-full'>
              Descrição
              <textarea
                id='descricao_recursos'
                disabled={true}
                value={centro?.recursosHumanos?.descricao || ''}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
          </div>
        </article>

        <Link
          to={`/centros/edit/${id}`}
          className='w-full md:w-52 mt-4 font-semibold flex self-center items-center justify-center text-center rounded bg-green-600 hover:bg-green-700 text-white px-4 py-3 transition-colors hover:outline'
        >
          Editar informações
        </Link>
      </form>
    </section>
  );
}
