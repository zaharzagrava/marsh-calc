import React from 'react';
import { styled } from '@mui/system';
import { Outlet } from 'react-router-dom';


const PageStyled = styled('div')({
  minHeight: '100vh',
  maxWidth: '100vw',
  display: 'grid',
  backgroundColor: 'rgb(5, 7, 10)',
});

const PageOutlet = () => <PageStyled><Outlet/></PageStyled>;

export default PageOutlet;
