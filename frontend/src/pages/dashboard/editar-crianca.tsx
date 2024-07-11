/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import useDocumentTitle from '@/utils/use-title';
import { ChevronDown, LoaderCircle } from 'lucide-react';
import { FieldValues, UseFormRegister, useForm } from 'react-hook-form';
import * as Accordion from '@radix-ui/react-accordion';

import {
  provincias,
  nacionalidades,
  municipiosPorProvincia,
  classes,
} from '@/utils/utils';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GlobalContext } from '@/context/global-context';
import { useParams } from 'react-router-dom';
import { CriancaTypes } from '@/utils/types';
import Cookies from 'js-cookie';
import Toast from '@/components/ui/toast';

// type criancaFormData = z.infer<typeof criancaFormSchema>;

type DataProps = {
  register?: UseFormRegister<FieldValues>;
  handleImageChange?: (event: any) => void;
  preview?: string;
};

function convertJsonToFormData(
  jsonObject,
  formData = new FormData(),
  parentKey = ''
) {
  if (
    jsonObject &&
    typeof jsonObject === 'object' &&
    !(jsonObject instanceof File) &&
    !(jsonObject instanceof FileList)
  ) {
    Object.keys(jsonObject).forEach((key) => {
      const value = jsonObject[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(fullKey, value[i]);
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          convertJsonToFormData(item, formData, `${fullKey}[${index}]`);
        });
      } else if (typeof value === 'object' && value !== null) {
        convertJsonToFormData(value, formData, fullKey);
      } else if (value !== undefined && value !== null) {
        formData.append(fullKey, value);
      }
    });
  } else {
    if (jsonObject !== undefined && jsonObject !== null) {
      formData.append(parentKey, jsonObject);
    }
  }

  return formData;
}

const validarIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= 0 && idade <= 18;
};

