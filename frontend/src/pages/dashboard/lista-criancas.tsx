/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import DownloadBtn from '@/components/ui/download-btn';
import InputTable from '@/components/ui/table-input';
import { GlobalContext } from '@/context/global-context';
import useDocumentTitle from '@/utils/use-title';
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export type TUser = {
  _id: string;
  id: number;
  nome_completo: string;
  sexo: string;
  provincia: string;
  data_nascimento: string;
};

function calculateAge(dob: string) {
  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();

  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() == birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

const columnHelper = createColumnHelper<TUser>();
const columns = [
  columnHelper.accessor('nome_completo', {
    id: 'Nome',
    header: () => 'Nome',
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('sexo', {
    id: 'Sexo',
    header: () => 'Sexo',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('data_nascimento', {
    id: 'Idade',
    header: () => 'Idade',
    cell: (info) => calculateAge(info.getValue()),
  }),
  columnHelper.accessor('provincia', {
    id: 'Província',
    header: () => 'Província',
    cell: (info) => info.getValue(),
  }),
];

export default function ListaCriancas() {
  useDocumentTitle('Lista de crianças');
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const { criancas } = useContext(GlobalContext);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [criancaList, setCriancaList] = useState([]);

  function dataNascimento(dataNascimento) {
    const data = new Date(dataNascimento).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return data;
  }

  useEffect(() => {
    setCriancaList(
      criancas.map((crianca) => ({
        nome: crianca.nome_completo,
        sexo: crianca.sexo,
        data_nascimento: dataNascimento(crianca.data_nascimento),
        idade: calculateAge(crianca.data_nascimento),
        provincia: crianca.provincia,
        nacionalidade: crianca.nacionalidade,
      }))
    );
  }, [criancas]);

  const table = useReactTable({
    data: criancas,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
    enableSortingRemoval: false,
  });

  return (
    <section className='p-2 max-w-5xl mx-auto text-gray-700 fill-gray-400'>
      <div className='flex justify-between mb-2'>
        <InputTable
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
        />
        <div className='flex gap-2'>
          <DownloadBtn data={criancaList} fileName={'crianças'} />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className='py-3 px-3 bg-white text-green-600 items-center rounded-md shadow'>
              <ChevronDown className='w-6 h-6' />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className='bg-white p-4 rounded mr-9 mt-1 space-y-3 shadow-md'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenu.CheckboxItem
                      key={column.id}
                      className='peer capitalize cursor-pointer flex items-center justify-start gap-2 text-left'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      <DropdownMenu.ItemIndicator>
                        <Check className='w-4 h-4' />
                      </DropdownMenu.ItemIndicator>
                      {column.id}
                    </DropdownMenu.CheckboxItem>
                  );
                })}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
      <table className='border border-gray-400 w-full text-left bg-white'>
        <thead className='bg-green-600 text-white'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className='capitalize px-3.5 py-3 cursor-pointer'
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className='flex gap-1 items-center'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted ? (
                      header.column.getIsSorted() === 'asc' ? (
                        <ChevronUp className='w-5 h-5' />
                      ) : (
                        <ChevronDown className='w-5 h-5' />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='divide-y divide-slate-300'>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='odd:bg-white even:bg-slate-100'>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='px-3.5 py-3'>
                    <Link to={`${row.original._id}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Link>
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className='odd:bg-white even:bg-slate-100'>
              <td className='px-3.5 py-3'>Sem dados</td>
            </tr>
          )}
        </tbody>
      </table>
      <article className='flex items-center justify-between mt-2 gap-2'>
        <span className='font-medium'>
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </span>

        <div className='flex items-center gap-1.5'>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className='bg-transparent px-3 py-1 border-none rounded focus:ring-0 w-32'
          >
            {[15, 30, 45, 60].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
          <button
            onClick={() => table.previousPage()}
            className='border border-gray-300 bg-green-600 outline focus:outline-green-600 active:outline-green-600 text-white rounded-lg py-1.5 px-1.5 disabled:cursor-not-allowed disabled:outline-none disabled:opacity-60'
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={() => table.nextPage()}
            className='border border-gray-300 bg-green-600 outline focus:outline-green-600 active:outline-green-600 text-white rounded-lg py-1.5 px-1.5 disabled:cursor-not-allowed disabled:outline-none disabled:opacity-60'
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </button>
        </div>
      </article>
    </section>
  );
}
