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

export default function CadastrarCrianca() {
  useDocumentTitle('Cadastrar criança');
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    // resolver: zodResolver(criancaFormSchema),
  });

  const { allCriancas, allCriancasByProvince } = useContext(GlobalContext);

  const [preview, setPreview] = useState({
    name: '',
    src: '/placeholder.jpeg',
  });

  const [selectedProvincia, setSelectedProvincia] = useState('Luanda');
  const [municipios, setMunicipios] = useState(
    municipiosPorProvincia[selectedProvincia]
  );
  const [selectedMunicipio, setSelectedMunicipio] = useState(
    municipios[0] || ''
  );

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview({ name: file.name, src: URL.createObjectURL(file) });
    }
  };

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
      const token = Cookies.get('token');
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
        // data_entrada: data.data_nascimento,
        // data_atualizacao: data.data_atualizacao,
        caracteristicas: [
          {
            descricao: data.descricao,
            vestuario: data.vestuario,
          },
        ],
        contacto_familiar: {
          familia_localizada: data.familia_localizada,
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

      const response = await fetch(`${import.meta.env.VITE_API}/api/criancas`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Erro no cadastro');
      await response.json();
      allCriancas();
      allCriancasByProvince();
      Toast('Cadastro feito com sucesso', 'success', 'top-right');
      reset();
    } catch (error) {
      Toast('Houve um erro ao cadastrar criança', 'error', 'top-right');
      console.error('Houve um erro ao cadastrar criança', error);
    }
  }

  return (
    <section className='space-y-5'>
      <article className='space-y-1 leading-relaxed border-b pb-4 border-gray-300'>
        <h1 className='text-2xl font-medium text-black'>Cadastrar criança</h1>
        <p className='text-gray-500'>
          Certifique-se de preencher todos os campos.
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
                <PersonalData
                  register={register}
                  preview={preview}
                  handleImageChange={handleImageChange}
                  municipios={municipios}
                  setMunicipios={setMunicipios}
                  setValue={setValue}
                  selectedProvincia={selectedProvincia}
                  selectedMunicipio={selectedMunicipio}
                  setSelectedProvincia={setSelectedProvincia}
                  setSelectedMunicipio={setSelectedMunicipio}
                  errors={errors}
                  dataMaxima={dataMaxima}
                  dataMinima={dataMinima}
                />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Trigger className='flex gap-2 group items-center justify-center text-lg font-medium text-green-500 mb-2'>
                Informações Adicionais{' '}
                <ChevronDown className='w-5 h-5 group-data-[state=open]:rotate-180' />
              </Accordion.Trigger>
              <Accordion.Content>
                <AdditionalData register={register} />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Trigger className='flex gap-2 group items-center justify-center text-lg font-medium text-green-500 mb-2'>
                Histórico da Criança
                <ChevronDown className='w-5 h-5 group-data-[state=open]:rotate-180' />
              </Accordion.Trigger>
              <Accordion.Content>
                <HistoryData register={register} />
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
              'Cadastrar'
            )}
          </button>
        </form>
      </article>
    </section>
  );
}

