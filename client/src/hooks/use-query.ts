import { useLocation } from 'wouter';

export function useQueryParams() {
  const [location] = useLocation();
  const search = location.split('?')[1] || '';
  return new URLSearchParams(search);
}
