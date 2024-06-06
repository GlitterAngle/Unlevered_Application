import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Graph from '../../components/Graph/graph';
import 'bootstrap/dist/css/bootstrap.min.css';
// import styles from './Apple.module.css';

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
                const response = await axios.get('/.netlify/functions/financials');
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
        <div className="container mt-5">
            <h1 className="text-center mb-4">Apple Inc. (AAPL)</h1>
            <div className="row justify-content-center mb-4">
                <div className="col-12">
                    <Graph data={chartData} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Key Ratios</h2>
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td>Market Cap</td>
                                <td>{stockInfo.market_ap}</td>
                            </tr>
                            <tr>
                                <td>Shares Outstanding</td>
                                <td>{stockInfo.shares_outstanding}</td>
                            </tr>
                            <tr>
                                <td>P/E Ratio</td>
                                <td>{stockInfo.pe_ratio}</td>
                            </tr>
                            <tr>
                                <td>P/S Ratio</td>
                                <td>{stockInfo.ps_ratio}</td>
                            </tr>
                            <tr>
                                <td>P/B Ratio</td>
                                <td>{stockInfo.pb_ratio}</td>
                            </tr>
                            <tr>
                                <td>PEG Ratio</td>
                                <td>{stockInfo.peg_ratio}</td>
                            </tr>
                            <tr>
                                <td>Current Ratio</td>
                                <td>{stockInfo.current_ratio}</td>
                            </tr>
                            <tr>
                                <td>Debt to Equity Ratio</td>
                                <td>{stockInfo.debt_to_equity_ratio}</td>
                            </tr>
                            <tr>
                                <td>EPS</td>
                                <td>{stockInfo.eps}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <h2>Analyst Estimates</h2>
                    <table className="table table-striped">
                        <tbody>
                            {stockInfo.analyst_estimates ? (
                                Object.keys(stockInfo.analyst_estimates).map((key) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{stockInfo.analyst_estimates![key]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2}>No analyst estimates available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Apple;