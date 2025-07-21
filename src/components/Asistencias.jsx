import React from "react";
import { Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const asistenciasDisponibles = [
  "Asistencia odontológica de emergencia",
  "Auxilio gastos funerarios",
  "Conductor elegido",
  "Asistencia en viaje internacional",
  "Asistencia escolar",
  "Central médica y médico domiciliario",
  "Nutricional asistencia",
  "Asistencia médica",
  "Telefónica legal asistencia",
  "Telefónica informática asistencia",
];

export default function Asistencias({ seleccionadas, onChange }) {
  const handleToggle = (asistencia) => {
    if (seleccionadas.includes(asistencia)) {
      onChange(seleccionadas.filter(a => a !== asistencia));
    } else {
      onChange([...seleccionadas, asistencia]);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 750,
        margin: "32px auto 0 auto",
        background: "#fff",
        borderRadius: 3,
        boxShadow: "0 2px 24px #b7e4fc33",
        p: 4,
        mt: 4,
      }}
    >
       <FormGroup>
        {asistenciasDisponibles.map(asistencia => (
          <FormControlLabel
            key={asistencia}
            control={
              <Checkbox
                checked={seleccionadas.includes(asistencia)}
                onChange={() => handleToggle(asistencia)}
              />
            }
            label={asistencia}
          />
        ))}
      </FormGroup>
    </Box>
  );
}