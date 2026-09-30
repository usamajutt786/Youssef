import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (newPath: string) => void;
  productIdParam: string | null;
  storeSlugParam: string | null;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath: string) => {
    if (newPath !== path) {
      window.history.pushState({}, '', newPath);
      setPath(newPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Extract route params
  let productIdParam: string | null = null;
  let storeSlugParam: string | null = null;

  if (path.startsWith('/product/')) {
    productIdParam = path.replace('/product/', '').split('/')[0] || null;
  } else if (path.startsWith('/store/')) {
    storeSlugParam = path.replace('/store/', '').split('/')[0] || null;
  }

  return (
    <RouterContext.Provider value={{ path, navigate, productIdParam, storeSlugParam }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
