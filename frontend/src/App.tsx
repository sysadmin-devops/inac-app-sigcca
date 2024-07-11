import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@/components/layout/root-layout';
import AuthLayout from '@/components/layout/auth-layout';
import PasswordLayout from '@/components/layout/password-layout';
import { lazy } from 'react';
import NewPassword from '@/pages/auth/new-password';
import { AuthProvider } from '@/context/auth-context';
import { RequireAuth } from '@/utils/require-auth';
import { GlobalProvider } from '@/context/global-context';
import EditarCrianca from './pages/dashboard/editar-crianca';
import Unauthorized from '@/pages/unauthorized';
import ErrorPage from './pages/error-page';
import PrivateRoute from './utils/private-route';

function App() {
  const Home = lazy(() => import('@/pages/dashboard/home'));
  const Login = lazy(() => import('@/pages/auth/login'));
  const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'));
  const Profile = lazy(() => import('@/pages/dashboard/profile'));
  const Settings = lazy(() => import('@/pages/dashboard/settings'));
  const ListaCriancas = lazy(() => import('@/pages/dashboard/lista-criancas'));
  const CadastrarCrianca = lazy(
    () => import('@/pages/dashboard/cadastrar-crianca')
  );
  const Crianca = lazy(() => import('@/pages/dashboard/crianca'));
  const ListaCentros = lazy(() => import('@/pages/dashboard/lista-centros'));
  const ListaFuncionarios = lazy(
    () => import('@/pages/dashboard/lista-funcionarios')
  );
  const CadastrarFuncionario = lazy(
    () => import('@/pages/dashboard/cadastrar-funcionario')
  );
  const Funcionario = lazy(() => import('@/pages/dashboard/funcionario'));
  const EditarFuncionario = lazy(
    () => import('@/pages/dashboard/editar-funcionario')
  );
  const CadastrarCentro = lazy(
    () => import('@/pages/dashboard/cadastrar-centro')
  );
  const Centro = lazy(() => import('@/pages/dashboard/centro'));
  const EditarCentro = lazy(() => import('@/pages/dashboard/editar-centro'));

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: (
            <RequireAuth>
              <Home />
            </RequireAuth>
          ),
        },

        {
          path: 'perfil',
          element: (
            <RequireAuth>
              <Profile />
            </RequireAuth>
          ),
        },
        {
          path: 'configuracoes',
          element: (
            <RequireAuth>
              <Settings />
            </RequireAuth>
          ),
        },

        {
          path: 'funcionarios',
          element: (
            <PrivateRoute allowedRoles={['adminCentro', 'adminGeral']}>
              <RequireAuth>
                <ListaFuncionarios />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'funcionarios/:id',
          element: (
            <PrivateRoute allowedRoles={['adminCentro', 'adminGeral']}>
              <RequireAuth>
                <Funcionario />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'funcionarios/edit/:id',
          element: (
            <PrivateRoute allowedRoles={['adminCentro', 'adminGeral']}>
              <RequireAuth>
                <EditarFuncionario />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'cadastrar-funcionario',
          element: (
            <PrivateRoute allowedRoles={['adminCentro', 'adminGeral']}>
              <RequireAuth>
                <CadastrarFuncionario />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'cadastrar-centro',
          element: (
            <PrivateRoute allowedRoles={['adminGeral']}>
              <RequireAuth>
                <CadastrarCentro />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'centros',
          element: (
            <PrivateRoute allowedRoles={['adminGeral']}>
              <RequireAuth>
                <ListaCentros />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'centros/:id',
          element: (
            <PrivateRoute allowedRoles={['adminGeral']}>
              <RequireAuth>
                <Centro />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'centros/edit/:id',
          element: (
            <PrivateRoute allowedRoles={['adminGeral']}>
              <RequireAuth>
                <EditarCentro />
              </RequireAuth>
            </PrivateRoute>
          ),
        },
        {
          path: 'criancas',
          element: (
            <RequireAuth>
              <ListaCriancas />
            </RequireAuth>
          ),
        },
        {
          path: 'criancas/:id',
          element: (
            <RequireAuth>
              <Crianca />
            </RequireAuth>
          ),
        },
        {
          path: 'criancas/edit/:id',
          element: (
            <RequireAuth>
              <EditarCrianca />
            </RequireAuth>
          ),
        },
        {
          path: 'cadastrar-crianca',
          element: (
            <RequireAuth>
              <CadastrarCrianca />
            </RequireAuth>
          ),
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
      ],
    },
    {
      path: 'password',
      element: <PasswordLayout />,
      children: [
        {
          path: 'reset',
          element: <ForgotPassword />,
        },
        {
          path: 'new',
          element: <NewPassword />,
        },
      ],
    },

    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]);

  return (
    <>
      <AuthProvider>
        <GlobalProvider>
          <RouterProvider router={router} />
        </GlobalProvider>
      </AuthProvider>
    </>
  );
}

export default App;
