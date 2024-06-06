import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Graph from '../../components/Graph/graph'; 
import 'bootstrap/dist/css/bootstrap.min.css';

interface AnalystEstimates {
  [key: string]: number;
}

interface StockInfo {
  market_ap: number;
  shares_outstanding: number;
  pe_ratio: number;
  ps_ratio: number;
  pb_ratio: number;
  peg_ratio: number;
  current_ratio: number;
  debt_to_equity_ratio: number;
  eps: number;
  analyst_estimates: AnalystEstimates | null;
}

interface DataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

const Apple: React.FC = () => {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/financials');
        setStockInfo(response.data);
      } catch (error) {
        setError('Error fetching financial data');
      }
    };

    const fetchChartData = async () => {
        try {
            const apiKey = 'a3I9pmkAejlddA7nU7cD9F8ySphdJ8wk';
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 7);
    
            const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`, {
              params: { apiKey: apiKey },
            });

        if (response.data && response.data.results) {
          const data = response.data.results.map((item: any) => {
            if (item.t !== undefined && item.o !== undefined && item.h !== undefined && item.l !== undefined && item.c !== undefined) {
              return {
                date: new Date(item.t),
                open: item.o,
                high: item.h,
                low: item.l,
                close: item.c,
              };
            } else {
              console.error('Invalid data point:', item);
              return null;
            }
          }).filter((item: any) => item !== null); // Filter out null items
          setChartData(data);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        setError('Error fetching chart data');
      }
    };

    fetchData();
    fetchChartData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!stockInfo || chartData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Apple Inc. (AAPL)</h1>
      <div className="row">
        <div className="col-md-4">
          <h2>Key Ratios</h2>
          <ul>
            <li>Market Cap: {stockInfo.market_ap}</li>
            <li>Shares Outstanding: {stockInfo.shares_outstanding}</li>
            <li>P/E Ratio: {stockInfo.pe_ratio}</li>
            <li>P/S Ratio: {stockInfo.ps_ratio}</li>
            <li>P/B Ratio: {stockInfo.pb_ratio}</li>
            <li>PEG Ratio: {stockInfo.peg_ratio}</li>
            <li>Current Ratio: {stockInfo.current_ratio}</li>
            <li>Debt to Equity Ratio: {stockInfo.debt_to_equity_ratio}</li>
            <li>EPS: {stockInfo.eps}</li>
          </ul>
          <h2>Analyst Estimates</h2>
          <ul>
            {stockInfo.analyst_estimates ? (
              Object.keys(stockInfo.analyst_estimates).map((key) => (
                <li key={key}>
                  {key}: {stockInfo.analyst_estimates![key]}
                </li>
              ))
            ) : (
              <li>No analyst estimates available</li>
            )}
          </ul>
        </div>
        <div className="col-md-8">
          <Graph data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Apple;