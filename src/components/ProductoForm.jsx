import React from "react";
import { Box, Typography, Button, TextField, MenuItem, Stack } from "@mui/material";
import { NumericFormat } from "react-number-format";
import CoberturasFijas from "./CoberturasFijas";
import CoberturasDinamicas from "./CoberturasDinamicas";
import Asistencias from "./Asistencias";

// Opciones para el tipo de póliza
const opcionesPoliza = {
  VIDA: ["Vida 50", "Vida 60", "Vida 70", "Vida 80", "Vida 99"],
  PLAN_PROTECCION: [
    "Puf pesos A",
    "Puf pesos B",
    "Puf dólares",
    "Dotal 15 pagos",
    "Dotal 20 pagos",
    "Pensión",
    "Ap",
    "Ecosistema",
    "Temporal 50 años",
    "Temporal 60 años",
    "Temporal 70 años",
    "Temporal 80 años",
  ],
};

const opcionesCoberturasFijas = [
  "Desmembración por accidente",
  "Muerte por cualquier causa",
  "Exoneración de pago de primas",
  "Fractura de huesos y quemaduras graves",
  "Incapacidad total y permanente",
  "Reembolso por gastos médicos",
  "Renta diaria por hospitalización en uci por accidente o enfermedad",
  "Renta diaria por hospitalización por accidente o enfermedad",
  "Enfermedades graves",
  "cancer",
  "Muerte por accidente",
];

function ProductoForm({
  value,
  onChange,
  onSave,
  editing,
  onCancel,
}) {
  // Para campos anidados
  const updateField = (field, val) => {
    onChange({ ...value, [field]: val });
  };
  const updateNested = (parent, field, val) => {
    onChange({
      ...value,
      [parent]: {
        ...value[parent],
        [field]: val,
      },
    });
  };

  // Validación mínima (puedes hacerla más estricta)
  const datosCompletos =
    value.categoriaPoliza &&
    value.tipoPoliza &&
    value.cotizacion.primaMensual &&
    (value.coberturasFijas.some((c) => c.valor) ||
      value.coberturasLibres.length > 0) &&
    value.datosAdicionales.primaInversion &&
    value.datosAdicionales.totalInversion &&
    value.datosAdicionales.aniosAcumulacion &&
    value.datosAdicionales.valorAcumulado;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 3,
        boxShadow: "0 2px 24px #b7e4fc33",
        p: 4,
        mb: 4,
        maxWidth: 750,
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#1abc74",
          mb: 2,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {editing ? "Editar producto" : "Agregar un producto"}
      </Typography>
      {/* Selección de póliza */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          label="Categoría"
          value={value.categoriaPoliza || ""}
          onChange={e => {
            updateField("categoriaPoliza", e.target.value);
            updateField("tipoPoliza", "");
          }}
          fullWidth
          required
          InputProps={{ style: { minWidth: 220 } }}
        >
          <MenuItem value="">Selecciona una categoría</MenuItem>
          <MenuItem value="VIDA">VIDA</MenuItem>
          <MenuItem value="PLAN_PROTECCION">PLAN_PROTECCION</MenuItem>
        </TextField>
        <TextField
          select
          label="Tipo de póliza"
          value={value.tipoPoliza || ""}
          onChange={e => updateField("tipoPoliza", e.target.value)}
          fullWidth
          required
          disabled={!value.categoriaPoliza}
          InputProps={{ style: { minWidth: 220 } }}
        >
          <MenuItem value="">Selecciona un tipo</MenuItem>
          {value.categoriaPoliza &&
            opcionesPoliza[value.categoriaPoliza].map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
        </TextField>
      </Stack>
      {/* Cotización */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <NumericFormat
          customInput={TextField}
          label="Suma asegurada"
          value={value.cotizacion.sumaAsegurada}
          onValueChange={(values) =>
            updateNested("cotizacion", "sumaAsegurada", values.value)
          }
          thousandSeparator="."
          decimalSeparator=","
          prefix="$ "
          fullWidth
          required
        />
        <NumericFormat
          customInput={TextField}
          label="Prima mensual"
          value={value.cotizacion.primaMensual}
          onValueChange={(values) =>
            updateNested("cotizacion", "primaMensual", values.value)
          }
          thousandSeparator="."
          decimalSeparator=","
          prefix="$ "
          fullWidth
          required
        />
        <TextField
          label="Notas adicionales / Observaciones"
          value={value.cotizacion.notas}
          onChange={e => updateNested("cotizacion", "notas", e.target.value)}
          fullWidth
          multiline
          minRows={3}
        />
      </Stack>
      {/* Coberturas fijas y dinámicas */}
      <Box sx={{ mt: 3 }}>
        <CoberturasFijas
          value={value.coberturasFijas}
          onChange={cobs => updateField("coberturasFijas", cobs)}
          opciones={opcionesCoberturasFijas}
        />
        <Box sx={{ mt: 2 }}>
          <CoberturasDinamicas
            value={value.coberturasLibres}
            onChange={cobs => updateField("coberturasLibres", cobs)}
          />
        </Box>
      </Box>
      {/* Asistencias */}
      <Box sx={{ mt: 3 }}>
        <Asistencias
          seleccionadas={value.asistenciasSeleccionadas}
          onChange={asist => updateField("asistenciasSeleccionadas", asist)}
        />
      </Box>
      {/* Datos adicionales */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
        <NumericFormat
          customInput={TextField}
          label="Prima de Inversión Mensual"
          value={value.datosAdicionales.primaInversion}
          onValueChange={(values) =>
            updateNested("datosAdicionales", "primaInversion", values.value)
          }
          thousandSeparator="."
          decimalSeparator=","
          prefix="$ "
          fullWidth
        />
        <NumericFormat
          customInput={TextField}
          label="Total Inversión Mensual"
          value={value.datosAdicionales.totalInversion}
          thousandSeparator="."
          decimalSeparator=","
          prefix="$ "
          fullWidth
          disabled
        />
        <TextField
          type="number"
          label="Años (Acumulación)"
          value={value.datosAdicionales.aniosAcumulacion}
          onChange={e =>
            updateNested("datosAdicionales", "aniosAcumulacion", e.target.value)
          }
          fullWidth
        />
        <NumericFormat
          customInput={TextField}
          label="Valor Acumulado"
          value={value.datosAdicionales.valorAcumulado}
          onValueChange={(values) =>
            updateNested("datosAdicionales", "valorAcumulado", values.value)
          }
          thousandSeparator="."
          decimalSeparator=","
          prefix="$ "
          fullWidth
        />
      </Stack>
      {/* Botones */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="success"
          sx={{ px: 5, borderRadius: 2, fontWeight: 700, fontSize: 18, mr: 2 }}
          disabled={!datosCompletos}
          onClick={onSave}
        >
          {editing ? "Guardar cambios" : "Agregar producto"}
        </Button>
        {editing && (
          <Button
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: 18 }}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
      </Box>
      {!datosCompletos && (
        <Typography sx={{ color: "#aaa", mt: 2, fontSize: 15 }}>
          Completa todos los datos y agrega al menos una cobertura y los
          datos adicionales para continuar
        </Typography>
      )}
    </Box>
  );
}

export default ProductoForm;