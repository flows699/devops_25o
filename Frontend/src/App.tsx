import { useState, useEffect, useCallback } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';

const CURRENCIES = [
  { code: 'EUR', name: 'Euro' },
  { code: 'HUF', name: 'Hungarian Forint' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CHF', name: 'Swiss Franc' },
];

function App() {
  const [amount, setAmount] = useState<number | string>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('HUF');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchConversion = useCallback(async () => {
    const numericAmount = Number(amount);

    if (numericAmount <= 0) {
        setResult(0);
        return;
    }

    if (fromCurrency === toCurrency) {
        setResult(numericAmount);
        setError("");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/convert?amount=${numericAmount}&from=${fromCurrency}&to=${toCurrency}`);
      
      if (!response.ok) throw new Error('Hálózati hiba');
      
      const data = await response.json();
      setResult(Math.round(data.result * 100) / 100);
    } catch (err) {
        console.error(err);
        setError("Hiba a backend elérésekor.");
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (amount !== "" && Number(amount) > 0) {
        fetchConversion();
      } else {
        setResult(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    
  }, [fetchConversion, amount]); 


  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-brand-light to-brand-medium">
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 backdrop-blur-sm">
        
        <h1 className="text-3xl font-bold text-brand-dark mb-8 text-center">Valutaváltó</h1>

        <div className="mb-4 relative">
          <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1 ml-1">Összeg</label>
          <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden focus-within:ring-2 ring-brand-medium focus-within:border-brand-medium transition bg-gray-50">
            <input 
              type="number" 
              value={amount}
              min="0"
              onChange={(e) => {
                const val = e.target.value;
                setAmount(val === "" ? "" : Number(val));
              }}
              className="grow min-w-0 p-4 text-xl font-bold text-gray-700 bg-transparent outline-none"
              data-testid="amount-input"
            />
            <select 
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="shrink-0 bg-transparent border-l-2 border-gray-200 p-2 font-bold text-brand-dark outline-none cursor-pointer hover:bg-gray-200 transition"
              data-testid="from-select"
            >
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center -my-5 relative z-10">
          <button 
            onClick={swapCurrencies} 
            className="bg-white border-2 border-gray-100 rounded-full p-2 hover:border-brand-medium hover:text-brand-medium transition shadow-md group cursor-pointer"
            title="Váltás"
            data-testid="swap-button"
          >
             <ArrowsRightLeftIcon className="h-6 w-6 text-brand-dark group-hover:text-brand-medium transition" />
          </button>
        </div>

        <div className="mb-4 mt-4">
          <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1 ml-1">Átváltva</label>
          <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden bg-white focus-within:ring-2 ring-brand-medium transition">
            <div className={`grow min-w-0 p-4 text-xl bg-gray-50 text-gray-500 flex items-center ${result ? 'font-bold text-brand-dark' : ''}`} data-testid="result-value">
                {loading ? <span className="text-gray-400 text-sm">Számolás...</span> : (result ?? "...")}
            </div>
            <select 
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="shrink-0 bg-gray-50 border-l-2 border-gray-200 p-2 font-bold text-brand-dark outline-none cursor-pointer hover:bg-gray-200 transition"
              data-testid="to-select"
            >
               {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
            </select>
          </div>
        </div>

        <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
                Az árfolyamok valós időben frissülnek. <br/> 
                Powered by Frankfurter API.
            </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-200">
            {error}
          </div>
        )}
        
      </div>
    </div>
  )
}

export default App