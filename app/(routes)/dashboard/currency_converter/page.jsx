"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";  // 自定义的 Input 组件
import { Button } from "@/components/ui/button";  // 自定义的 Button 组件
import { ArrowRight } from 'lucide-react'; // 使用箭头图标来表示转换
import { toast } from 'sonner';  // Toast 通知

// 货币代码列表
const currencyCodes = ["USD", "EUR", "GBP", "GHS", "JPY", "CAD", "CNY"];

function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const fetchExchangeRate = async () => {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY; // 在 .env.local 文件中存储 API 密钥
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`);
      
      if (!response.ok) throw new Error("Error fetching exchange rate");

      const data = await response.json();
      
      if (data.result === "error") {
        setError(data['error-type']);
      } else {
        setResult(data.conversion_result);
        setError('');
        toast.success(`Converted ${amount} ${fromCurrency} to ${result} ${toCurrency}`);
      }
    } catch (error) {
      setError('Something went wrong, please try again.');
      console.error(error);
      toast.error('Failed to fetch exchange rate!');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Currency Converter</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <Input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter amount"
            className="rounded-lg shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Currency
            </label>
            <select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)} 
              className="w-full p-2 border rounded-lg"
            >
              {currencyCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Currency
            </label>
            <select 
              value={toCurrency} 
              onChange={(e) => setToCurrency(e.target.value)} 
              className="w-full p-2 border rounded-lg"
            >
              {currencyCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <Button onClick={fetchExchangeRate} className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-orange-600">
            Convert <ArrowRight />
          </Button>
        </div>

        {result && (
          <div className="bg-gray-100 text-yellow-800 p-4 rounded-lg text-center">
            <strong>{amount} {fromCurrency}</strong> = <strong>{result} {toCurrency}</strong>
          </div>
        )}

        {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">{error}</div>}
      </div>
    </div>
  );
}

export default CurrencyConverter;


