import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useDocumentTitle(title: string) {
  const location = useLocation();

  useEffect(() => {
    document.title = title && title + ' - INAC';
  }, [location.pathname, title]);
}
