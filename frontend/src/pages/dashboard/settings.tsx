/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { InputWrapper } from '@/components/ui/input';
import Toast from '@/components/ui/toast';
import { AuthContext } from '@/context/auth-context';
import { GlobalContext } from '@/context/global-context';
import {
  newPasswordFormSchema,
  updateProfileFormSchema,
} from '@/utils/schemas';
import useDocumentTitle from '@/utils/use-title';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

type newPassowrdSchema = z.infer<typeof newPasswordFormSchema>;
type updateProfileSchema = z.infer<typeof updateProfileFormSchema>;

export default function Settings() {
  useDocumentTitle('Configurações');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<newPassowrdSchema>({
    resolver: zodResolver(newPasswordFormSchema),
  });
  const { idUsuario } = useContext(GlobalContext);
  const token = Cookies.get('token');
  async function onNewPasswordSubmit(
    data: z.output<typeof newPasswordFormSchema>
  ) {
    try {
      const usuario = await JSON.parse(
        localStorage.getItem('usuario') as string
      );
      const response = await fetch(
        `${import.meta.env.VITE_API}/api/${
          usuario.role === 'funcionario'
            ? 'funcionarios'
            : usuario.role === 'adminCentro'
            ? 'adminCentro'
            : 'adminGeral'
        }/${idUsuario}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senha: data.password,
          }),
        }
      );

      if (!response.ok) {
        Toast(
          'Houve um erro ao actualizar palavra-passe',
          'error',
          'top-right'
        );
      }
      if (response.ok) {
        const data = await response.json();
        reset();
        Toast('Palavra-passe atualizada com sucesso', 'success', 'top-right');
      }
    } catch (error) {
      console.error(
        'Houve um erro ao fazer ao actualizar palavra-passe',
        error
      );
    }
  }

  return (
    <section className='space-y-6'>
      <article className='space-y-1 leading-relaxed border-b pb-3 border-gray-300'>
        <h1 className='text-2xl font-medium text-black'>Configurações</h1>
        <p className='text-gray-500'>Todas as configuraçoes ao seu alcance.</p>
      </article>
      <article className='flex flex-col md:flex-row gap-6'>
        <UpdateAccountForm />
        <form
          onSubmit={handleSubmit(onNewPasswordSubmit)}
          className='w-full h-full flex flex-col gap-4 bg-white p-3 rounded-md'
        >
          <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-semibold'>Palavra-passe</h1>
          </div>
          {/* <div className='flex flex-col gap-3'>
            <InputWrapper label='Actual' hasError={errors.password && true}>
              <input
                type='password'
                placeholder='Sua senha actual'
                autoComplete='current-password'
                {...register('password')}
                className='inputUnstyle'
              />
            </InputWrapper>
            {errors && (
              <span className='text-red-500'>{errors.password?.message}</span>
            )}
          </div> */}
          <div className='flex flex-col gap-3'>
            <InputWrapper label='Nova senha' hasError={errors.password && true}>
              <input
                type='password'
                placeholder='Digite a sua nova senha'
                autoComplete='new-password'
                {...register('password')}
                className='inputUnstyle'
              />
            </InputWrapper>
            {errors && (
              <span className='text-red-500'>{errors.password?.message}</span>
            )}
          </div>
          <div className='flex flex-col gap-3'>
            <InputWrapper
              label='Digite novamente a senha'
              hasError={errors.confirmPassword && true}
            >
              <input
                type='password'
                placeholder='Digite novamente para confirmar'
                autoComplete='new-password'
                {...register('confirmPassword')}
                className='inputUnstyle'
              />
            </InputWrapper>
            {errors && (
              <span className='text-red-500'>
                {errors.confirmPassword?.message}
              </span>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className={twMerge(
              'button',
              isSubmitting && 'cursor-wait select-none'
            )}
            type='submit'
          >
            {isSubmitting ? (
              <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
            ) : (
              'Salvar'
            )}
          </button>
        </form>
      </article>
    </section>
  );
}

const UpdateAccountForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<updateProfileSchema>({
    resolver: zodResolver(updateProfileFormSchema),
  });

  const { idUsuario, usuario, getUser } = useContext(GlobalContext);
  const { saveUserData } = useContext(AuthContext);
  const [preview, setPreview] = useState({
    name: '',
    src: `${import.meta.env.VITE_API}/uploads/${usuario?.imagem}`,
  });

  async function onUpdateAccountSubmit(
    formData: z.output<typeof updateProfileFormSchema>
  ) {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.name);
      formDataToSend.append('email', formData.email);

      if (formData.imagem?.[0]) {
        formDataToSend.append('imagem', formData.imagem[0]);
      }

      await new Promise((resolve) => setTimeout(resolve, 0));
      const result = updateProfileFormSchema.safeParse(formData);

      if (!result.success) {
        Toast('Existem erros no formulário', 'error', 'top-right');
        return;
      }

      const token = Cookies.get('token');
      const usuario = await JSON.parse(
        localStorage.getItem('usuario') as string
      );
      const response = await fetch(
        `${import.meta.env.VITE_API}/api/${
          usuario.role === 'funcionario'
            ? 'funcionarios'
            : usuario.role === 'adminCentro'
            ? 'adminCentro'
            : 'adminGeral'
        }/${idUsuario}`,
        {
          method: 'PUT',
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        Toast('Houve um erro na atualização dos dados', 'error', 'top-right');
      }
      if (response.ok) {
        const data = await response.json();

        saveUserData({
          id: data._id,
          role: data.role,
          email: data.email,
          nome: data.nome,
          cargo: data.role === 'funcionario' ? 'Funcionário' : 'Administrador',
          centroAcolhimento: data.centroAcolhimento,
          imagem: data.imagem,
        });

        getUser();
        Toast('Dados atualizado com sucesso', 'success', 'top-right');
      }
    } catch (error) {
      console.error(
        'Houve um erro ao fazer fazer actualização das informações',
        error
      );
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview({ name: file.name, src: URL.createObjectURL(file) });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onUpdateAccountSubmit)}
      className='w-full h-full flex flex-col gap-4 bg-white p-3 rounded-md'
    >
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl font-semibold'>Informações da conta</h1>
        <p className='text-base font-normal text-gray-600'>
          Actualize seus dados facilmente
        </p>
      </div>
      <div className='flex flex-col items-start gap-3'>
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
      </div>
      <div className='flex flex-col gap-3'>
        <InputWrapper label='Nome' hasError={errors.name && true}>
          <input
            type='text'
            placeholder='Nome'
            autoComplete='name'
            defaultValue={usuario?.nome || ''}
            {...register('name')}
            className='inputUnstyle'
          />
        </InputWrapper>
        {errors && <span className='text-red-500'>{errors.name?.message}</span>}
      </div>
      <div className='flex flex-col gap-3'>
        <InputWrapper label='Email' hasError={errors.email && true}>
          <input
            type='email'
            placeholder='Seu novo email'
            autoComplete='email'
            defaultValue={usuario?.email || ''}
            {...register('email')}
            className='inputUnstyle'
          />
        </InputWrapper>
        {errors && (
          <span className='text-red-500'>{errors.email?.message}</span>
        )}
      </div>

      <button
        disabled={isSubmitting}
        className={twMerge('button', isSubmitting && 'cursor-wait select-none')}
        type='submit'
      >
        {isSubmitting ? (
          <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
        ) : (
          'Actualizar'
        )}
      </button>
    </form>
  );
};
