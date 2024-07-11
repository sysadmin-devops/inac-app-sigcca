import type { UserTypes } from '@/utils/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import Cookies from 'js-cookie';

interface GlobalContextType {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  criancas: never[];
  usuario: UserTypes | undefined;
  setUsuario: React.Dispatch<React.SetStateAction<UserTypes | undefined>>;
  idUsuario: string;
  obterIniciais: (nome: string) => string;
  formatarNomeCompleto: (nome: string) => string;
  criancasByProvince: never[];
  getUser: () => void;
  allCriancasByProvince: () => void;
  allCriancas: () => void;
  allFuncionarios: () => void;
  funcionarios: never[];
  allCentros: () => void;
  centros: never[];
}

export const GlobalContext = createContext<GlobalContextType>(null!);

interface GlobalProviderType {
  children: React.ReactNode;
}
export function GlobalProvider({ children }: GlobalProviderType) {
  const [isActive, setIsActive] = useState(false);
  const [criancas, setCriancas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [centros, setCentros] = useState([]);
  const [usuario, setUsuario] = useState<UserTypes>();
  const [criancasByProvince, setCriancasByProvince] = useState([]);
  const { user, userData } = useContext(AuthContext);

  const idUsuario = JSON.parse(localStorage.getItem('usuario') as string)?.id;
  const token = Cookies.get('token');

  const allCriancas = () => {
    const endpoint =
      userData.role === 'adminGeral'
        ? 'criancas'
        : `criancas/centro/${userData.centroAcolhimento}`;
    fetch(`${import.meta.env.VITE_API}/api/${endpoint}`, {
      cache: 'default',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((criancas) => setCriancas(criancas))
      .catch((error) => {
        console.error('Erro ao obter lista de crianças:', error);
      });
  };

  const allFuncionarios = () => {
    fetch(`${import.meta.env.VITE_API}/api/funcionarios`, {
      cache: 'default',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((funci) => setFuncionarios(funci))
      .catch((error) => {
        console.error('Erro ao obter lista de funcionários:', error);
      });
  };

  const allCriancasByProvince = () => {
    fetch(
      `${import.meta.env.VITE_API}/api/criancas/quantidadePorProvinciaOrdenado`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCriancasByProvince(Object.values(data));
      })
      .catch((error) => {
        console.error('Erro ao obter lista de crianças por provincia:', error);
      });
  };

  const allCentros = () => {
    // if (userData.role === 'adminGeral') {
    fetch(`${import.meta.env.VITE_API}/api/centroAcolhimento`, {
      cache: 'default',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((centros) => setCentros(centros))
      .catch((error) => {
        console.error('Erro ao obter lista de crianças:', error);
      });
    // }
  };

  const getUser = async () => {
    const usuario = await JSON.parse(localStorage.getItem('usuario') as string);
    const data = await fetch(
      `${import.meta.env.VITE_API}/api/${
        usuario.role === 'funcionario'
          ? 'funcionarios'
          : usuario.role === 'adminCentro'
          ? 'adminCentro'
          : 'adminGeral'
      }/${usuario.id}`,
      {
        cache: 'default',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await data.json();
    await setUsuario(res);
  };

  useEffect(() => {
    if (user) {
      getUser();
      allFuncionarios();
      allCriancasByProvince();
      allCriancas();
      allCentros();
    }
  }, [user, userData]);

  function obterIniciais(nome: string) {
    const partesNome = nome && nome.split(' ');
    let iniciais = '';
    if (partesNome) {
      for (let i = 0; i < partesNome.length; i++) {
        iniciais += partesNome[i][0];
      }
    }
    return iniciais.toUpperCase();
  }

  function formatarNomeCompleto(nome: string) {
    const partesNome = nome && nome.split(' ');
    if (partesNome && partesNome.length > 1) {
      return partesNome[0] + ' ' + partesNome[partesNome.length - 1];
    } else {
      return nome;
    }
  }

  const value = {
    isActive,
    setIsActive,
    criancas,
    usuario,
    setUsuario,
    idUsuario,
    obterIniciais,
    formatarNomeCompleto,
    criancasByProvince,
    getUser,
    allCriancasByProvince,
    allCriancas,
    funcionarios,
    allFuncionarios,
    allCentros,
    centros,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
