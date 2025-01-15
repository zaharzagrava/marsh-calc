import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import AppContainer from "./containers/AppContainer";
import NotFound from "./containers/NotFound";
import PageOutlet from "./containers/PageOutlet";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<PageOutlet />}>
      <Route path="*" element={<NotFound />}/>
      <Route index element={<AppContainer />}/>
    </Route>
  )
);