export default function EditarCrianca() {
  useDocumentTitle('Editar informações da criança');
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    // resolver: zodResolver(criancaFormSchema),
  });

  const { allCriancas, allCriancasByProvince } = useContext(GlobalContext);
  const { id } = useParams();
  const [crianca, setCrianca] = useState<CriancaTypes>({});

  const [preview, setPreview] = useState({
    name: '',
    src: `${import.meta.env.VITE_API}/uploads/${crianca?.imagem}`,
  });
  const [parentes, setParentes] = useState({
    pai: '',
    mae: '',
  });
  const [municipios, setMunicipios] = useState(
    municipiosPorProvincia[crianca.provincia] || []
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview({ name: file.name, src: URL.createObjectURL(file) });
    }
  };

  const token = Cookies.get('token');

  const criancaData = () => {
    fetch(`${import.meta.env.VITE_API}/api/criancas/${id}`, {
      cache: 'default',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((criancas) => setCrianca(criancas));
  };

  useEffect(() => {
    criancaData();
  }, []);

  const dataMinima = useMemo(() => {
    const hoje = new Date();
    hoje.setFullYear(hoje.getFullYear() - 18); // 18 anos atrás
    return hoje.toISOString().split('T')[0]; // Formatar para "AAAA-MM-DD"
  }, []);

  const dataMaxima = useMemo(() => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0]; // Formatar para "AAAA-MM-DD"
  }, []);

  async function onSubmit(data: any) {
    try {
      const newData = {
        nome_completo: data.nome_completo,
        nome_desconhecido: false,
        sexo: data.sexo,
        filiacao: `Pai: ${data.pai}, Mãe: ${data.mae}`,
        estado: data.estado,
        provincia: data.provincia,
        municipio: data.municipio,
        nacionalidade: data.nacionalidade,
        distrito: data.distrito,
        bairro: data.bairro,
        naturalidade: data.naturalidade,
        imagem: data.imagem,
        zona_vivia: data.zona_vivia,
        ponto_referencia: data.ponto_referencia,
        data_nascimento: data.data_nascimento,
        // data_entrada: data.data_entrada,
        // data_atualizacao: data.data_atualizacao,
        caracteristicas: [
          {
            descricao: data.caracteristicas_descricao,
            vestuario: data.caracteristicas_vestuario,
          },
        ],
        contacto_familiar: {
          familia_localizada: true,
          residencia_atual: data.residencia_atual,
          frequencia_contacto_anual: data.frequencia_contacto_anual,
          pessoa_vivia_crianca: data.pessoa_vivia_crianca,
          irmaos_biologicos: data.irmaos_biologicos,
          quanto_tempo: data.quanto_tempo,
          onde_esteve: data.onde_esteve,
          telefone: data.telefone_familiar,
          email: data.email_familiar,
        },
        escola: {
          classe: data.classe,
          escola: data.escola,
          ano: data.ano,
        },
        entidade_responsavel_crianca: {
          nome_responsavel: data.nome_responsavel,
          telefone: data.telefone_entidade,
          telemovel: data.telemovel_entidade,
          email: data.email_entidade,
        },
        antecedentes_crianca: {
          acto_licito: data.acto_licito,
          justica_juvenil: data.justica_juvenil,
          instituicao_justica_juvenil: data.instituicao_justica_juvenil,
        },
        motivo_saida: {
          descricao: data.motivo_saida,
        },
        acompanhamento_tecnico: {
          frequencia_escolar: data.frequencia_escolar,
          curso_tecnico: data.curso_tecnico,
          acompanhamento_psicologico: data.acompanhamento_psicologico,
          comportamento_positivo: data.comportamento_positivo,
          acompanhamento_medico: data.acompanhamento_medico,
          estado: data.estado_tecnico,
          nome_tecnico: data.nome_tecnico,
          telefone: data.telefone_tecnico,
          telemovel: data.telefone_tecnico,
          email: data.email_tecnico,
        },
        processo_reunificacao: {
          processo_anterior: data.processo_anterior,
          descricao_processo_anterior: data.processo_anterior,
        },
      };
      if (!data.data_nascimento) {
        Toast(
          'Precisa selecionar a data de nascimento',
          'warning',
          'top-right'
        );
        return;
      } else if (validarIdade(data.data_nascimento) === false) {
        Toast('A idade deve ser entre 0 e 18 anos', 'error', 'top-right');
      }

      const formDataToSend = convertJsonToFormData(newData);

      const response = await fetch(
        `${import.meta.env.VITE_API}/api/criancas/${id}`,
        {
          method: 'PUT',
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erro ao actualizar');
      await response.json();
      criancaData();
      allCriancas();
      allCriancasByProvince();
      Toast('Actualização feita com sucesso', 'success', 'top-right');
    } catch (error) {
      Toast('Houve um erro ao actualizar informações', 'error', 'top-right');
      console.error('Houve um erro ao actualizar criança', error);
    }
  }

  function formatDataInput(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // Verifica se a data é inválida
      console.error('Data inválida:', dateString);
      return 'Data Inválida'; // Ou algum outro valor padrão para indicar erro
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const partes = crianca?.filiacao && crianca?.filiacao.split(',');
    const nomePai =
      (partes && partes[0]?.split(': ')[1]) || 'Nome não informado';
    const nomeMae =
      (partes && partes[1]?.split(': ')[1]) || 'Nome não informado';

    setParentes({
      pai: nomePai,
      mae: nomeMae,
    });

    const municipiosSelecionados =
      municipiosPorProvincia[crianca?.provincia] || [];
    setMunicipios([...municipiosSelecionados]);
  }, [crianca?.filiacao, crianca?.provincia]);

  return (
    <section className='space-y-5'>
      <article className='space-y-1 leading-relaxed border-b pb-4 border-gray-300'>
        <h1 className='text-2xl font-medium text-black'>
          Actualizar informações
        </h1>
        <p className='text-gray-500'>
          Certifique-se de ser cuidadoso ao actualizar as informações.
        </p>
      </article>
      <article className='flex flex-col gap-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-12'>
          <Accordion.Root className='w-full space-y-5' type='multiple'>
            <Accordion.Item value='item-1'>
              <Accordion.Trigger className='flex gap-2 group items-center justify-center text-lg font-medium text-green-500 mb-2'>
                Dados pessoais{' '}
                <ChevronDown className='w-5 h-5 group-data-[state=open]:rotate-180' />
              </Accordion.Trigger>
              <Accordion.Content>
                <article className='space-y-3'>
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
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label htmlFor='nome_completo' className='w-full'>
                      Nome completo
                      <input
                        type='text'
                        id='nome_completo'
                        {...register('nome_completo')}
                        className='input'
                        value={crianca.nome_completo}
                        onChange={(e) =>
                          setCrianca({
                            ...crianca,
                            nome_completo: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label htmlFor='sexo' className='w-full'>
                      Sexo
                      <select
                        id='sexo'
                        {...register('sexo')}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        defaultValue={crianca.sexo || ''}
                        onChange={(e) => {
                          setValue('sexo', e.target.value);
                          setCrianca({ ...crianca, sexo: e.target.value });
                        }}
                      >
                        <option value='Masculino'>Masculino</option>
                        <option value='Feminino'>Feminino</option>
                      </select>
                    </label>

                    <label htmlFor='pai' className='w-full'>
                      Pai
                      <input
                        type='text'
                        id='pai'
                        {...register('pai')}
                        value={parentes.pai}
                        onChange={(e) =>
                          setParentes({ ...parentes, pai: e.target.value })
                        }
                        className='input'
                      />
                    </label>
                    <label htmlFor='mae' className='w-full'>
                      Mãe
                      <input
                        type='text'
                        id='mae'
                        {...register('mae')}
                        value={parentes.mae}
                        onChange={(e) =>
                          setParentes({ ...parentes, mae: e.target.value })
                        }
                        className='input'
                      />
                    </label>
                    <label htmlFor='estado' className='w-full'>
                      Estado
                      <input
                        type='text'
                        id='estado'
                        {...register('estado')}
                        className='input'
                        value={crianca.estado}
                        onChange={(e) =>
                          setCrianca({ ...crianca, estado: e.target.value })
                        }
                      />
                    </label>

                    <label htmlFor='provincia' className='w-full'>
                      Província
                      <select
                        id='provincia'
                        {...register('provincia')}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        defaultValue={crianca?.provincia || ''}
                        onChange={(e) => {
                          setValue('provincia', e.target.value);
                          setCrianca({ ...crianca, provincia: e.target.value });

                          const municipiosSelecionados =
                            municipiosPorProvincia[e.target.value] || [];
                          setMunicipios([...municipiosSelecionados]); // Cria uma cópia antes de atualizar
                        }}
                      >
                        {provincias.map((provincia) => (
                          <option value={provincia} key={provincia}>
                            {provincia}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label htmlFor='municipio' className='w-full'>
                      Município
                      <select
                        id='municipio'
                        {...register('municipio')}
                        className='input'
                        defaultValue={crianca?.municipio || ''}
                        onChange={(e) => {
                          setValue('municipio', e.target.value);
                          setCrianca({ ...crianca, municipio: e.target.value });
                        }}
                      >
                        {municipios.map((municipio) => (
                          <option value={municipio} key={municipio}>
                            {municipio}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label htmlFor='nacionalidade' className='w-full'>
                      Nacionalidade
                      <select
                        id='nacionalidade'
                        {...register('nacionalidade')}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        defaultValue={crianca.nacionalidade || ''}
                        onChange={(e) => {
                          setValue('nacionalidade', e.target.value);
                          setCrianca({
                            ...crianca,
                            nacionalidade: e.target.value,
                          });
                        }}
                      >
                        {nacionalidades.map((nacionalidade) => (
                          <option value={nacionalidade} key={nacionalidade}>
                            {nacionalidade}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label htmlFor='distrito' className='w-full'>
                      Distrito
                      <input
                        type='text'
                        id='distrito'
                        {...register('distrito')}
                        className='input'
                        value={crianca.distrito}
                        onChange={(e) =>
                          setCrianca({ ...crianca, distrito: e.target.value })
                        }
                      />
                    </label>

                    <label htmlFor='bairro' className='w-full'>
                      Bairro
                      <input
                        type='text'
                        id='bairro'
                        {...register('bairro')}
                        className='input'
                        value={crianca.bairro}
                        onChange={(e) =>
                          setCrianca({ ...crianca, bairro: e.target.value })
                        }
                      />
                    </label>
                    <label htmlFor='naturalidade' className='w-full'>
                      Naturalidade
                      <input
                        type='text'
                        id='naturalidade'
                        {...register('naturalidade')}
                        className='input'
                        value={crianca.naturalidade}
                        onChange={(e) =>
                          setCrianca({
                            ...crianca,
                            naturalidade: e.target.value,
                          })
                        }
                      />
                    </label>

                    <label htmlFor='zona_vivia' className='w-full'>
                      Zona vivia
                      <input
                        type='text'
                        id='zona_vivia'
                        {...register('zona_vivia')}
                        className='input'
                        value={crianca.zona_vivia}
                        onChange={(e) =>
                          setCrianca({ ...crianca, zona_vivia: e.target.value })
                        }
                      />
                    </label>

                    <label htmlFor='ponto_referencia' className='w-full'>
                      Ponto referência
                      <input
                        type='text'
                        id='ponto_referencia'
                        {...register('ponto_referencia')}
                        className='input'
                        value={crianca.ponto_referencia}
                        onChange={(e) =>
                          setCrianca({
                            ...crianca,
                            ponto_referencia: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label htmlFor='data_nascimento' className='w-full'>
                      Data de nascimento
                      <input
                        type='date'
                        id='data_nascimento'
                        {...register('data_nascimento')}
                        className='input'
                        value={formatDataInput(crianca.data_nascimento)}
                        onChange={(e) => {
                          setValue('data_nascimento', e.target.value); // Atualiza o valor no formulário
                          setCrianca({
                            ...crianca,
                            data_nascimento: e.target.value,
                          }); // Atualiza o estado
                        }}
                        min={dataMinima}
                        max={dataMaxima}
                      />
                    </label>
                  </div>
                </article>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Trigger className='flex gap-2 group items-center justify-center text-lg font-medium text-green-500 mb-2'>
                Informações Adicionais
                <ChevronDown className='w-5 h-5 group-data-[state=open]:rotate-180' />
              </Accordion.Trigger>
              <Accordion.Content>
                <article className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {/* <label htmlFor='data_entrada' className='w-full'>
                    Data de entrada
                    <input
                      type='date'
                      id='data_entrada'
                      {...register('data_entrada')}
                      className='input'
                      value={formatDataInput(crianca.data_entrada)}
                      onChange={(e) => {
                        setValue('data_entrada', e.target.value);
                        setCrianca({
                          ...crianca,
                          data_entrada: e.target.value,
                        });
                      }}
                    />
                  </label> */}
                  {/* <label htmlFor='data_atualizacao' className='w-full'>
                    Data atualização
                    <input
                      type='date'
                      id='data_atualizacao'
                      {...register('data_atualizacao')}
                      className='input'
                      value={formatDataInput(crianca.data_atualizacao)}
                      onChange={(e) => {
                        setValue('data_atualizacao', e.target.value);
                        setCrianca({
                          ...crianca,
                          data_atualizacao: e.target.value,
                        });
                      }}
                    />
                  </label> */}

                  <label htmlFor='caracteristicas_descricao' className='w-full'>
                    Descrição
                    <textarea
                      rows={3}
                      id='caracteristicas_descricao'
                      {...register('caracteristicas_descricao')}
                      className='input'
                      defaultValue={
                        crianca?.caracteristicas?.[0]?.descricao || ''
                      }
                      onChange={(e) =>
                        setValue('caracteristicas_descricao', e.target.value)
                      }
                    ></textarea>
                  </label>
                  <label htmlFor='caracteristicas_vestuario' className='w-full'>
                    Vestuario
                    <textarea
                      rows={3}
                      id='caracteristicas_vestuario'
                      {...register('caracteristicas_vestuario')}
                      className='input'
                      defaultValue={
                        crianca?.caracteristicas?.[0]?.vestuario || ''
                      }
                      onChange={(e) =>
                        setValue('caracteristicas_vestuario', e.target.value)
                      }
                    ></textarea>
                  </label>

                  <label htmlFor='residencia_atual' className='w-full'>
                    Residência atual
                    <input
                      type='text'
                      id='residencia_atual'
                      {...register('residencia_atual')}
                      className='input'
                      value={crianca?.contacto_familiar?.residencia_atual || ''}
                      onChange={(e) =>
                        setCrianca((prevCrianca) => ({
                          ...prevCrianca,
                          contacto_familiar: {
                            ...prevCrianca.contacto_familiar,
                            residencia_atual: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <label htmlFor='frequencia_contacto_anual' className='w-full'>
                    Frequência de contacto anual
                    <input
                      type='number'
                      id='frequencia_contacto_anual'
                      {...register('frequencia_contacto_anual')}
                      className='input'
                      value={
                        crianca?.contacto_familiar?.frequencia_contacto_anual ||
                        0
                      }
                      onChange={(e) =>
                        setCrianca((prevCrianca) => ({
                          ...prevCrianca,
                          contacto_familiar: {
                            ...prevCrianca.contacto_familiar,
                            frequencia_contacto_anual: parseInt(
                              e.target.value,
                              10
                            ),
                          },
                        }))
                      }
                    />
                  </label>

                  <label htmlFor='pessoa_vivia_crianca' className='w-full'>
                    Pessoa que vivia com a criança
                    <input
                      type='text'
                      id='pessoa_vivia_crianca'
                      {...register('pessoa_vivia_crianca')}
                      className='input'
                      value={
                        crianca?.contacto_familiar?.pessoa_vivia_crianca || ''
                      }
                      onChange={(e) =>
                        setCrianca((prevCrianca) => ({
                          ...prevCrianca,
                          contacto_familiar: {
                            ...prevCrianca.contacto_familiar,
                            pessoa_vivia_crianca: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <label htmlFor='irmaos_biologicos' className='w-full'>
                    Irmãos biológicos
                    <select
                      id='irmaos_biologicos'
                      {...register('irmaos_biologicos')}
                      className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                      defaultValue={
                        crianca?.contacto_familiar?.irmaos_biologicos || ''
                      }
                      onChange={(e) => {
                        setValue('irmaos_biologicos', e.target.value);
                        setCrianca({
                          ...crianca,
                          irmaos_biologicos: e.target.value,
                        });
                      }}
                    >
                      <option value='true'>Sim</option>
                      <option value='false'>Não</option>
                    </select>
                  </label>

                  <label htmlFor='quanto_tempo' className='w-full'>
                    Quanto tempo
                    <input
                      type='text'
                      id='quanto_tempo'
                      {...register('quanto_tempo')}
                      className='input'
                      value={crianca?.contacto_familiar?.quanto_tempo || ''}
                      onChange={(e) =>
                        setCrianca((prevCrianca) => ({
                          ...prevCrianca,
                          contacto_familiar: {
                            ...prevCrianca.contacto_familiar,
                            quanto_tempo: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <label htmlFor='onde_esteve' className='w-full'>
                    Onde esteve
                    <input
                      type='text'
                      id='onde_esteve'
                      {...register('onde_esteve')}
                      className='input'
                      value={crianca?.contacto_familiar?.onde_esteve || ''}
                      onChange={(e) =>
                        setCrianca((prevCrianca) => ({
                          ...prevCrianca,
                          contacto_familiar: {
                            ...prevCrianca.contacto_familiar,
                            onde_esteve: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>

                  <label htmlFor='telefone_familiar' className='w-full'>
                    Telefone
                    <input
                      type='number'
                      id='telefone_familiar'
                      {...register('telefone_familiar')}
                      className='input'
                      value={crianca?.contacto_familiar?.telefone || 0}
                      onChange={(e) =>
                        setCrianca((prevCrianca) => ({
                          ...prevCrianca,
                          contacto_familiar: {
                            ...prevCrianca.contacto_familiar,
                            telefone: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                  <label htmlFor='email_familiar' className='w-full'>
                    Email
                    <input
                      type='email_familiar'
                      id='email_familiar'
                      {...register('email_familiar')}
                      className='input'
                      value={crianca?.contacto_familiar?.email || ''}
                      onChange={(e) =>
                        setCrianca((prevCrianca) => ({
                          ...prevCrianca,
                          contacto_familiar: {
                            ...prevCrianca.contacto_familiar,
                            email: e.target.value,
                          },
                        }))
                      }
                    />
                  </label>
                </article>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Trigger className='flex gap-2 group items-center justify-center text-lg font-medium text-green-500 mb-2'>
                Histórico da Criança
                <ChevronDown className='w-5 h-5 group-data-[state=open]:rotate-180' />
              </Accordion.Trigger>
              <Accordion.Content>
                <article className='space-y-3'>
                  <p className='font-medium'>Escola</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label htmlFor='escola'>
                      Nome da instituição
                      <input
                        type='text'
                        id='escola'
                        {...register('escola')}
                        className='input'
                        value={crianca?.escola?.escola}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            escola: {
                              ...prevCrianca.escola,
                              escola: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='classe'>
                      Classe
                      <select
                        id='classe'
                        name='classe'
                        {...register('classe')}
                        defaultValue={crianca?.escola?.classe || ''}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        onChange={(e) => {
                          setValue('classe', e.target.value);
                          setCrianca({ ...crianca, classe: e.target.value });
                        }}
                      >
                        {classes.map((classe) => (
                          <option key={classe} value={classe}>
                            {classe}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label htmlFor='ano'>
                      Ano
                      <input
                        type='number'
                        id='ano'
                        {...register('ano')}
                        className='input'
                        value={crianca?.escola?.ano || ''}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            escola: {
                              ...prevCrianca.escola,
                              ano: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <p className='font-medium'>Entidade responsável</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label htmlFor='nome_responsavel' className='w-full'>
                      Nome da entidade
                      <input
                        type='text'
                        id='nome_responsavel'
                        {...register('residencia_atual')}
                        className='input'
                        value={
                          crianca?.entidade_responsavel_crianca
                            ?.nome_responsavel || ''
                        }
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            entidade_responsavel_crianca: {
                              ...prevCrianca.entidade_responsavel_crianca,
                              nome_responsavel: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='telefone_entidade' className='w-full'>
                      Telefone
                      <input
                        type='number'
                        id='telefone_entidade'
                        {...register('telefone_entidade')}
                        className='input'
                        value={crianca?.entidade_responsavel_crianca?.telefone}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            entidade_responsavel_crianca: {
                              ...prevCrianca.entidade_responsavel_crianca,
                              telefone: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label htmlFor='telemovel_entidade' className='w-full'>
                      Telemóvel
                      <input
                        type='number'
                        id='telemovel_entidade'
                        {...register('telemovel_entidade')}
                        className='input'
                        value={crianca?.entidade_responsavel_crianca?.telemovel}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            entidade_responsavel_crianca: {
                              ...prevCrianca.entidade_responsavel_crianca,
                              telemovel: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='email' className='w-full'>
                      Email
                      <input
                        type='email_entidade'
                        id='email_entidade'
                        {...register('email_entidade')}
                        className='input'
                        value={crianca?.entidade_responsavel_crianca?.email}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            entidade_responsavel_crianca: {
                              ...prevCrianca.entidade_responsavel_crianca,
                              email: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <p className='font-medium'>Antecedentes da criança</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label htmlFor='justica_juvenil' className='w-full'>
                      Justiça juvenil
                      <select
                        id='justica_juvenil'
                        {...register('justica_juvenil')}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        defaultValue={
                          crianca?.antecedentes_crianca?.justica_juvenil || ''
                        }
                        onChange={(e) => {
                          setValue('justica_juvenil', e.target.value);
                          setCrianca({
                            ...crianca,
                            justica_juvenil: e.target.value,
                          });
                        }}
                      >
                        <option value='true'>Sim</option>
                        <option value='false'>Não</option>
                      </select>
                    </label>
                    <label htmlFor='acto_licito' className='w-full'>
                      Acto lícito
                      <input
                        type='text'
                        id='acto_licito'
                        {...register('acto_licito')}
                        className='input'
                        value={crianca?.antecedentes_crianca?.acto_licito}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            antecedentes_crianca: {
                              ...prevCrianca.antecedentes_crianca,
                              acto_licito: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label
                      htmlFor='instituicao_justica_juvenil'
                      className='w-full'
                    >
                      Instituição juvenil
                      <input
                        type='text'
                        id='instituicao_justica_juvenil'
                        {...register('instituicao_justica_juvenil')}
                        className='input'
                        value={
                          crianca?.antecedentes_crianca
                            ?.instituicao_justica_juvenil
                        }
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            antecedentes_crianca: {
                              ...prevCrianca.antecedentes_crianca,
                              instituicao_justica_juvenil: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='motivo_saida' className='w-full'>
                      Motivo saída
                      <input
                        type='text'
                        id='motivo_saida'
                        {...register('motivo_saida')}
                        className='input'
                        value={crianca?.motivo_saida?.descricao}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            motivo_saida: {
                              ...prevCrianca.motivo_saida,
                              descricao: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <p className='font-medium'>Acompanhamento técnico</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label htmlFor='frequencia_escolar' className='w-full'>
                      Frequência escolar
                      <input
                        type='number'
                        id='frequencia_escolar'
                        {...register('frequencia_escolar')}
                        className='input'
                        value={
                          crianca?.acompanhamento_tecnico?.frequencia_escolar ||
                          0
                        }
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            acompanhamento_tecnico: {
                              ...prevCrianca.acompanhamento_tecnico,
                              frequencia_escolar: parseInt(e.target.value, 10), // Converte para número inteiro
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='curso_tecnico' className='w-full'>
                      Curso técnico
                      <input
                        type='text'
                        id='curso_tecnico'
                        {...register('curso_tecnico')}
                        className='input'
                        value={crianca?.acompanhamento_tecnico?.curso_tecnico}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            acompanhamento_tecnico: {
                              ...prevCrianca.acompanhamento_tecnico,
                              curso_tecnico: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label
                      htmlFor='acompanhamento_psicologico'
                      className='w-full'
                    >
                      Acompanhamento psicológico
                      <select
                        id='acompanhamento_psicologico'
                        {...register('acompanhamento_psicologico')}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        defaultValue={
                          crianca?.acompanhamento_tecnico
                            ?.acompanhamento_psicologico || ''
                        }
                        onChange={(e) => {
                          setValue(
                            'acompanhamento_psicologico',
                            e.target.value
                          );
                          setCrianca({
                            ...crianca,
                            acompanhamento_psicologico: e.target.value,
                          });
                        }}
                      >
                        <option value='true'>Sim</option>
                        <option value='false'>Não</option>
                      </select>
                    </label>
                    <label htmlFor='comportamento_positivo' className='w-full'>
                      Comportamento positivo
                      <select
                        id='comportamento_positivo'
                        {...register('comportamento_positivo')}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        defaultValue={
                          crianca?.acompanhamento_tecnico
                            ?.comportamento_positivo || ''
                        }
                        onChange={(e) => {
                          setValue('comportamento_positivo', e.target.value);
                          setCrianca({
                            ...crianca,
                            comportamento_positivo: e.target.value,
                          });
                        }}
                      >
                        <option value='true'>Sim</option>
                        <option value='false'>Não</option>
                      </select>
                    </label>
                    <label htmlFor='acompanhamento_medico' className='w-full'>
                      Acompanhamento médico
                      <select
                        id='acompanhamento_medico'
                        {...register('acompanhamento_medico')}
                        className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
                        defaultValue={
                          crianca?.acompanhamento_tecnico
                            ?.acompanhamento_medico || ''
                        }
                        onChange={(e) => {
                          setValue('acompanhamento_medico', e.target.value);
                          setCrianca({
                            ...crianca,
                            acompanhamento_medico: e.target.value,
                          });
                        }}
                      >
                        <option value='true'>Sim</option>
                        <option value='false'>Não</option>
                      </select>
                    </label>
                    <label htmlFor='estado_tecnico' className='w-full'>
                      Estado
                      <input
                        type='text'
                        id='estado_tecnico'
                        {...register('estado_tecnico')}
                        className='input'
                        value={crianca?.acompanhamento_tecnico?.estado}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            acompanhamento_tecnico: {
                              ...prevCrianca.acompanhamento_tecnico,
                              estado: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='nome_tecnico' className='w-full'>
                      Nome técnico
                      <input
                        type='text'
                        id='nome_tecnico'
                        {...register('nome_tecnico')}
                        className='input'
                        value={crianca?.acompanhamento_tecnico?.nome_tecnico}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            acompanhamento_tecnico: {
                              ...prevCrianca.acompanhamento_tecnico,
                              nome_tecnico: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='telefone_tecnico' className='w-full'>
                      Telefone
                      <input
                        type='number'
                        id='telefone_tecnico'
                        {...register('telefone_tecnico')}
                        className='input'
                        value={crianca?.acompanhamento_tecnico?.telefone}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            acompanhamento_tecnico: {
                              ...prevCrianca.acompanhamento_tecnico,
                              telefone: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='telemovel_tecnico' className='w-full'>
                      Telemóvel
                      <input
                        type='number'
                        id='telemovel_tecnico'
                        {...register('telemovel_tecnico')}
                        className='input'
                        value={crianca?.acompanhamento_tecnico?.telemovel}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            acompanhamento_tecnico: {
                              ...prevCrianca.acompanhamento_tecnico,
                              telemovel: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label htmlFor='email_tecnico' className='w-full'>
                      Email
                      <input
                        type='email'
                        id='email_tecnico'
                        {...register('email_tecnico')}
                        className='input'
                        value={crianca?.acompanhamento_tecnico?.email}
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            acompanhamento_tecnico: {
                              ...prevCrianca.acompanhamento_tecnico,
                              email: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <p className='font-medium'>Processo reunificação</p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <label htmlFor='processo_anterior' className='w-full'>
                      Processo anterior
                      <input
                        type='text'
                        id='processo_anterior'
                        {...register('processo_anterior')}
                        className='input'
                        value={
                          crianca?.processo_reunificacao?.processo_anterior
                        }
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            processo_reunificacao: {
                              ...prevCrianca.processo_reunificacao,
                              processo_anterior: e.target.value,
                            },
                          }))
                        }
                      />
                    </label>
                    <label
                      htmlFor='descricao_processo_anterior'
                      className='w-full'
                    >
                      Descrição do processo anterior
                      <textarea
                        rows={3}
                        id='descricao_processo_anterior'
                        {...register('descricao_processo_anterior')}
                        className='input'
                        value={
                          crianca?.processo_reunificacao
                            ?.descricao_processo_anterior
                        }
                        onChange={(e) =>
                          setCrianca((prevCrianca) => ({
                            ...prevCrianca,
                            processo_reunificacao: {
                              ...prevCrianca.processo_reunificacao,
                              descricao_processo_anterior: e.target.value,
                            },
                          }))
                        }
                      ></textarea>
                    </label>
                  </div>
                </article>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>

          <button
            disabled={isSubmitting}
            className='button w-96 mx-auto'
            type='submit'
          >
            {isSubmitting ? (
              <LoaderCircle className='w-6 h-6 text-green-300 animate-spin text-center' />
            ) : (
              'Atuactizar'
            )}
          </button>
        </form>
      </article>
    </section>
  );
}
