import React from "react";
import { Box, Typography } from "@mui/material";

export default function TarjetaEcosistemaBienestar({ children }) {
  return (
    <Box
      sx={{
        background: "#e8f4fd",
        border: "2px solid #2196f3",
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        my: 2,
        mx: "auto",
        maxWidth: 700,
        boxShadow: "0 2px 6px rgba(33,150,243,0.07)",
        fontSize: { xs: "0.96rem", md: "1.05rem" }
      }}
    >
      {children}
      <Typography
        variant="subtitle1"
        sx={{
          color: "#1976d2",
          fontWeight: 700,
          mb: 0.5,
          fontSize: { xs: "1rem", md: "1.1rem" }
        }}
      >
        Esta póliza incluye acceso a Ecosistema Bienestar:
      </Typography>
      <Typography sx={{ mb: 1, fontSize: "0.98em" }}>
        Accede a nuestra plataforma digital con servicios de:{" "}
        <b>SALUD A UN CLICK, BIENESTAR INTEGRAL y SALUD MENTAL.</b>
      </Typography>
      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 4,
          justifyContent: "flex-start",
        }}
      >
        <Box>
          <Typography sx={{ color: "#23946b", fontWeight: 700, mb: 0.5 }}>
            Salud a un click
          </Typography>
          <ul style={{ marginTop: 0, marginBottom: 5, paddingLeft: 18 }}>
            <li>Orientación veterinaria (video consulta)</li>
            <li>Internista (telemedicina)</li>
            <li>Enfermería (video consulta)</li>
            <li>Wikidoc (herramienta de consulta)</li>
            <li>Exámenes preventivos (herramienta)</li>
            <li>Nutrición (video consulta)</li>
            <li>Medicina General (telemedicina)</li>
            <li>Dermatólogo (telemedicina)</li>
            <li>Ginecólogo (telemedicina)</li>
            <li>Farmacia Digital (herramienta)</li>
            <li>Médico domiciliario (servicio físico)</li>
            <li>Exámenes de laboratorio (herramienta)</li>
            <li>Traslado Médico (servicio físico)</li>
          </ul>
          <Typography sx={{ color: "#23946b", fontWeight: 700, mb: 0.5 }}>
            Salud mental
          </Typography>
          <ul style={{ marginTop: 0, marginBottom: 5, paddingLeft: 18 }}>
            <li>Psicólogo (telemedicina)</li>
          </ul>
        </Box>
        <Box>
          <Typography sx={{ color: "#23946b", fontWeight: 700, mb: 0.5 }}>
            Bienestar integral
          </Typography>
          <ul style={{ marginTop: 0, marginBottom: 5, paddingLeft: 18 }}>
            <li>Yoga (clase por video)</li>
            <li>Pilates (clase por video)</li>
            <li>Entrenador Personal (clase por video)</li>
            <li>Mindfulness (video consulta)</li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
}