import React from 'react';
import { styled } from '@mui/system';

interface Props {
  children: React.ReactNode;
}

const PageStyled = styled('div')({
  minHeight: '100vh',
  maxWidth: '100vw',
  display: 'grid',
});

const Page = ({ children }: Props) => <PageStyled>{children}</PageStyled>;

export default Page;
