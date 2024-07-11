/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { InputWrapper } from '@/components/ui/input';
import useDocumentTitle from '@/utils/use-title';
import Cookies from 'js-cookie';
import { User, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Funcionario() {
  useDocumentTitle('Dados do funcionário');

  const { id } = useParams();
  const [funcionario, setFuncionario] = useState({});
  const token = Cookies.get('token');
  const [preview, setPreview] = useState({
    name: '',
    src: '/placeholder.jpeg',
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/funcionarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((funci) => setFuncionario(funci));
    if (funcionario?.imagem) {
      setPreview({
        name: funcionario?.nome,
        src: `${import.meta.env.VITE_API}/uploads/${funcionario?.imagem}`,
      });
    }
  }, [id, token, funcionario, setPreview]);

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-col items-start'>
        <h1 className='text-2xl font-semibold'>Informações do funcionário</h1>
        <p className='text-base font-normal text-gray-600 text-center'>
          Todas informações do funcionário disponível
        </p>
      </div>
      <article className='flex flex-col gap-4 w-full px-3 md:px-10'>
        <div className='flex flex-col items-center md:items-start gap-3'>
          <img
            src={preview.src}
            alt='Preview'
            className='w-44 h-44 object-cover rounded-full'
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <InputWrapper label='Nome' icon={User}>
              <input
                type='text'
                placeholder='Seu nome'
                autoComplete='name'
                className='inputUnstyle'
                value={funcionario?.nome || ''}
                disabled={true}
              />
            </InputWrapper>
          </div>
          <div>
            <InputWrapper label='Email' icon={Mail}>
              <input
                type='email'
                placeholder='Seu endereço de email'
                autoComplete='email'
                className='inputUnstyle'
                value={funcionario?.email || ''}
                disabled={true}
              />
            </InputWrapper>
          </div>
          <label className='flex flex-col'>
            Cargo
            <select
              disabled={true}
              className='w-full border  border-gray-400 disabled:text-black rounded py-3 focus:ring-green-400 focus:border-none'
            >
              <option value='funcionario'>Funcionário</option>
            </select>
          </label>
          <label className='flex flex-col'>
            Centro
            <select
              disabled={true}
              className='w-full border border-gray-400 disabled:text-black rounded py-3 focus:ring-green-400 focus:border-none'
            >
              <option value={funcionario?.centroAcolhimento?.nome || ''}>
                {funcionario?.centroAcolhimento?.nome || ''}
              </option>
            </select>
          </label>
        </div>
        <Link
          to={`/funcionarios/edit/${id}`}
          className='w-full md:w-52 mt-4 font-semibold flex self-center items-center justify-center text-center rounded bg-green-600 hover:bg-green-700 text-white px-4 py-3 transition-colors hover:outline'
        >
          Editar informações
        </Link>
      </article>
    </section>
  );
}
