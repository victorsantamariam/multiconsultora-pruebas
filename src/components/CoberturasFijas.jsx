import React from "react";
import { Box, Typography, Grid, TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

export default function CoberturasFijas({ value = [], onChange, opciones = [] }) {
  const handleValorChange = (idx, val) => {
    const updated = [...value];
    updated[idx] = { ...updated[idx], valor: val };
    onChange(updated);
  };

  const handleNombreChange = (idx, nombre) => {
    const updated = [...value];
    updated[idx] = { nombre, valor: updated[idx]?.valor || "" };
    onChange(updated);
  };

  // Asegura que value tenga una entrada por cada opción seleccionada
  React.useEffect(() => {
    const actual = value.map(v => v.nombre);
    const nuevos = opciones.filter(o => !actual.includes(o));
    if (nuevos.length) {
      onChange([
        ...value,
        ...nuevos.map(n => ({ nombre: n, valor: "" }))
      ]);
    }
    // eslint-disable-next-line
  }, [opciones]);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Coberturas fijas
      </Typography>
      <Grid container spacing={2}>
        {opciones.map((opcion, idx) => (
          <React.Fragment key={opcion}>
            <Grid item xs={7} sm={8}>
              <TextField
                fullWidth
                variant="outlined"
                value={value[idx]?.nombre || opcion}
                onChange={e => handleNombreChange(idx, e.target.value)}
                disabled
              />
            </Grid>
            <Grid item xs={5} sm={4}>
              <NumericFormat
                customInput={TextField}
                value={value[idx]?.valor || ""}
                onValueChange={v => handleValorChange(idx, v.value)}
                thousandSeparator="."
                decimalSeparator=","
                prefix="$ "
                fullWidth
                label="Valor asegurado"
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
}