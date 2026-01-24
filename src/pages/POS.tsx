import { Outlet } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

export const POSPage = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
