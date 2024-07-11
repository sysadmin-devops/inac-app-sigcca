import { Page, Text, View, Document, Image, Font } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import { CriancaTypes } from '@/utils/types';

const tw = createTw({
  theme: {},
  extend: {
    colors: {
      green: {
        50: '#EDF9DD',
        100: '#D2F0A8',
        200: '#BEE981',
        300: '#AEE463',
        400: '#9ADD3C',
        500: '#8FD926',
        600: '#71A824',
        700: '#557E1B',
        800: '#3B5813',
        900: '#223409',
      },
    },
  },
});

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: `/fonts/RobotoRegular.ttf`,
      fontWeight: 'normal',
    },
    {
      src: `/fonts/RobotoMedium.ttf`,
      fontWeight: 'medium',
    },
    {
      src: `/fonts/RobotoBold.ttf`,
      fontWeight: 'bold',
    },
  ],
});

interface CriancaDocumentProps {
  crianca: CriancaTypes;
  dataNascimento: (arg0: string) => string;
  picture: string;
  parentes: { pai: string; mae: string };
}

export default function CriancaDocument({
  crianca,
  dataNascimento,
}: CriancaDocumentProps) {
  return (
    <Document>
      <Page
        size='A4'
        style={{ fontFamily: 'Roboto', fontWeight: 'normal', fontSize: '13px' }}
        wrap
      >
        <View>
          {/* HEADER */}
          <View
            style={tw(
              'flex flex-row items-center justify-between px-12 gap-3 py-4'
            )}
          >
            <Image src='/logo.png' style={tw('w-28')} />
            <Text
              style={{
                color: '#8FD926',
                paddingTop: '-6px',
                fontSize: '26px',
                fontWeight: 'bold',
              }}
            >
              PORTAL DA CRIANÇA
            </Text>
          </View>
          {/* HEAD */}
          <View
            style={tw(
              'flex flex-row gap-5 py-3 px-16 bg-[#8FD926] text-white justify-start'
            )}
          >
            <Image
              style={tw(
                'w-56 h-56 rounded-full object-cover border-2 border-white'
              )}
              src={`${crianca.imagemBase64}`}
            />

            <View
              style={tw(
                'flex flex-col justify-center text-lg font-medium gap-2'
              )}
            >
              <Text style={tw('font-medium text-2xl -mb-3.5')}>
                {crianca.nome_completo}
              </Text>
              <Text>Nacionalidade: {crianca.nacionalidade}</Text>
              <Text>
                Data de nascimento: {dataNascimento(crianca.data_nascimento)}
              </Text>
              <Text>Sexo: {crianca.sexo}</Text>
            </View>
          </View>

          {/* CONTENT 1 */}
          <View style={tw('pt-6 px-20 flex flex-col justify-start gap-10')}>
            <View style={tw('flex flex-col gap-4')}>
              {/* KID INFO */}
              <View style={tw('text-black flex flex-col gap-3')}>
                <Text style={tw('text-xl uppercase font-semibold')}>
                  Informação
                </Text>
                <View style={tw('flex flex-col gap-2')}>
                  {/* {crianca.filiacao && (
                    <>
                      {<p>{parentes.pai ? parentes.pai : 'Pai:'}</p>}
                      {<p>{parentes.mae ? parentes.mae : 'Mãe:'}</p>}
                    </>
                  )} */}
                  <Text>Filiação: {crianca.filiacao}</Text>
                  <Text>Naturalidade: {crianca.naturalidade}</Text>
                  <Text>Província: {crianca.provincia}</Text>
                  <Text>Municipio: {crianca.municipio}</Text>
                  <Text>Estado: {crianca.estado}</Text>
                </View>
                <View style={tw('flex flex-col gap-2')}>
                  <Text>Distrito: {crianca.distrito}</Text>
                  <Text>Zona em que vivia: {crianca.zona_vivia}</Text>
                  <Text>
                    Data de entrada: {dataNascimento(crianca.data_entrada)}
                  </Text>
                  <Text>Ponto de referência: {crianca.ponto_referencia}</Text>
                </View>
              </View>
              {/* FAMILIA LOCALIZADA */}
              <View style={tw('text-black flex')}>
                <View style={tw('flex flex-col gap-1')}>
                  <Text style={tw('text-xl uppercase font-semibold')}>
                    Familia localizada
                  </Text>
                  {crianca?.contacto_familiar?.familia_localizada ? (
                    <>
                      <Text>
                        Residência actual:{' '}
                        {crianca?.contacto_familiar?.residencia_atual}
                      </Text>
                      <Text>
                        Frequência contacto anual:{' '}
                        {crianca?.contacto_familiar?.frequencia_contacto_anual}
                      </Text>
                      <Text>
                        Pessoa que vivia com a crianca:{' '}
                        {crianca?.contacto_familiar?.pessoa_vivia_crianca}
                      </Text>
                      <Text>
                        Irmãos biológicos :{' '}
                        {crianca?.contacto_familiar?.irmaos_biologicos
                          ? 'Sim'
                          : 'Não'}
                      </Text>
                      <Text>
                        Quanto tempo: {crianca?.contacto_familiar?.quanto_tempo}
                      </Text>
                      <Text>
                        Onde esteve: {crianca?.contacto_familiar?.onde_esteve}
                      </Text>
                      <Text>
                        Telefone: {crianca?.contacto_familiar?.telefone}
                      </Text>
                      <Text>Email: {crianca?.contacto_familiar?.email}</Text>
                    </>
                  ) : (
                    <Text>Nenhum familiar localizado</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={tw('flex flex-col gap-4 pt-6 px-20')} break>
          {/* CARACTERISTICAS */}
          <View style={tw('text-black flex')}>
            <View style={tw('flex flex-col gap-2')}>
              <Text style={tw('text-xl uppercase font-semibold')}>
                Caracteristicas
              </Text>
              {crianca?.caracteristicas ? (
                <View>
                  <Text>Descrição: {crianca?.caracteristicas?.descricao}</Text>
                  <Text>Vestuário: {crianca?.caracteristicas?.vestuario}</Text>
                </View>
              ) : (
                <Text>Nenhuma característica encontrada.</Text>
              )}
            </View>
          </View>
          {/* ENTIDADE RESPONSAVEL 2*/}
          <View style={tw('text-black flex')}>
            <View style={tw('flex flex-col gap-1')}>
              <Text style={tw('text-xl uppercase font-semibold')}>
                Entidade responsável
              </Text>
              {crianca?.entidade_responsavel_crianca ? (
                <>
                  <Text>
                    Nome:{' '}
                    {crianca?.entidade_responsavel_crianca.nome_responsavel}
                  </Text>
                  <Text>
                    Telefone: {crianca?.entidade_responsavel_crianca.telefone}
                  </Text>
                  <Text>
                    Telemovel: {crianca?.entidade_responsavel_crianca.telemovel}
                  </Text>
                  <Text>
                    Email: {crianca?.entidade_responsavel_crianca.email}
                  </Text>
                </>
              ) : (
                <Text>Nenhuma entidade responsável</Text>
              )}
            </View>
          </View>
          {/* EDUCACAO */}
          <View style={tw('text-black flex')}>
            <View style={tw('flex flex-col gap-1')}>
              <Text style={tw('text-xl uppercase font-semibold')}>
                Educação
              </Text>
              {crianca?.escola ? (
                <>
                  <Text>Escola: {crianca?.escola?.escola}</Text>
                  <Text>Classe: {crianca?.escola?.classe}</Text>
                  <Text>Ano: {crianca?.escola?.ano}</Text>
                </>
              ) : (
                <Text>Sem dados escolar</Text>
              )}
            </View>
          </View>
        </View>
        {/* Column 3 */}
        <View style={tw('flex flex-col gap-4 pt-6 px-20')}>
          {/* ACOMPANHAMENTO TECNICO */}
          <View style={tw('text-black flex')}>
            <View style={tw('flex flex-col gap-1')}>
              <Text style={tw('text-xl uppercase font-semibold')}>
                Acompanhamento técnico
              </Text>
              {crianca?.acompanhamento_tecnico ? (
                <>
                  <Text>
                    Frequência escolar:{' '}
                    {crianca?.acompanhamento_tecnico?.frequencia_escolar}
                  </Text>
                  <Text>
                    Curso técnico:{' '}
                    {crianca?.acompanhamento_tecnico?.curso_tecnico}
                  </Text>
                  <Text>
                    Acompanhamento psicológico:{' '}
                    {crianca?.acompanhamento_tecnico?.acompanhamento_psicologico
                      ? 'Sim'
                      : 'Não'}
                  </Text>
                  <Text>
                    Comportamento positivo:{' '}
                    {crianca?.acompanhamento_tecnico?.comportamento_positivo
                      ? 'Sim'
                      : 'Não'}
                  </Text>
                  <Text>
                    Acompanhamento médico:{' '}
                    {crianca?.acompanhamento_tecnico?.acompanhamento_medico
                      ? 'Sim'
                      : 'Não'}
                  </Text>
                  <Text>Estado: {crianca?.acompanhamento_tecnico?.estado}</Text>
                  <Text>
                    Nome técnico:{' '}
                    {crianca?.acompanhamento_tecnico?.nome_tecnico}
                  </Text>
                  <Text>
                    Telefone: {crianca?.acompanhamento_tecnico?.telefone}
                  </Text>
                  <Text>
                    Telemovel: {crianca?.acompanhamento_tecnico?.telemovel}
                  </Text>
                  <Text>Email: {crianca?.acompanhamento_tecnico?.email}</Text>
                </>
              ) : (
                <Text>Nenhum acompanhamento técnico</Text>
              )}
            </View>
          </View>
          {/* ANTECEDENTES */}
          <View style={tw('text-black flex')}>
            <View style={tw('flex flex-col gap-1')}>
              <Text style={tw('text-xl uppercase font-semibold')}>
                Antecedentes da criança
              </Text>
              {crianca?.antecedentes_crianca?.justica_juvenil ? (
                <>
                  <Text>
                    Acto licito: {crianca?.antecedentes_crianca?.acto_licito}
                  </Text>
                  <Text>
                    Instituicao de justiça juvenil:{' '}
                    {crianca?.antecedentes_crianca?.instituicao_justica_juvenil}
                  </Text>
                </>
              ) : (
                <Text>Nenhum antecedente</Text>
              )}
            </View>
          </View>
        </View>
        {/* Column 4 */}
        <View style={tw('flex flex-col gap-4 pt-6 px-20')} break>
          {/* PROCESSO DE REUNIFICACAO */}
          <View style={tw('text-black flex')}>
            <View style={tw('flex flex-col gap-1')}>
              <Text style={tw('text-xl uppercase font-semibold')}>
                Processo reunificação
              </Text>
              {crianca?.processo_reunificacao ? (
                <>
                  <Text>
                    Processo anterior:{' '}
                    {crianca?.processo_reunificacao?.processo_anterior}
                  </Text>
                  <Text>
                    Descrição do processo anterior:{' '}
                    {
                      crianca?.processo_reunificacao
                        ?.descricao_processo_anterior
                    }
                  </Text>
                </>
              ) : (
                <Text>Nenhum antecedente</Text>
              )}
            </View>
          </View>
          {/* MOTIVO DA SAIDA */}
          {crianca?.motivo_saida && (
            <View style={tw('text-black flex')}>
              <View style={tw('flex flex-col gap-1')}>
                <Text style={tw('text-xl uppercase font-semibold')}>
                  Motivo saída
                </Text>
                <Text style={tw('text-justify')}>
                  Descrição: {crianca?.motivo_saida?.descricao}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* FOOTER */}
        <View
          style={tw(
            'bg-[#8FD926] px-4 absolute bottom-0 w-full flex flex-row justify-between items-center'
          )}
          fixed
        >
          <View style={tw('text-white')}>
            <Text style={tw('text-2xl font-bold')}>INAC PORTAL</Text>
            <Text style={tw('text-base')}>
              {import.meta.env.VITE_INAC_EMAIL}
            </Text>
            <Text style={tw('text-base')}>
              {import.meta.env.VITE_INAC_SITE}
            </Text>
          </View>
          <Image src='/airplane-paper.png' style={tw('w-44')} />
        </View>
      </Page>
    </Document>
  );
}
