import { Route, Routes, useNavigate } from "react-router-dom";

import IndexPage from "@/pages/index";
import HomePage from "./pages/home";
import LoginLayout from "./layouts/login-layout";
import DefaultLayout from "./layouts/default";
import { AuthorizeView } from "./components/common/authorize-view";
import ChatroomPage from "./pages/chatroom-page";
import ClickSpark from "./components/common/spark-click";
import { useEffect, useRef, useState } from "react";
import SearchResultsPage from "./pages/explore-page";
import ExplorePage from "./pages/explore-page";
import { useAuthStore } from "./contexts/authentication-context";
import LoginWithCurrentAccount from "./components/users/forms/login-current-account";
import { useJwtHelper } from "./helpers/jwt-helper";


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
        path="/group/:groupId">
      </Route>
      
      <Route 
        element={
          <DefaultLayout>
          <AuthorizeView>
            <ExplorePage/> 
          </AuthorizeView>
          </DefaultLayout>
        } 
        path="/explore">
      </Route>

    </Routes>
   
  );
}

export default App;

