import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase(),
  senha: z.string().trim().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
});

export const registerFormSchema = z.object({
  name: z.string().trim().min(3, 'Nome precisa ter no mínimo 3 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase(),
  password: z
    .string()
    .trim()
    .min(6, 'A senha precisa ter no mínimo 6 caracteres'),
});

export const cadastroFormSchema = z.object({
  nome: z.string().trim().min(4, 'Nome precisa ter no mínimo 4 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase(),
  senha: z.string().trim().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
  role: z.string().min(1, 'Selecione um cargo'),
  centroAcolhimento: z.string().min(1, 'Selecione um centro'),
  imagem: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || !files[0]) return true;
      return files[0].size <= MAX_FILE_SIZE;
    }, `O tamanho maximo da imagem é 2MB.`)
    .refine((files) => {
      if (!files || !files[0]) return true;
      return ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type);
    }, 'Apenas o formato .jpg, .jpeg, .png são suportados.'),
});

export const updateFuncionarioSchema = z.object({
  nome: z.string().trim().min(4, 'Nome precisa ter no mínimo 4 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase(),
  senha: z
    .string()
    .trim()
    .transform((senha) => (senha === '' ? undefined : senha))
    .optional(),
  role: z.string().min(1, 'Selecione um cargo').optional(),
  centroAcolhimento: z.string().min(1, 'Selecione um centro').optional(),
  imagem: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || !files[0]) return true;
      return files[0].size <= MAX_FILE_SIZE;
    }, `O tamanho maximo da imagem é 2MB.`)
    .refine((files) => {
      if (!files || !files[0]) return true;
      return ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type);
    }, 'Apenas o formato .jpg, .jpeg, .png são suportados.'),
});

export const resetPasswordFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase(),
});

export const newPasswordFormSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, 'A senha precisa ter no mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Palavra-passe precisam ser iguais',
      path: ['confirmPassword'],
    }
  );

export const updateProfileFormSchema = z.object({
  email: z.string().trim().email('Formato de e-mail inválido').toLowerCase(),
  name: z.string().trim().min(3, 'Nome precisa ter no mínimo 3 caracteres'),
  imagem: z.any(),
  // .refine((files) => {
  //   return files?.[0]?.size <= MAX_FILE_SIZE;
  // }, `O tamanho maximo da imagem é 2MB.`)
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
  //     'Apenas o formato .jpg, .jpeg, .png são suportados.'
  //   )
  //   .optional(),
});

export const criancaFormSchema = z.object({
  nome_completo: z.string().trim().min(1, 'O nome é obrigatório'),
  nome_desconhecido: z.boolean().default(false),
  imagem: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || !files[0]) return true;
      return files[0].size <= MAX_FILE_SIZE;
    }, `O tamanho maximo da imagem é 2MB.`)
    .refine((files) => {
      if (!files || !files[0]) return true;
      return ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type);
    }, 'Apenas o formato .jpg, .jpeg, .png são suportados.'),
  imagemBase64: z.string().optional(),
  sexo: z.string(),
  filiacao: z.string(),
  estado: z.string(),
  provincia: z.string(),
  municipio: z.string(),
  nacionalidade: z.string(),
  distrito: z.string(),
  bairro: z.string(),
  naturalidade: z.string(),
  zona_vivia: z.string(),
  ponto_referencia: z.string(),
  data_nascimento: z.string(),
  data_entrada: z.string(),
  data_atualizacao: z.string(),
  descricao: z.string(),
  vestuario: z.string(),
  familia_localizada: z.boolean(),
  residencia_atual: z.string(),
  frequencia_contacto_anual: z.number(),
  pessoa_vivia_crianca: z.string(),
  irmaos_biologicos: z.boolean(),
  quanto_tempo: z.string(),
  onde_esteve: z.string(),
  telefone_familiar: z.number(),
  email_familiar: z.string().trim().email('Formato de e-mail inválido'),
  classe: z.string(),
  escola: z.string(),
  ano: z.number(),
  nome_responsavel: z.string(),
  telefone_entidade: z.number(),
  telemovel_entidade: z.number(),
  email_entidade: z.string().trim(),
  acto_licito: z.string(),
  justica_juvenil: z.boolean().default(false),
  instituicao_justica_juvenil: z.string(),
  motivo_saida: z.string(),
  frequencia_escolar: z.number(),
  curso_tecnico: z.string(),
  acompanhamento_psicologico: z.boolean(),
  comportamento_positivo: z.boolean(),
  acompanhamento_medico: z.boolean(),
  estado_tecnico: z.string(),
  nome_tecnico: z.string(),
  telefone_tecnico: z.string(),
  telemovel_tecnico: z.string(),
  email_tecnico: z.string().trim().email('Formato de e-mail inválido'),
  processo_anterior: z.string(),
  descricao_processo_anterior: z.string(),
});
