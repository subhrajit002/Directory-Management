import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Register from "./pages/Register"
import Login from "./pages/Login"
import Navbar from './components/Navbar';
import BusinessList from './pages/AllBusiness';
import EditBusiness from "./pages/EditPage"
import MyBusinessList from "./pages/MyBusiness"

function App() {
  const jwt = localStorage.getItem("token");
  console.log(jwt)
  const location = useLocation();

  const showNavbar = location.pathname !== '/signin' && location.pathname !== '/signup';

  return (
    <>
      {showNavbar && <Navbar jwt={jwt} />}
      <Routes>
       
        <Route path='/mybusiness' element={<MyBusinessList />} />
        <Route path='/' element={<BusinessList />} />
        <Route path='/signin' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/business/edit/:id' element={<EditBusiness />} />
      </Routes>
    </>
  );
}

export default App;
