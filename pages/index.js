import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const stations = ["Løb", "Ro", "Styrke"];

export default function BaneStationApp() {
  const [selections, setSelections] = useState({});
  const [editing, setEditing] = useState(null);
  const [inputName, setInputName] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [viewMode, setViewMode] = useState("input"); // "input" or "overview"

  const handleSelect = (bane, station) => {
    const key = `${bane}-${station}`;
    if (selections[key]) return;
    setEditing({ bane, station });
    setInputName("");
    setIsGuest(false);
  };

  const handleInputChange = (e) => {
    setInputName(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!editing || !inputName) return;
    const key = `${editing.bane}-${editing.station}`;
    const nameWithGuest = isGuest ? `⭐ ${inputName}` : inputName;
    setSelections({ ...selections, [key]: nameWithGuest });
    setEditing(null);
    setInputName("");
    setIsGuest(false);
  };

  const handleRemove = (bane, station) => {
    const key = `${bane}-${station}`;
    const updated = { ...selections };
    delete updated[key];
    setSelections(updated);
  };

  const handleReset = () => {
    setSelections({});
  };

  const isTaken = (bane, station) => {
    const key = `${bane}-${station}`;
    return selections[key];
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold mb-4">{viewMode === "overview" ? "Fuld oversigt" : "Vælg bane og station"}</h1>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {viewMode === "overview"
            ? "Viser alle valg – kun til instruktører"
            : "Klik på en station og indtast dit navn"}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setViewMode(viewMode === "input" ? "overview" : "input")}>{viewMode === "input" ? "Vis oversigt" : "Tilbage til indtastning"}</button>
          <button onClick={handleReset}>Nulstil alle valg</button>
        </div>
      </div>

      {viewMode === "input" && (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => {
            const bane = i + 1;
            return (
              <div key={bane} className="p-2 border rounded">
                <h2 className="font-semibold mb-2">Bane {bane}</h2>
                {stations.map((station) => {
                  const key = `${bane}-${station}`;
                  const taken = isTaken(bane, station);

                  if (editing && editing.bane === bane && editing.station === station) {
                    return (
                      <form key={station} onSubmit={handleInputSubmit} className="mb-1 flex gap-2 items-center">
                        <input
                          placeholder="Navn"
                          value={inputName}
                          onChange={handleInputChange}
                          autoFocus
                          className="flex-1 border p-1"
                        />
                        <label className="flex items-center gap-1 text-sm">
                          <input type="checkbox" checked={isGuest} onChange={(e) => setIsGuest(e.target.checked)} />
                          Gæst
                        </label>
                        <button type="submit">Bekræft</button>
                      </form>
                    );
                  }

                  return (
                    <div key={station} className="flex gap-2 mb-1">
                      <button onClick={() => handleSelect(bane, station)} disabled={!!taken} className="flex-1 border p-1">
                        {station} {taken ? `- ${taken}` : ""}
                      </button>
                      {taken && (
                        <button onClick={() => handleRemove(bane, station)}>❌</button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "overview" && (
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => {
            const bane = i + 1;
            return (
              <div key={bane} className="border p-2 rounded">
                <h3 className="font-semibold mb-1">Bane {bane}</h3>
                <ul className="text-sm">
                  {stations.map((station) => {
                    const key = `${bane}-${station}`;
                    const navn = selections[key] || "-";
                    return (
                      <li key={station}>{station}: {navn}</li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