const PersonalData = ({
  register,
  preview,
  handleImageChange,
  municipios,
  setMunicipios,
  setValue,
  selectedProvincia,
  selectedMunicipio,
  setSelectedProvincia,
  setSelectedMunicipio,
  errors,
  dataMaxima,
  dataMinima,
}: DataProps) => {
  return (
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
          />
        </label>
        <label htmlFor='sexo' className='w-full'>
          Sexo
          <select
            id='sexo'
            {...register('sexo')}
            className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
          >
            <option value='Masculino'>Masculino</option>
            <option value='Feminino'>Feminino</option>
          </select>
        </label>

        <label htmlFor='pai' className='w-full'>
          Pai
          <input type='text' id='pai' {...register('pai')} className='input' />
        </label>
        <label htmlFor='mae' className='w-full'>
          Mãe
          <input type='text' id='mae' {...register('mae')} className='input' />
        </label>
        <label htmlFor='estado' className='w-full'>
          Estado
          <input
            type='text'
            id='estado'
            {...register('estado')}
            className='input'
          />
        </label>

        <label htmlFor='provincia' className='w-full'>
          Província
          <select
            id='provincia'
            {...register('provincia')}
            className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
            value={selectedProvincia}
            onChange={(e) => {
              const provinciaSelecionada = e.target.value;
              setSelectedProvincia(provinciaSelecionada);
              setValue('provincia', provinciaSelecionada);
              setMunicipios(municipiosPorProvincia[provinciaSelecionada] || []);
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
            value={selectedMunicipio}
            onChange={(e) => {
              setSelectedMunicipio(e.target.value);
              setValue('municipio', e.target.value);
            }}
          >
            {municipios.map((municipio) => (
              <option value={municipio} key={municipio._id}>
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
            defaultValue='Angolana'
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
          />
        </label>

        <label htmlFor='bairro' className='w-full'>
          Bairro
          <input
            type='text'
            id='bairro'
            {...register('bairro')}
            className='input'
          />
        </label>
        <label htmlFor='naturalidade' className='w-full'>
          Naturalidade
          <input
            type='text'
            id='naturalidade'
            {...register('naturalidade')}
            className='input'
          />
        </label>

        <label htmlFor='zona_vivia' className='w-full'>
          Zona vivia
          <input
            type='text'
            id='zona_vivia'
            {...register('zona_vivia')}
            className='input'
          />
        </label>

        <label htmlFor='ponto_referencia' className='w-full'>
          Ponto referência
          <input
            type='text'
            id='ponto_referencia'
            {...register('ponto_referencia')}
            className='input'
          />
        </label>
        <label htmlFor='data_nascimento' className='w-full'>
          Data de nascimento
          <input
            type='date'
            id='data_nascimento'
            {...register('data_nascimento')}
            className='input'
            min={dataMinima}
            max={dataMaxima}
          />
        </label>
      </div>
    </article>
  );
};

const AdditionalData = ({ register }: DataProps) => {
  return (
    <article className='space-y-3'>
      {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <label htmlFor='data_entrada' className='w-full'>
          Data de entrada
          <input
            type='date'
            id='data_entrada'
            {...register('data_entrada')}
            className='input'
          />
        </label>
        <label htmlFor='data_atualizacao' className='w-full'>
          Data atualização
          <input
            type='date'
            id='data_atualizacao'
            {...register('data_atualizacao')}
            className='input'
          />
        </label>
      </div> */}

      <p className='font-medium'>Caracteristicas</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <label htmlFor='descricao' className='w-full'>
          Descrição
          <textarea
            rows={3}
            id='descricao'
            {...register('descricao')}
            className='input'
          ></textarea>
        </label>
        <label htmlFor='vestuario' className='w-full'>
          Vestuario
          <textarea
            rows={3}
            id='vestuario'
            {...register('vestuario')}
            className='input'
          ></textarea>
        </label>
      </div>

      <p className='font-medium'>Contacto familiar</p>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <label htmlFor='residencia_atual' className='w-full'>
          Residência atual
          <input
            type='text'
            id='residencia_atual'
            {...register('residencia_atual')}
            className='input'
          />
        </label>
        <label htmlFor='frequencia_contacto_anual' className='w-full'>
          Frequência de contacto anual
          <input
            type='number'
            id='frequencia_contacto_anual'
            {...register('frequencia_contacto_anual')}
            className='input'
          />
        </label>
        <label htmlFor='pessoa_vivia_crianca' className='w-full'>
          Pessoa que vivia com a criança
          <input
            type='text'
            id='pessoa_vivia_crianca'
            {...register('pessoa_vivia_crianca')}
            className='input'
          />
        </label>
        <label htmlFor='irmaos_biologicos' className='w-full'>
          Irmãos biológicos
          <select
            id='irmaos_biologicos'
            {...register('irmaos_biologicos')}
            className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
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
          />
        </label>
        <label htmlFor='onde_esteve' className='w-full'>
          Onde esteve
          <input
            type='text'
            id='onde_esteve'
            {...register('onde_esteve')}
            className='input'
          />
        </label>

        <label htmlFor='telefone_familiar' className='w-full'>
          Telefone
          <input
            type='number'
            id='telefone_familiar'
            {...register('telefone_familiar')}
            className='input'
          />
        </label>
        <label htmlFor='email_familiar' className='w-full'>
          Email
          <input
            type='email_familiar'
            id='email_familiar'
            {...register('email_familiar')}
            className='input'
          />
        </label>
      </div>
    </article>
  );
};

const HistoryData = ({ register }: DataProps) => {
  return (
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
          />
        </label>
        <label htmlFor='classe'>
          Classe
          <select
            id='classe'
            name='classe'
            {...register('classe')}
            className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
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
          />
        </label>
        <label htmlFor='telefone_entidade' className='w-full'>
          Telefone
          <input
            type='number'
            id='telefone_entidade'
            {...register('telefone_entidade')}
            className='input'
          />
        </label>

        <label htmlFor='telemovel_entidade' className='w-full'>
          Telemóvel
          <input
            type='number'
            id='telemovel_entidade'
            {...register('telemovel_entidade')}
            className='input'
          />
        </label>
        <label htmlFor='email' className='w-full'>
          Email
          <input
            type='email_entidade'
            id='email_entidade'
            {...register('email_entidade')}
            className='input'
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
          />
        </label>

        <label htmlFor='instituicao_justica_juvenil' className='w-full'>
          Instituição juvenil
          <input
            type='text'
            id='instituicao_justica_juvenil'
            {...register('instituicao_justica_juvenil')}
            className='input'
          />
        </label>
        <label htmlFor='motivo_saida' className='w-full'>
          Motivo saída
          <input
            type='text'
            id='motivo_saida'
            {...register('motivo_saida')}
            className='input'
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
          />
        </label>
        <label htmlFor='curso_tecnico' className='w-full'>
          Curso técnico
          <input
            type='text'
            id='curso_tecnico'
            {...register('curso_tecnico')}
            className='input'
          />
        </label>

        <label htmlFor='acompanhamento_psicologico' className='w-full'>
          Acompanhamento psicológico
          <select
            id='acompanhamento_psicologico'
            {...register('acompanhamento_psicologico')}
            className='w-full outline-none rounded accent-green-500 focus:accent-green-600 focus:border-green-500'
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
          />
        </label>
        <label htmlFor='nome_tecnico' className='w-full'>
          Nome técnico
          <input
            type='text'
            id='nome_tecnico'
            {...register('nome_tecnico')}
            className='input'
          />
        </label>

        <label htmlFor='telefone_tecnico' className='w-full'>
          Telefone
          <input
            type='number'
            id='telefone_tecnico'
            {...register('telefone_tecnico')}
            className='input'
          />
        </label>
        <label htmlFor='telemovel_tecnico' className='w-full'>
          Telemóvel
          <input
            type='number'
            id='telemovel_tecnico'
            {...register('telemovel_tecnico')}
            className='input'
          />
        </label>
        <label htmlFor='email_tecnico' className='w-full'>
          Email
          <input
            type='email'
            id='email_tecnico'
            {...register('email_tecnico')}
            className='input'
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
          />
        </label>
        <label htmlFor='descricao_processo_anterior' className='w-full'>
          Descrição do processo anterior
          <textarea
            rows={3}
            id='descricao_processo_anterior'
            {...register('descricao_processo_anterior')}
            className='input'
          ></textarea>
        </label>
      </div>
    </article>
  );
};
