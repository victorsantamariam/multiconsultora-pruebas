import React from "react";
import { Box, Typography, Chip } from "@mui/material";

export default function TarjetaEcosistemaBienestar({ categoriaPoliza, tipoPoliza }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f8f9fa",
        border: "1px solid #e3f2fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#1976d2",
          mr: 2,
        }}
      >
        {tipoPoliza}
      </Typography>
      <Chip
        label={categoriaPoliza}
        size="small"
        sx={{
          background: "linear-gradient(45deg, #1abc9c, #16a085)",
          color: "white",
          fontWeight: 600,
        }}
      />
    </Box>
  );
}