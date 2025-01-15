import './App.css'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import { store } from './store'
import { router } from './router'
import { CssBaseline } from '@mui/material'

function App() {
  // return (
  //   <Provider store={store}>
  //     <RouterProvider router={router}/>
  //   </Provider>
  // )
  // <RouterProvider router={router}/>

  // return <Provider store={store}>
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path='/' element={<AppContainer1 />}/>
  //     </Routes>
  //   </BrowserRouter>
  // </Provider>


  return <Provider store={store}>
    <CssBaseline enableColorScheme />
    <RouterProvider router={router} />
  </Provider>
}

export default App
