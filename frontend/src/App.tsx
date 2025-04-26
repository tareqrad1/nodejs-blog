import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignupPage from "./pages/auth/SignupPage"
import ArticlePage from "./pages/home/ArticlePage"
import LoginPage from "./pages/auth/LoginPage"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<h1 className="text-3xl text-center h-screen">Not Found!</h1>} />
        <Route path="/" element={<HomePage />}/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/article" element={<ArticlePage />}/>
        <Route path="/login" element={<LoginPage />}/>
      </Routes>
    </>
  )
}

export default App