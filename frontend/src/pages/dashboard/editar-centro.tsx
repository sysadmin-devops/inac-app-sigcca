/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Toast from '@/components/ui/toast';
import { GlobalContext } from '@/context/global-context';
// import { cadastroFormSchema } from '@/utils/schemas';
import useDocumentTitle from '@/utils/use-title';
// import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
// import { z } from 'zod';

// type registerFormData = z.infer<typeof cadastroFormSchema>;

export default function EditarCentro() {
  useDocumentTitle('Atualização de centro');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const { allCentros } = useContext(GlobalContext);

  const [preview, setPreview] = useState({
    name: '',
    src: '/placeholder.jpeg',
  });
  const [centroUser, setCentroUser] = useState({});
  const token = Cookies.get('token');
  const { id } = useParams();

  const getCentro = useCallback(async () => {
    fetch(`${import.meta.env.VITE_API}/api/centroAcolhimento/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((centro) => centro.json())
      .then((centro) => {
        // Preenche os campos do formulário com os dados do centro
        setValue('nome', centro.nome);
        setValue('endereco', centro.endereco);
        setValue('telefone', centro.telefone);
        setValue('email', centro.email);
        setValue('capacidade', centro.capacidade);
        setValue('modalidadeAcolhimento', centro.modalidadeAcolhimento);
        setValue('descricao', centro.descricao);
        setValue(
          'assistentesSociais',
          centro.recursosHumanos.equipe.assistentesSociais
        );
        setValue('psicologos', centro.recursosHumanos.equipe.psicologos);
        setValue('educadores', centro.recursosHumanos.equipe.educadores);
        setValue('enfermeiros', centro.recursosHumanos.equipe.enfermeiros);
        setValue('outros', centro.recursosHumanos.equipe.outros);
        setValue('descricao_recursos', centro.recursosHumanos.descricao);
        setValue('quartos', centro.infraestrutura.quartos);
        setValue('areasConvivencia', centro.infraestrutura.areasConvivencia);
        setValue('refeitorio', centro.infraestrutura.refeitorio);
        setValue('outrosEspacos', centro.infraestrutura.outrosEspacos);
        setValue('descricao_infra', centro.infraestrutura.descricao);

        // Atualiza o estado com os dados do centro e a imagem
        setCentroUser(centro);
        setPreview({
          name: centro.imagem,
          src: `${import.meta.env.VITE_API}/uploads/${centro.imagem}`,
        });
      });
  }, [id, token, setValue]);

  useEffect(() => {
    getCentro();
  }, [getCentro]);

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
        `${import.meta.env.VITE_API}/api/centroAcolhimento/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok && response.status === 400) {
        // Toast('Centro já cadastrado', 'warning', 'top-right');
        throw new Error('Erro na actulização');
      }
      await response.json();
      if (response.ok) {
        getCentro();
        allCentros();
        Toast('Actulização feita com sucesso', 'success', 'top-right');
      }
    } catch (error) {
      Toast('Houve um erro ao fazer actulização', 'error', 'top-right');
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
        <h1 className='text-2xl font-semibold'>Atualização de centro</h1>
        <p className='text-base font-normal text-gray-600 text-center'>
          Faça a actualização do centro de forma simples.
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
            'Actualizar centro'
          )}
        </button>
      </form>
    </section>
  );
}
