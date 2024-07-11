import { CloudDownload } from 'lucide-react';
import * as XLSX from 'xlsx';


type TDownloadBtn = {
  data: never[]
  fileName: string
}

export default function DownloadBtn({ data = [], fileName }: TDownloadBtn) {
  function handleButton() {
    const datas = data?.length ? data : [];
    const worksheet = XLSX.utils.json_to_sheet(datas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Folha 1');
    XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : 'dados.xlsx');
  }
  return (
    <button
      onClick={handleButton}
      className='bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-1.5 py-2.5 px-4 rounded-md transition-colors'
    >
      <CloudDownload className='w-5 h-5'/>
      Exportar
    </button>
  );
}
