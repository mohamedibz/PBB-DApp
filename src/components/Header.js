import React from 'react';
import logo from '../assets/PBBIcon.png'
import Wallet from './Wallet';
import NavBar from './NavBar';

function Header() {
  return (
    <header className="bg-primary p-4 shadow-md border-b-2 border-yellow-700">

      <div className="flex justify-between items-center ml-8">

        <div className="flex flex-row items-center justify-between gap-x-4">

          <img src={logo} />
          
          <div className="text-white text-2xl font-bold">
            Public Bulletin Board
          </div>
        
        </div>
        
        <div className='m-4 mr-8'>
        <Wallet />
        </div>

      </div>

    </header>
  );
}

export default Header;
