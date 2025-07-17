import React from "react";
import { Box, Typography, Button, TextField, MenuItem, Stack } from "@mui/material";
import { NumericFormat } from "react-number-format";
import CoberturasFijas from "./CoberturasFijas";
import CoberturasDinamicas from "./CoberturasDinamicas";
import Asistencias from "./Asistencias";

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

  // Validación mínima
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

  // Estilo para las tarjetas/secciones
  const tarjetaStyle = {
    background: "#fff",
    borderRadius: 3,
    boxShadow: "0 2px 24px #b7e4fc33",
    p: 4,
    maxWidth: 750,
    margin: "0 auto"
  };

  return (
    <Stack direction="column" spacing={3}>
      {/* SECCIÓN: Selección de tipo de póliza */}
      <Box sx={tarjetaStyle}>
        <Typography
          variant="h6"
          sx={{
            color: "#1abc74",
            mb: 2,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Selecciona el tipo de póliza
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Categoría"
            value={value.categoriaPoliza || ""}
            onChange={e => {
              onChange({
                ...value,
                categoriaPoliza: e.target.value,
                tipoPoliza: "",
              });
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
       {/* TARJETA ESPECIAL ECOSISTEMA: SOLO SI PLAN_PROTECCION + Ecosistema */}
  {value.categoriaPoliza === "PLAN_PROTECCION" && value.tipoPoliza === "Ecosistema" && (
    <Box sx={{
      background: "#e3f3fd",
      border: "2px solid #2196f3",
      borderRadius: 3,
      p: 3,
      mt: 3,
      mb: 2
    }}>
      <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 700, mb: 1 }}>
        Esta póliza incluye acceso a Ecosistema Bienestar:
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Accede a nuestra plataforma digital con servicios de: <b>SALUD A UN CLICK, BIENESTAR INTEGRAL y SALUD MENTAL.</b>
      </Typography>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        <div>
          <Typography sx={{ color: "#26b164", fontWeight: 700 }}>Salud a un click</Typography>
          <ul>
            <li>Orientación veterinaria (video consulta)</li>
            <li>Internista (telemedicina)</li>
            <li>Enfermería (video consulta)</li>
            <li>Wikidoc (Herramienta de consulta)</li>
            <li>Exámenes preventivos (Herramienta)</li>
            <li>Nutrición (video consulta)</li>
            <li>Medicina General (telemedicina)</li>
            <li>Dermatólogo (telemedicina)</li>
            <li>Ginecólogo (telemedicina)</li>
            <li>Farmacia Digital (Herramienta)</li>
            <li>Médico domiciliario (Servicio físico)</li>
            <li>Exámenes de laboratorio (Herramienta)</li>
            <li>Traslado Médico (Servicio físico)</li>
          </ul>
          <Typography sx={{ color: "#26b164", fontWeight: 700 }}>Salud mental</Typography>
          <ul>
            <li>Psicólogo (telemedicina)</li>
          </ul>
        </div>
        <div>
          <Typography sx={{ color: "#26b164", fontWeight: 700 }}>Bienestar integral</Typography>
          <ul>
            <li>Yoga (Clase por video)</li>
            <li>Pilates (Clase por video)</li>
            <li>Entrenador Personal (Clase por video)</li>
            <li>Mindfulness (video consulta)</li>
          </ul>
        </div>
      </div>
    </Box>
  )}
</Box>

      {/* SECCIÓN: Datos de la cotización */}
      <Box sx={tarjetaStyle}>
        <Typography
          variant="h6"
          sx={{
            color: "#1abc74",
            mb: 2,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Datos de la cotización
        </Typography>
        <Stack direction="row" spacing={2}>
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
      </Box>

      {/* SECCIÓN: Coberturas fijas y dinámicas */}
      <Box sx={tarjetaStyle}>
        <Typography variant="h6" sx={{ color: "#1abc74", mb: 2, fontWeight: 700 }}>
          Coberturas fijas
        </Typography>
        <CoberturasFijas 
          value={value.coberturasFijas}
          onChange={cobs => updateField("coberturasFijas", cobs)}
          opciones={opcionesCoberturasFijas}
        />
        <Typography variant="h6" sx={{ color: "#1abc74", mt: 3, mb: 2, fontWeight: 700 }}>
          Coberturas adicionales
        </Typography>
        <CoberturasDinamicas
          value={value.coberturasLibres}
          onChange={cobs => updateField("coberturasLibres", cobs)}
        />
      </Box>

      {/* SECCIÓN: Asistencias */}
      <Box sx={tarjetaStyle}>
        <Typography variant="h6" sx={{ color: "#1abc74", mb: 2, fontWeight: 700 }}>
          Asistencias
        </Typography>
        <Asistencias
          seleccionadas={value.asistenciasSeleccionadas}
          onChange={asist => updateField("asistenciasSeleccionadas", asist)}
        />
      </Box>

      {/* SECCIÓN: Datos adicionales de inversión */}
      <Box sx={tarjetaStyle}>
        <Typography variant="h6" sx={{ color: "#1abc74", mb: 2, fontWeight: 700 }}>
          Datos adicionales de inversión
        </Typography>
        <Stack direction="row" spacing={2}>
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
      </Box>

      {/* SECCIÓN: Botones */}
      <Box sx={{ ...tarjetaStyle, textAlign: "center" }}>
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
        {!datosCompletos && (
          <Typography sx={{ color: "#aaa", mt: 2, fontSize: 15 }}>
            Completa todos los datos y agrega al menos una cobertura y los
            datos adicionales para continuar
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

export default ProductoForm;