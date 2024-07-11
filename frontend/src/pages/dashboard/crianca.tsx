/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { GlobalContext } from '@/context/global-context';
import useDocumentTitle from '@/utils/use-title';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as Avatar from '@radix-ui/react-avatar';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CriancaDocument from '@/components/pdf/crianca';
import { CriancaTypes } from '@/utils/types';
import Cookies from 'js-cookie';

export default function Crianca() {
  useDocumentTitle('Criança');
  const { id } = useParams();
  const [crianca, setCrianca] = useState<CriancaTypes>([]);
  const [parentes, setParentes] = useState({
    pai: '',
    mae: '',
  });

  const { obterIniciais, formatarNomeCompleto } = useContext(GlobalContext);
  const picture = `${import.meta.env.VITE_API}/uploads/${crianca?.imagem}`;
  const token = Cookies.get('token');

  useEffect(() => {
    const url = `${import.meta.env.VITE_API}/api/criancas/${id}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((criancas) => setCrianca(criancas));
  }, [id]);

  useEffect(() => {
    if (crianca && crianca.filiacao) {
      const partes = crianca.filiacao.split(',');
      if (partes.length >= 2) {
        const parent1 = partes[0].trim() || '';
        const parent2 = partes[1].trim() || '';
        setParentes({
          pai: parent1,
          mae: parent2,
        });
      }
    }
  }, [crianca, crianca.filiacao]);

  function dataNascimento(dataNascimento: string) {
    const data = new Date(dataNascimento).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return data;
  }

  const nome = formatarNomeCompleto(crianca.nome_completo);

  return (
    <section className='flex flex-col max-w-5xl mx-auto gap-4 shadow-md bg-white p-4 rounded-lg'>
      {/* HEADER */}
      <article className='flex justify-end gap-3 border-b-2 border-green-500 pb-4'>
        <Link
          className='font-semibold text-base flex items-center justify-center text-center rounded bg-gray-800 hover:bg-black text-white px-4 py-3 transition-colors disabled:bg-gray-700 disabled:text-gray-300 disabled:cursor-wait'
          to={`/criancas/edit/${id}`}
        >
          Editar
        </Link>
        <PDFDownloadLink
          document={
            <CriancaDocument
              crianca={crianca}
              dataNascimento={dataNascimento}
              picture={picture}
            />
          }
          fileName={`Criança INAC - ${nome}.pdf`}
        >
          {({ loading }: { loading: boolean }) => (
            <button
              disabled={loading}
              className='button disabled:cursor-not-allowed disabled:select-none'
            >
              {loading ? 'Gerando...' : 'Exportar'}
            </button>
          )}
        </PDFDownloadLink>
      </article>
      {/* HEAD */}
      <article className='flex flex-col lg:flex-row gap-2 lg:gap-20 p-4 lg:py-2 lg:px-16 bg-green-500 text-white rounded-lg justify-center items-center lg:justify-start'>
        <Avatar.Root className='inline-flex w-44 h-44 lg:h-56 lg:w-56 select-none items-center justify-center overflow-hidden rounded-full border-2 border-white align-middle'>
          <Avatar.Image
            className='h-full w-full rounded-[inherit] object-cover'
            src={picture}
            alt={crianca.nome_completo}
          />
          <Avatar.Fallback
            className='text-green-500 leading-1 flex h-full w-full items-center justify-center bg-slate-200 text-5xl font-medium'
            delayMs={600}
          >
            {obterIniciais(crianca.nome_completo)}
          </Avatar.Fallback>
        </Avatar.Root>

        <div className='flex flex-col justify-center text-base lg:text-xl text-center lg:text-left font-semibold lg:font-medium gap-2 '>
          <h2 className='text-2xl lg:text-3xl font-semibold'>
            {crianca.nome_completo}
          </h2>
          <p>Nacionalidade: {crianca.nacionalidade}</p>
          <p>Data de nascimento: {dataNascimento(crianca.data_nascimento)}</p>
          <p>Sexo: {crianca.sexo}</p>
        </div>
      </article>
      {/* CONTENT */}
      <section className='grid grid-cols-1 items-start gap-5 px-6 py-4'>
        {/* KID INFO */}
        <article className='text-black text-lg flex flex-col gap-3 border-b-2 pb-3 border-green-500'>
          <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
            Informação
          </h3>
          <div className='flex flex-col gap-2'>
            {crianca.filiacao && (
              <>
                {<p>{parentes.pai ? parentes.pai : 'Pai:'}</p>}
                {<p>{parentes.mae ? parentes.mae : 'Mãe:'}</p>}
              </>
            )}
            <p>Naturalidade: {crianca.naturalidade}</p>
            <p>Província: {crianca.provincia}</p>
            <p>Municipio: {crianca.municipio}</p>
            <p>Estado: {crianca.estado}</p>
          </div>
          <div className='flex flex-col gap-2'>
            <p>Distrito: {crianca.distrito}</p>
            <p>Zona em que vivia: {crianca.zona_vivia}</p>
            <p>Data de entrada: {dataNascimento(crianca.data_entrada)}</p>
            <p>Data de actualização: {dataNascimento(crianca.data_atualizacao)}</p>
            <p>Ponto de referência: {crianca.ponto_referencia}</p>
          </div>
        </article>
        {/* FAMILIA LOCALIZADA */}
        <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
              Familia localizada
            </h3>
            {crianca?.contacto_familiar ? (
              <>
                <p>
                  Residência actual:{' '}
                  {crianca?.contacto_familiar?.residencia_atual}
                </p>
                <p>
                  Frequência contacto anual:{' '}
                  {crianca?.contacto_familiar?.frequencia_contacto_anual}
                </p>
                <p>
                  Pessoa que vivia com a crianca:{' '}
                  {crianca?.contacto_familiar?.pessoa_vivia_crianca}
                </p>
                <p>
                  Irmãos biológicos :{' '}
                  {crianca?.contacto_familiar?.irmaos_biologicos
                    ? 'Sim'
                    : 'Não'}
                </p>
                <p>Quanto tempo: {crianca?.contacto_familiar?.quanto_tempo}</p>
                <p>Onde esteve: {crianca?.contacto_familiar?.onde_esteve}</p>
                <p>Telefone: {crianca?.contacto_familiar?.telefone}</p>
                <p>Email: {crianca?.contacto_familiar?.email}</p>
              </>
            ) : (
              <p>Nenhum familiar localizado</p>
            )}
          </div>
        </article>
        {/* EDUCACAO */}
        <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
              Educação
            </h3>
            {crianca?.escola ? (
              <>
                <p>Escola: {crianca?.escola?.escola}</p>
                <p>Classe: {crianca?.escola?.classe}</p>
                <p>Ano: {crianca?.escola?.ano}</p>
              </>
            ) : (
              <p>Sem dados escolar</p>
            )}
          </div>
        </article>
        {/* ENTIDADE RESPONSAVEL */}
        <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
              Entidade responsável
            </h3>
            {crianca?.entidade_responsavel_crianca ? (
              <>
                <p>
                  Nome:{' '}
                  {crianca?.entidade_responsavel_crianca?.nome_responsavel}
                </p>
                <p>
                  Telefone: {crianca?.entidade_responsavel_crianca?.telefone}
                </p>
                <p>
                  Telemovel: {crianca?.entidade_responsavel_crianca?.telemovel}
                </p>
                <p>Email: {crianca?.entidade_responsavel_crianca?.email}</p>
              </>
            ) : (
              <p>Nenhuma entidade responsável</p>
            )}
          </div>
        </article>
        {/* ANTECEDENTES */}
        <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
              Antecedentes da criança
            </h3>
            {crianca?.antecedentes_crianca?.justica_juvenil ? (
              <>
                <p>Acto licito: {crianca?.antecedentes_crianca?.acto_licito}</p>
                <p>
                  Instituicao de justiça juvenil:{' '}
                  {crianca?.antecedentes_crianca?.instituicao_justica_juvenil}
                </p>
              </>
            ) : (
              <p>Nenhum antecedente</p>
            )}
          </div>
        </article>
        {/* CARACTERISTICAS */}
        <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-xl lg:text-2xl uppercase font-semibold'>
              Caracteristicas
            </h2>
            {crianca &&
            crianca.caracteristicas &&
            crianca.caracteristicas.length > 0 ? (
              <ul>
                {crianca.caracteristicas.map(
                  ({
                    descricao,
                    vestuario,
                  }: {
                    descricao: string;
                    vestuario: string;
                  }) => (
                    <div className='space-y-2' key={descricao + 1}>
                      <p>Descrição: {descricao}</p>
                      <p>Vestuário: {vestuario}</p>
                    </div>
                  )
                )}
              </ul>
            ) : (
              <p>Nenhuma característica encontrada.</p>
            )}
          </div>
        </article>
        {/* ACOMPANHAMENTO TECNICO */}
        <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
              Acompanhamento técnico
            </h3>
            {crianca?.acompanhamento_tecnico ? (
              <>
                <p>
                  Frequência escolar:{' '}
                  {crianca?.acompanhamento_tecnico?.frequencia_escolar}
                </p>
                <p>
                  Curso técnico:{' '}
                  {crianca?.acompanhamento_tecnico?.curso_tecnico}
                </p>
                <p>
                  Acompanhamento psicológico:{' '}
                  {crianca?.acompanhamento_tecnico?.acompanhamento_psicologico
                    ? 'Sim'
                    : 'Não'}
                </p>
                <p>
                  Comportamento positivo:{' '}
                  {crianca?.acompanhamento_tecnico?.comportamento_positivo
                    ? 'Sim'
                    : 'Não'}
                </p>
                <p>
                  Acompanhamento médico:{' '}
                  {crianca?.acompanhamento_tecnico?.acompanhamento_medico
                    ? 'Sim'
                    : 'Não'}
                </p>
                <p>Estado: {crianca?.acompanhamento_tecnico?.estado}</p>
                <p>
                  Nome técnico: {crianca?.acompanhamento_tecnico?.nome_tecnico}
                </p>
                <p>Telefone: {crianca?.acompanhamento_tecnico?.telefone}</p>
                <p>Telemovel: {crianca?.acompanhamento_tecnico?.telemovel}</p>
                <p>Email: {crianca?.acompanhamento_tecnico?.email}</p>
              </>
            ) : (
              <p>Nenhum acompanhamento técnico</p>
            )}
          </div>
        </article>
        {/* MOTIVO DA SAIDA */}
        {crianca?.motivo_saida && (
          <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
            <div className='flex flex-col gap-1'>
              <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
                Motivo saída
              </h3>
              <p className='text-justify'>
                Descrição: {crianca?.motivo_saida?.descricao}
              </p>
            </div>
          </article>
        )}
        {/* PROCESSO DE REUNIFICACAO */}
        <article className='text-black text-lg flex border-b-2 pb-3 border-green-500'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-xl lg:text-2xl uppercase font-semibold'>
              Processo reunificação
            </h3>
            {crianca?.processo_reunificacao ? (
              <>
                <p>
                  Processo anterior:{' '}
                  {crianca?.processo_reunificacao?.processo_anterior}
                </p>
                <p>
                  Descrição do processo anterior:{' '}
                  {crianca?.processo_reunificacao?.descricao_processo_anterior}
                </p>
              </>
            ) : (
              <p>Nenhum antecedente</p>
            )}
          </div>
        </article>
      </section>
    </section>
  );
  // PDF TEST VIEWER
  // return (
  //   <PDFViewer className='w-full h-full'>
  //     <CriancaDocument
  //       crianca={crianca}
  //       dataNascimento={dataNascimento}
  //       picture={picture}
  //       parentes={parentes}
  //     />
  //   </PDFViewer>
  // );
}
