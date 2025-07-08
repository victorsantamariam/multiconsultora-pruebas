import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShieldIcon from "@mui/icons-material/Shield";

export default function PdfPortada() {
  return (
    <Box sx={{
      p: 5,
      minHeight: "800px",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Typography variant="h5" align="center" fontWeight={700} sx={{ mb: 3 }}>
        RESUMEN PROPUESTA METLIFE
      </Typography>
      <Typography align="center" sx={{ mb: 4, maxWidth: 600 }}>
        Inicialmente son seguros que cubren muerte, invalidez (otras coberturas de seguro de vida) y también es una acumulación a mediano largo plazo y el retorno se realiza en los años estimados.
      </Typography>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        ¿Por qué MetLife?
      </Typography>
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4, maxWidth: 900 }}>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <PublicIcon sx={{ fontSize: 50, color: "#1976d2" }} />
            <Typography fontWeight={700}>Experiencia</Typography>
            <Typography sx={{ mt: 1 }}>
              Trayectoria global de 155 años en 43 países, y más de 10 años en Colombia.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <VerifiedUserIcon sx={{ fontSize: 50, color: "#43a047" }} />
            <Typography fontWeight={700}>Confianza</Typography>
            <Typography sx={{ mt: 1 }}>
              Cerca de 160 mil millones de pesos pagados en siniestros en los últimos 3 años.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <ShieldIcon sx={{ fontSize: 50, color: "#0277bd" }} />
            <Typography fontWeight={700}>Solidez financiera</Typography>
            <Typography sx={{ mt: 1 }}>
              Contamos con calificación AA otorgada por Fitch Ratings.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography align="center" sx={{ fontStyle: "italic", fontWeight: 500, mb: 3, maxWidth: 650 }}>
        Estas son las coberturas con las que iniciaría el tomador, cada año incrementan los valores con el IPC y de la misma forma la acumulación:
      </Typography>
      <Typography align="center" sx={{ maxWidth: 650 }}>
        A continuación, te detallo beneficios del producto PUFF MetLife que marcan gran diferencia respecto compañías con su misma actividad. (PUFF)
      </Typography>
    </Box>
  );
}