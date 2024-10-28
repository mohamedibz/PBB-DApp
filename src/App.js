import './App.css';
import Header from './components/Header';
import { EthereumProvider } from './context/EthereumContext';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <EthereumProvider>
      <div className="h-screen w-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <Header />

        <BrowserRouter> 
        {/*<NavBar />*/}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={ <Home />}/>
              <Route path="/home" element={ <Home />}/>
              <Route path="/Create" element={ <Create /> }/>
              <Route path="/Write"  />
              <Route path="/Auditory" />
            </Routes>
          </div>
        </BrowserRouter>
        
      </div>

    </EthereumProvider>
  );
}

export default App;
