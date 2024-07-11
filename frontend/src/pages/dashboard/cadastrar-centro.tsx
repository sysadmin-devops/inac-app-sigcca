/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Toast from '@/components/ui/toast';
import { AuthContext } from '@/context/auth-context';
import { GlobalContext } from '@/context/global-context';
import useDocumentTitle from '@/utils/use-title';
import Cookies from 'js-cookie';
import { LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { z } from 'zod';
           
// type registerFormData = z.infer<typeof cadastroFormSchema>;

export default function CadastrarCentro() {
  useDocumentTitle('Criação de centro');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { centros, allCentros } = useContext(GlobalContext);
  const { userData } = useContext(AuthContext);

  const [preview, setPreview] = useState({
    name: '',
    src: '/placeholder.jpeg',
  });
  const [centroUser, setCentroUser] = useState({});
  const token = Cookies.get('token');

  useEffect(() => {
    if (userData.role === 'adminCentro') {
      fetch(
        `${import.meta.env.VITE_API}/api/centroAcolhimento/${
          userData?.centroAcolhimento
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((centro) => centro.json())
        .then((centro) => setCentroUser(centro));
    }
  }, [userData, token]);

  async function onSubmit(data) {
    try {
      const formData = new FormData();

      formData.append('nome', data.nome);
      formData.append('endereco', data.endereco);
      formData.append('telefone', data.telefone);
      formData.append('email', data.email);
      formData.append('capacidade', data.capacidade.toString()); // Converte para string
      formData.append('modalidadeAcolhimento', data.modalidadeAcolhimento);
      formData.append('descricao', data.descricao);
      formData.append(
        'recursosHumanos[equipe][assistentesSociais]',
        data.assistentesSociais
      );
      formData.append('recursosHumanos[equipe][psicologos]', data.psicologos);
      formData.append('recursosHumanos[equipe][educadores]', data.educadores);
      formData.append('recursosHumanos[equipe][enfermeiros]', data.enfermeiros);
      formData.append('recursosHumanos[equipe][outros]', data.outros);
      formData.append('recursosHumanos[descricao]', data.descricao_recursos);
      formData.append('infraestrutura[quartos]', data.quartos);
      formData.append(
        'infraestrutura[areasConvivencia]',
        data.areasConvivencia
      );
      formData.append('infraestrutura[refeitorio]', data.refeitorio);
      formData.append('infraestrutura[outrosEspacos]', data.outrosEspacos);
      formData.append('infraestrutura[descricao]', data.descricao_infra);

      // Adiciona a imagem apenas se existir
      if (data.imagem && data.imagem.length > 0) {
        formData.append('imagem', data.imagem[0]);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API}/api/centroAcolhimento/register`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok && response.status === 400) {
        // Toast('Centro já cadastrado', 'warning', 'top-right');
        throw new Error('Erro no cadastro');
      }
      await response.json();
      if (response.ok) {
        allCentros();
        Toast('Cadastro feito com sucesso', 'success', 'top-right');
      }
    } catch (error) {
      Toast('Houve um erro ao fazer cadastro', 'error', 'top-right');
      console.error('Erro ao criar conta:', error);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview({ name: file.name, src: URL.createObjectURL(file) });
    }
  };

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-col items-start text-black'>
        <h1 className='text-2xl font-semibold'>Cadastro de centro</h1>
        <p className='text-base font-normal text-gray-600 text-center'>
          Preencha o formulário abaixo para criar um novo centro.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 w-full px-3 md:px-10'
      >
        <div className='flex flex-col items-center md:items-start gap-3'>
          <img
            src={preview.src}
            alt='Preview'
            className='w-44 h-44 object-cover rounded-full'
          />
          <input
            type='file'
            accept='image/*'
            id='imagem'
            {...register('imagem')}
            onChange={handleImageChange}
            className='file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-600
          hover:file:bg-green-100 hover:file:cursor-pointer focus:outline-none focus:border-none'
            aria-label='Escolha uma foto de perfil'
          />
          {errors && (
            <span className='text-red-500 text-sm lg:text-base'>
              {errors.imagem?.message}
            </span>
          )}
        </div>
        <article className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <label htmlFor='nome' className='w-full'>
              Nome
              <input
                type='text'
                id='nome'
                {...register('nome')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder='Nome do centro'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.nome?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='endereco' className='w-full'>
              Endereço
              <input
                type='text'
                id='endereco'
                {...register('endereco')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder='Endereço do centro'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.endereco?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='telefone' className='w-full'>
              Telefone
              <input
                type='number'
                id='telefone'
                {...register('telefone')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder='Ex: 910 000 000'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.email?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='email' className='w-full'>
              Email
              <input
                type='text'
                id='email'
                {...register('email')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder='exemplo@nome.com'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.email?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='capacidade' className='w-full'>
              Capacidade
              <input
                type='number'
                id='capacidade'
                {...register('capacidade')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder='Ex: 1000'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.capacidade?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='modalidadeAcolhimento' className='w-full'>
              Modalidade acolhimento
              <input
                type='text'
                id='modalidadeAcolhimento'
                {...register('modalidadeAcolhimento')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder=''
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.modalidadeAcolhimento?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='descricao' className='w-full'>
              Descrição
              <textarea
                placeholder='Uma descrição...'
                id='descricao'
                {...register('descricao')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.descricao?.message}
              </span>
            )}
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
                {...register('quartos')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder=''
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.quartos?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='areasConvivencia' className='w-full'>
              Áreas de convivência
              <input
                type='number'
                id='areasConvivencia'
                {...register('areasConvivencia')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.areasConvivencia?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='refeitorio' className='w-full'>
              Refeitório
              <select
                id='refeitorio'
                {...register('refeitorio')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              >
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.refeitorio?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='outrosEspacos' className='w-full'>
              Outros espaços
              <input
                type='text'
                id='outrosEspacos'
                {...register('outrosEspacos')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.outrosEspacos?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='descricao_infra' className='w-full'>
              Descrição
              <textarea
                placeholder='Uma descrição...'
                id='descricao_infra'
                {...register('descricao_infra')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.descricao_infra?.message}
              </span>
            )}
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
                {...register('assistentesSociais')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
                placeholder=''
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.assistentesSociais?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='psicologos' className='w-full'>
              Psicólogos
              <input
                type='number'
                id='psicologos'
                {...register('psicologos')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.psicologos?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='educadores' className='w-full'>
              Educadores
              <input
                type='number'
                id='educadores'
                {...register('educadores')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.educadores?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='enfermeiros' className='w-full'>
              Enfermeiros
              <input
                type='number'
                id='enfermeiros'
                {...register('enfermeiros')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.enfermeiros?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='outros' className='w-full'>
              Outros
              <textarea
                placeholder='Ex: Cozinheiros: 2...'
                id='outros'
                {...register('outros')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.outros?.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor='descricao_recursos' className='w-full'>
              Descrição
              <textarea
                placeholder='Uma descrição...'
                id='descricao_recursos'
                {...register('descricao_recursos')}
                className='w-full flex items-center px-3 py-2.5 gap-1 focus:ring-0 focus:border-none focus-within:outline-2 focus-within:outline focus-within:outline-green-500 bg-white border border-gray-300 rounded'
              />
            </label>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.descricao_recursos?.message}
              </span>
            )}
          </div>
        </article>

        <button
          disabled={isSubmitting}
          className='w-full md:w-96 mt-4 font-semibold disabled:cursor-wait text-base flex self-center items-center justify-center text-center rounded bg-green-600 hover:bg-green-700 text-white px-4 py-3 transition-colors disabled:bg-green-800 disabled:text-gray-200 hover:outline'
          type='submit'
        >
          {isSubmitting ? (
            <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
          ) : (
            'Criar centro'
          )}
        </button>
      </form>
    </section>
  );
}
