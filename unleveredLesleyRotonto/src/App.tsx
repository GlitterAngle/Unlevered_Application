import {useEffect, useState} from 'react'
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import pages and nav component
import Nav from './components/NavBar/nav';
import Landing from './pages/Landing/Landing';
import Apple from './pages/Apple/Apple'


interface AnalystEstimates {
  [key: string]: number;
}

interface StockInfo {
  market_cap: number;
  shares_outstanding: number;
  pe_ratio: number;
  ps_ratio: number;
  pb_ratio: number;
  peg_ratio: number;
  current_ratio: number;
  debt_to_equity_ratio: number;
  eps: number;
  analyst_estimates: AnalystEstimates;
}

function App() {

  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)

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
