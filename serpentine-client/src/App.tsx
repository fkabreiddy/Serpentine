import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import HomePage from "./pages/home";
import { AuthorizeView } from './components/authorize-view';
import LoginLayout from "./layouts/login-layout";
import DefaultLayout from "./layouts/default";


function App() {
  return (
    <Routes>
      <Route 
        element={
          <LoginLayout>
            <IndexPage />
          </LoginLayout>
        } 
        path="/" 
      />

        <Route 
          element={
            <DefaultLayout>
              <AuthorizeView>
                <HomePage/> 
              </AuthorizeView>
            </DefaultLayout>
           
          } 
          path="/home">
          
        </Route>

    </Routes>
  );
}

export default App;
