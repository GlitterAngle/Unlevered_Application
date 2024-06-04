import React, {useEffect, useState} from 'react'
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import pages and nav component
import Nav from './components/NavBar/nav';
import Landing from './pages/Landing/Landing';
import Apple from './pages/Apple/Apple'


function App() {

  const [stockInfo, setStockInfo] = useState<any>(null)

  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const reuslt = await axios.get(`http://127.0.0.1:8000/financials`)
        setStockInfo(reuslt.data)
      } catch (error) {
        console.error("Error fetching finnancial data", error)
      }
    }
    fetchData()
  },[])

  if(!stockInfo){
    return <div>Loading...</div>
  }

  return (
    <>
      <Nav />
        <Routes>
          <Route path="" element={<Landing />} />
          <Route path="apple" element={<Apple stockInfo={stockInfo}/>}/>
        </Routes>
    </>
  );
}

export default App;
