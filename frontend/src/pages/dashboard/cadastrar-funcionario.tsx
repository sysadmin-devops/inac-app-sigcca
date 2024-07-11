/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { InputWrapper } from '@/components/ui/input';
import Toast from '@/components/ui/toast';
import { AuthContext } from '@/context/auth-context';
import { GlobalContext } from '@/context/global-context';
import RenderOnRole from '@/utils/render-on-role';
import { cadastroFormSchema } from '@/utils/schemas';
import useDocumentTitle from '@/utils/use-title';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { User, Mail, Lock, LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type registerFormData = z.infer<typeof cadastroFormSchema>;

export default function CadastrarFuncionario() {
  useDocumentTitle('Criação de conta');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerFormData>({
    resolver: zodResolver(cadastroFormSchema),
  });

  const { centros, allFuncionarios } = useContext(GlobalContext);
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

  async function onSubmit(data: z.output<typeof cadastroFormSchema>) {
    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        if (key === 'imagem' && value) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      }

      const url =
        data?.role === 'funcionario'
          ? 'registerFuncionario'
          : 'registerAdminCentro';
      const response = await fetch(`${import.meta.env.VITE_API}/auth/${url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok && response.status === 400) {
        Toast('E-mail já cadastrado', 'warning', 'top-right');
        throw new Error('Erro no cadastro');
      }
      await response.json();
      allFuncionarios();
      if (response.ok)
        Toast('Cadastro feito com sucesso', 'success', 'top-right');
    } catch (error) {
      Toast('Houve um erro ao fazer cadastro', 'error', 'top-right');
      console.error('Erro ao criar conta:', error);
    }
  }

  const handleImageChange = (e: unknown) => {
    const file = e.target.files[0];

    if (file) {
      setPreview({ name: file.name, src: URL.createObjectURL(file) });
    }
  };

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex flex-col items-start'>
        <h1 className='text-2xl font-semibold'>Cadastro</h1>
        <p className='text-base font-normal text-gray-600 text-center'>
          Preencha o formulário abaixo para criar uma nova conta.
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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div>
            <InputWrapper
              label='Nome'
              icon={User}
              hasError={errors.nome && true}
            >
              <input
                type='text'
                placeholder='Seu nome'
                autoComplete='name'
                {...register('nome')}
                className='inputUnstyle'
              />
            </InputWrapper>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.nome?.message}
              </span>
            )}
          </div>
          <div>
            <InputWrapper
              label='Email'
              icon={Mail}
              hasError={errors.email && true}
            >
              <input
                type='email'
                placeholder='Seu endereço de email'
                autoComplete='email'
                {...register('email')}
                className='inputUnstyle'
              />
            </InputWrapper>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.email?.message}
              </span>
            )}
          </div>
          <label className='flex flex-col'>
            Cargo
            <select
              {...register('role')}
              className='w-full border border-gray-300 rounded py-3 focus:ring-green-400 focus:border-none'
            >
              <option value='funcionario'>Funcionário</option>
              <RenderOnRole allowedRoles={['adminGeral']}>
                <option value='adminCentro'>Administrador Centro</option>
              </RenderOnRole>
            </select>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.role?.message}
              </span>
            )}
          </label>
          <label className='flex flex-col'>
            Centro
            <select
              {...register('centroAcolhimento')}
              className='w-full border border-gray-300 rounded py-3 focus:ring-green-400 focus:border-none'
            >
              <RenderOnRole allowedRoles={['adminGeral']}>
                {centros &&
                  centros.map((option) => (
                    <option value={option?.nome} key={option?._id}>
                      {option?.nome}
                    </option>
                  ))}
              </RenderOnRole>
              <RenderOnRole allowedRoles={['adminCentro']}>
                <option value={centroUser?.nome}>{centroUser?.nome}</option>
              </RenderOnRole>
            </select>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.centroAcolhimento?.message}
              </span>
            )}
          </label>
          <div>
            <InputWrapper
              label='Senha'
              icon={Lock}
              hasError={errors.senha && true}
            >
              <input
                type='password'
                placeholder='Sua senha'
                autoComplete='new-password'
                {...register('senha')}
                className='inputUnstyle'
              />
            </InputWrapper>
            {errors && (
              <span className='text-red-500 text-sm lg:text-base'>
                {errors.senha?.message}
              </span>
            )}
          </div>
        </div>
        <button
          disabled={isSubmitting}
          className='w-full md:w-96 mt-4 font-semibold disabled:cursor-wait text-base flex self-center items-center justify-center text-center rounded bg-green-600 hover:bg-green-700 text-white px-4 py-3 transition-colors disabled:bg-green-800 disabled:text-gray-200 hover:outline'
          type='submit'
        >
          {isSubmitting ? (
            <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
          ) : (
            'Criar conta'
          )}
        </button>
      </form>
    </section>
  );
}
