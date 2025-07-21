import React from "react";
import { Box, TextField, Chip, Stack } from "@mui/material";
import { NumericFormat } from "react-number-format";

export default function CoberturasFijas({ value = [], onChange, opciones = [] }) {
  // value: [{nombre, valor}]
  const handleSelect = (nombre) => {
    if (!value.some(v => v.nombre === nombre)) {
      onChange([...value, {nombre, valor: ""}]);
    }
  };
  const handleRemove = (nombre) => {
    onChange(value.filter(v => v.nombre !== nombre));
  };
  const handleValorChange = (idx, val) => {
    const updated = [...value];
    updated[idx] = {...updated[idx], valor: val};
    onChange(updated);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {opciones.map(opcion => (
          <Chip
            key={opcion}
            label={opcion}
            color={value.some(v => v.nombre === opcion) ? "success" : "default"}
            onClick={() => handleSelect(opcion)}
            disabled={value.some(v => v.nombre === opcion)}
            sx={{ cursor: value.some(v => v.nombre === opcion) ? "not-allowed" : "pointer" }}
          />
        ))}
      </Box>

      {value.length > 0 && (
        <Stack spacing={2}>
          {value.map((cob, idx) => (
            <Stack direction="row" spacing={2} alignItems="center" key={cob.nombre}>
              <Chip
                label={cob.nombre}
                color="success"
                onDelete={() => handleRemove(cob.nombre)}
                sx={{ mb: 1 }}
              />
              <NumericFormat
                customInput={TextField}
                value={cob.valor || ""}
                onValueChange={v => handleValorChange(idx, v.value)}
                thousandSeparator="."
                decimalSeparator=","
                prefix="$ "
                fullWidth
                label="Valor asegurado"
              />
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}