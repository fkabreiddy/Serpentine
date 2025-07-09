import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import HomePage from "./pages/home";
import LoginLayout from "./layouts/login-layout";
import DefaultLayout from "./layouts/default";
import { AuthorizeView } from "./components/common/authorize-view";
import ChatroomPage from "./pages/chatroom-page";


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

      <Route 
        element={
          <DefaultLayout>
        <AuthorizeView>
          <ChatroomPage/> 
        </AuthorizeView>
          </DefaultLayout>
        } 
        path="/group/:id">
      </Route>

    </Routes>
  );
}

export default App;
