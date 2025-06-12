import { usePathname } from 'next/navigation';
import AIChatWidget from '@/components/ai/AIChatWidget';

export default function AIChatProvider() {
  const pathname = usePathname();

  // Get context based on current path
  const getContext = () => {
    if (pathname.startsWith('/edr')) {
      return {
        module: 'edr' as const,
        page: pathname.split('/').pop(),
        filters: new URLSearchParams(window.location.search),
      };
    }
    if (pathname.startsWith('/emo')) {
      return {
        module: 'emo' as const,
        page: pathname.split('/').pop(),
        filters: new URLSearchParams(window.location.search),
      };
    }
    if (pathname.startsWith('/gosellr')) {
      return {
        module: 'gosellr' as const,
        page: pathname.split('/').pop(),
        filters: new URLSearchParams(window.location.search),
      };
    }
    if (pathname.startsWith('/wallet')) {
      return {
        module: 'wallet' as const,
        page: pathname.split('/').pop(),
      };
    }
    if (pathname.startsWith('/franchise')) {
      return {
        module: 'franchise' as const,
        page: pathname.split('/').pop(),
      };
    }
    return undefined;
  };

  return <AIChatWidget context={getContext()} />;
}
