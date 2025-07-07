import React, { useState } from "react";

function numberWithThousandSeparators(x) {
  if (x === "" || x === null) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoberturasDinamicas = ({ value, onChange }) => {
  const [nombreCobertura, setNombreCobertura] = useState("");
  const [valorCobertura, setValorCobertura] = useState("");
  const [coberturas, setCoberturas] = useState(value || []);

  // Actualiza el estado interno y notifica al padre
  const updateCoberturas = (nuevasCoberturas) => {
    setCoberturas(nuevasCoberturas);
    if (onChange) onChange(nuevasCoberturas);
  };

  const handleAgregar = () => {
    if (!nombreCobertura || !valorCobertura) return;
    const nuevaCobertura = {
      nombre: nombreCobertura,
      valor: parseFloat(valorCobertura.replace(/,/g, ""))
    };
    updateCoberturas([...coberturas, nuevaCobertura]);
    setNombreCobertura("");
    setValorCobertura("");
  };

  const handleEliminar = (idx) => {
    const nuevasCoberturas = coberturas.filter((_, i) => i !== idx);
    updateCoberturas(nuevasCoberturas);
  };

  const handleValorChange = (e) => {
    // Solo permite números y separador de miles
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setValorCobertura(numberWithThousandSeparators(raw));
  };

  return (
    <div>
      <h3>Agregar Coberturas</h3>
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Nombre de cobertura"
          value={nombreCobertura}
          onChange={(e) => setNombreCobertura(e.target.value)}
        />
        <input
          type="text"
          placeholder="Valor"
          value={valorCobertura}
          onChange={handleValorChange}
          inputMode="numeric"
        />
        <button type="button" onClick={handleAgregar}>
          Agregar
        </button>
      </div>
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Cobertura</th>
              <th style={{ textAlign: "right" }}>Valor</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {coberturas.map((cob, idx) => (
              <tr key={idx}>
                <td>{cob.nombre}</td>
                <td style={{ textAlign: "right" }}>${numberWithThousandSeparators(cob.valor)}</td>
                <td>
                  <button type="button" onClick={() => handleEliminar(idx)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {coberturas.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "#888" }}>
                  No hay coberturas agregadas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoberturasDinamicas;