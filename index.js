import { useState } from "react";

const stations = ["Løb", "Ro", "Styrke"];

export default function Home() {
  const [selections, setSelections] = useState({});
  const [current, setCurrent] = useState({ bane: null, station: null });
  const [name, setName] = useState("");

  const handleSelect = (bane, station) => {
    setCurrent({ bane, station });
  };

  const handleSubmit = () => {
    if (!current.bane || !current.station || !name) return;
    const key = `${current.bane}-${current.station}`;
    setSelections({ ...selections, [key]: name });
    setCurrent({ bane: null, station: null });
    setName("");
  };

  const handleReset = () => {
    setSelections({});
  };

  const isTaken = (bane, station) => {
    const key = `${bane}-${station}`;
    return selections[key];
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Vælg bane og station</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <span>Klik for at reservere en station</span>
        <button onClick={handleReset}>Nulstil alle valg</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {[...Array(16)].map((_, i) => {
          const bane = i + 1;
          return (
            <div key={bane} style={{ border: '1px solid #ccc', padding: 10 }}>
              <h2>Bane {bane}</h2>
              {stations.map((station) => {
                const key = `${bane}-${station}`;
                const taken = isTaken(bane, station);
                return (
                  <button
                    key={station}
                    onClick={() => handleSelect(bane, station)}
                    disabled={!!taken}
                    style={{ display: 'block', marginBottom: 5, width: '100%' }}
                  >
                    {station} {taken ? `- ${taken}` : ""}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {current.bane && current.station && (
        <div style={{ marginTop: 30 }}>
          <h3>
            Du har valgt Bane {current.bane} - {current.station}
          </h3>
          <input
            placeholder="Indtast dit navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: 'block', marginBottom: 10 }}
          />
          <button onClick={handleSubmit}>Bekræft valg</button>
        </div>
      )}

      <div style={{ marginTop: 40 }}>
        <h2>Fuld oversigt</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[...Array(16)].map((_, i) => {
            const bane = i + 1;
            return (
              <div key={bane} style={{ border: '1px solid #ddd', padding: 10 }}>
                <h3>Bane {bane}</h3>
                <ul>
                  {stations.map((station) => {
                    const key = `${bane}-${station}`;
                    const navn = selections[key] || "-";
                    return <li key={station}>{station}: {navn}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
