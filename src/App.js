
import React, { useState } from 'react';
import './App.css';

function App() {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFilter('');

    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await res.json();
      if (result[0].Status !== 'Success') {
        setError(result[0].Message || 'Invalid Pincode');
        setData([]);
      } else {
        setData(result[0].PostOffice);
      }
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((office) =>
    office.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="app">
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <label>Enter Pincode</label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
          />
          <button type="submit">Lookup</button>
        </form>
        {error && <p className="error">{error}</p>}
        {loading && <div className="loader"></div>}
      </div>

      {data.length > 0 && !loading && (
        <div className="results-section">
          <h3>Pincode: <strong>{pincode}</strong></h3>
          <p><strong>Message:</strong> Number of pincode(s) found: {data.length}</p>
          <input
            type="text"
            placeholder="🔍 Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="cards">
            {filteredData.length > 0 ? (
              filteredData.map((office, index) => (
                <div key={index} className="card">
                  <p><strong>Name:</strong> {office.Name}</p>
                  <p><strong>Branch Type:</strong> {office.BranchType}</p>
                  <p><strong>Delivery Status:</strong> {office.DeliveryStatus}</p>
                  <p><strong>District:</strong> {office.District}</p>
                  <p><strong>Division:</strong> {office.Division}</p>
                </div>
              ))
            ) : (
              <p className="error">Couldn’t find the postal data you’re looking for…</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
