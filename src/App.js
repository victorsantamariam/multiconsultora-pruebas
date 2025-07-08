import React, { useState } from "react";
import { Box, Typography, Button, Grid, Divider, TextField, MenuItem } from "@mui/material";
import { NumericFormat } from "react-number-format";
import metlifeLogo from "./metlife-logo.png";
import asesoraFoto from "./asesora.jpg";
import CoberturasDinamicas from "./components/CoberturasDinamicas";
import CoberturasFijas from "./components/CoberturasFijas";
import PdfPortada from "./components/PdfPortada";
import html2pdf from "html2pdf.js";
import "./App.css"; // Para los estilos Excel y .no-break

const datosAsesora = {
  nombre: "Juliana Arango",
  cargo: "Asesora",
  correo: "katherine.j.arango@metlife.com.co",
  celular: "+57 300 441 9025"
};

const opcionesPoliza = {
  VIDA: [
    "Vida 50",
    "Vida 60",
    "Vida 70",
    "Vida 80",
    "Vida 99"
  ],
  ECOSISTEMA: [
    "Puf pesos A",
    "Puf pesos B",
    "Puf dólares",
    "Dotal",
    "Pensión",
    "Ap",
    "Temporal"
  ]
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
  "Asistencia en viaje internacional",
  "Auxilio gastos funerarios",
  "asistencia médica",
  "conductor  elegido",
  "emergencia Odontologica",
  "Muerte por accidente",
  "asistencia en nutrición"
];

function formatCurrency(value) {
  if (!value) return "$ 0";
  return (
    "$ " +
    value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

export default function App() {
  const [cliente, setCliente] = useState({
    nombre: "",
    correo: "",
    celular: "",
    edad: "",
    genero: "",
    ciudad: ""
  });
  const [categoriaPoliza, setCategoriaPoliza] = useState("");
  const [tipoPoliza, setTipoPoliza] = useState("");
  const [cotizacion, setCotizacion] = useState({
    sumaAsegurada: "",
    primaMensual: "",
    retornoCapital: "",
    notas: ""
  });
  const [coberturasFijas, setCoberturasFijas] = useState([]);
  const [coberturasLibres, setCoberturasLibres] = useState([]);
  const [showResumen, setShowResumen] = useState(false);
  const [datosAdicionales, setDatosAdicionales] = useState({
    primaInversion: "",
    totalInversion: "",
    asistenciaViaje: "INCLUIDO",
    aniosAcumulacion: "",
    valorAcumulado: ""
  });
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const handleClienteChange = (e) => setCliente({ ...cliente, [e.target.name]: e.target.value });
  const handleCotizacionChange = (e) => setCotizacion({ ...cotizacion, [e.target.name]: e.target.value });
  const handleDatosAdicionalesChange = (name, value) => setDatosAdicionales(prev => ({ ...prev, [name]: value }));

  const handleGenerarResumen = () => setShowResumen(true);

  const handleDescargarPDF = async () => {
    setGenerandoPDF(true);
    // esperar a que el DOM actualice
    setTimeout(() => {
      const element = document.getElementById("pdf-content");
      html2pdf()
        .set({
          margin: 0.5,
          filename: `Cotizacion_${cliente.nombre || "cliente"}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        })
        .from(element)
        .save()
        .then(() => setGenerandoPDF(false));
    }, 150);
  };

  const handleDescargarYEnviarCorreo = () => {
    handleDescargarPDF();
    setTimeout(() => {
      alert("Adjunta el PDF descargado al correo.");
      handleEnviarCorreo();
    }, 2000);
  };

  const handleDescargarYEnviarWhatsApp = () => {
    handleDescargarPDF();
    setTimeout(() => {
      alert("Adjunta el PDF descargado al mensaje de WhatsApp.");
      handleEnviarWhatsApp();
    }, 2000);
  };

  const handleEnviarCorreo = () => {
    const subject = encodeURIComponent("Cotización de seguro MetLife");
    const body = encodeURIComponent(
      `Hola ${cliente.nombre},\n\nAdjunto encontrarás tu cotización de seguro.\n\nSaludos,\n${datosAsesora.nombre}`
    );
    window.open(`mailto:${cliente.correo}?subject=${subject}&body=${body}`);
  };

  const handleEnviarWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `Hola ${cliente.nombre}, te comparto la cotización de seguro MetLife.`
    );
    const celular = cliente.celular.replace(/\D/g, "") || "573004419025";
    window.open(`https://wa.me/${celular}?text=${mensaje}`);
  };

  const datosCompletos =
    cliente.nombre &&
    tipoPoliza &&
    cotizacion.primaMensual &&
    (
      coberturasFijas.some(c => c.valor) ||
      coberturasLibres.length > 0
    ) &&
    datosAdicionales.primaInversion &&
    datosAdicionales.totalInversion &&
    datosAdicionales.asistenciaViaje &&
    datosAdicionales.aniosAcumulacion &&
    datosAdicionales.valorAcumulado;

  const coberturasSeleccionadas = [
    ...coberturasFijas.filter(cob => cob.valor),
    ...coberturasLibres
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 20%, #e7f0fa 60%, #e0e7ef 100%)"
      }}
    >
      {/* ENCABEZADO Y ASESORA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "24px 32px 0 32px",
          justifyContent: "space-between"
        }}
      >
        <img
          src={metlifeLogo}
          alt="Metlife Logo"
          style={{ height: 48, width: "auto" }}
        />
        <Box sx={{ width: 48 }}></Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 3
        }}
      >
        <img
          src={asesoraFoto}
          alt={datosAsesora.nombre}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "5px solid #17d4b6",
            boxShadow: "0 2px 16px #1abc7480",
            objectFit: "cover"
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
          {datosAsesora.nombre}
        </Typography>
        <Typography sx={{ color: "#757575", fontSize: 20, mb: 1 }}>
          {datosAsesora.cargo}
        </Typography>
        <Typography sx={{ fontSize: 16, color: "#1976d2" }}>
          {datosAsesora.correo}
        </Typography>
        <Typography sx={{ fontSize: 16, color: "#1976d2" }}>
          {datosAsesora.celular}
        </Typography>
      </Box>

      {!showResumen && (
        <>
          {/* FORMULARIO DE DATOS DEL CLIENTE */}
          <Box
            sx={{
              maxWidth: 750,
              margin: "0 auto",
              background: "#fff",
              borderRadius: 3,
              boxShadow: "0 2px 24px #b7e4fc33",
              p: 4,
              mt: 3
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1abc74",
                mb: 2,
                fontWeight: 700,
                letterSpacing: 1
              }}
            >
              Datos del cliente
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre completo"
                  name="nombre"
                  fullWidth
                  value={cliente.nombre}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Correo electrónico"
                  name="correo"
                  type="email"
                  fullWidth
                  value={cliente.correo}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Celular"
                  name="celular"
                  fullWidth
                  value={cliente.celular}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Edad"
                  name="edad"
                  type="number"
                  fullWidth
                  value={cliente.edad}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Género"
                  name="genero"
                  fullWidth
                  value={cliente.genero}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                >
                  <MenuItem value="">Seleccione</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ciudad"
                  name="ciudad"
                  fullWidth
                  value={cliente.ciudad}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </Box>

          {/* SELECCIÓN DE PÓLIZA */}
          <Box
            sx={{
              maxWidth: 750,
              margin: "32px auto 0 auto",
              background: "#fff",
              borderRadius: 3,
              boxShadow: "0 2px 24px #b7e4fc33",
              p: 4
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1abc74",
                mb: 2,
                fontWeight: 700,
                letterSpacing: 1
              }}
            >
              Selecciona el tipo de póliza
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Categoría"
                  value={categoriaPoliza}
                  onChange={e => {
                    setCategoriaPoliza(e.target.value);
                    setTipoPoliza("");
                  }}
                  fullWidth
                  variant="outlined"
                  required
                >
                  <MenuItem value="">Selecciona una categoría</MenuItem>
                  <MenuItem value="VIDA">VIDA</MenuItem>
                  <MenuItem value="ECOSISTEMA">ECOSISTEMA</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Tipo de póliza"
                  value={tipoPoliza}
                  onChange={e => setTipoPoliza(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={!categoriaPoliza}
                >
                  <MenuItem value="">Selecciona un tipo</MenuItem>
                  {categoriaPoliza &&
                    opcionesPoliza[categoriaPoliza].map(opcion => (
                      <MenuItem key={opcion} value={opcion}>
                        {opcion}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* BLOQUE DE COTIZACIÓN */}
          <Box
            sx={{
              maxWidth: 750,
              margin: "32px auto 0 auto",
              background: "#fff",
              borderRadius: 3,
              boxShadow: "0 2px 24px #b7e4fc33",
              p: 4
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1abc74",
                mb: 2,
                fontWeight: 700,
                letterSpacing: 1
              }}
            >
              Datos de la cotización
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <NumericFormat
                  customInput={TextField}
                  label="Suma asegurada"
                  name="sumaAsegurada"
                  fullWidth
                  value={cotizacion.sumaAsegurada}
                  onValueChange={(values) =>
                    setCotizacion(cot => ({
                      ...cot,
                      sumaAsegurada: values.value
                    }))
                  }
                  variant="outlined"
                  required
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumericFormat
                  customInput={TextField}
                  label="Prima mensual"
                  name="primaMensual"
                  fullWidth
                  value={cotizacion.primaMensual}
                  onValueChange={(values) =>
                    setCotizacion(cot => ({
                      ...cot,
                      primaMensual: values.value
                    }))
                  }
                  variant="outlined"
                  required
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumericFormat
                  customInput={TextField}
                  label="Retorno de capital (si aplica)"
                  name="retornoCapital"
                  fullWidth
                  value={cotizacion.retornoCapital}
                  onValueChange={(values) =>
                    setCotizacion(cot => ({
                      ...cot,
                      retornoCapital: values.value
                    }))
                  }
                  variant="outlined"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notas adicionales / Observaciones"
                  name="notas"
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  value={cotizacion.notas}
                  onChange={handleCotizacionChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* BLOQUE DE COBERTURAS FIJAS Y DINÁMICAS */}
          <Box
            sx={{
              maxWidth: 750,
              margin: "32px auto 0 auto",
              background: "#fff",
              borderRadius: 3,
              boxShadow: "0 2px 24px #b7e4fc33",
              p: 4
            }}
          >
            <CoberturasFijas
              value={coberturasFijas}
              onChange={setCoberturasFijas}
              opciones={opcionesCoberturasFijas}
            />
            <Box sx={{ mt: 4 }}>
              <CoberturasDinamicas
                value={coberturasLibres}
                onChange={setCoberturasLibres}
              />
            </Box>
          </Box>

          {/* BLOQUE DE DATOS ADICIONALES */}
          <Box
            sx={{
              maxWidth: 750,
              margin: "32px auto 0 auto",
              background: "#fff",
              borderRadius: 3,
              boxShadow: "0 2px 24px #b7e4fc33",
              p: 4
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1abc74",
                mb: 2,
                fontWeight: 700,
                letterSpacing: 1
              }}
            >
              Datos adicionales de inversión
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <NumericFormat
                  customInput={TextField}
                  label="Prima de Inversión Mensual"
                  value={datosAdicionales.primaInversion}
                  onValueChange={(values) =>
                    handleDatosAdicionalesChange("primaInversion", values.value)
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <NumericFormat
                  customInput={TextField}
                  label="Total Inversión Mensual"
                  value={datosAdicionales.totalInversion}
                  onValueChange={(values) =>
                    handleDatosAdicionalesChange("totalInversion", values.value)
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Asistencia Viaje Internacional"
                  value={datosAdicionales.asistenciaViaje}
                  onChange={e =>
                    handleDatosAdicionalesChange("asistenciaViaje", e.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="INCLUIDO">Incluido</MenuItem>
                  <MenuItem value="NO INCLUIDO">No incluido</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Años (Acumulación de Capital)"
                  type="number"
                  value={datosAdicionales.aniosAcumulacion}
                  onChange={e =>
                    handleDatosAdicionalesChange("aniosAcumulacion", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <NumericFormat
                  customInput={TextField}
                  label="Valor Acumulado"
                  value={datosAdicionales.valorAcumulado}
                  onValueChange={(values) =>
                    handleDatosAdicionalesChange("valorAcumulado", values.value)
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="$ "
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* BOTÓN FINAL */}
          <Box
            sx={{
              maxWidth: 750,
              margin: "32px auto 40px auto",
              textAlign: "center"
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              sx={{
                px: 5,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 18
              }}
              disabled={!datosCompletos}
              onClick={handleGenerarResumen}
            >
              Generar cotización y compartir
            </Button>
            {!datosCompletos && (
              <Typography sx={{ color: "#aaa", mt: 2, fontSize: 15 }}>
                Completa todos los datos y agrega al menos una cobertura y los datos adicionales para continuar
              </Typography>
            )}
          </Box>
        </>
      )}

      {showResumen && (
        <div id="pdf-content">
          {generandoPDF && (
            <div style={{ marginBottom: 40 }}>
              <PdfPortada />
              <div style={{ pageBreakAfter: "always" }} />
            </div>
          )}
          <Box
            sx={{
              maxWidth: 900,
              margin: "32px auto 40px auto",
              background: "#fff",
              borderRadius: 5,
              boxShadow: "0 2px 32px #b7e4fc44",
              p: { xs: 2, md: 5 }
            }}
            id="resumen-cotizacion"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4
              }}
            >
              <Box>
                <img
                  src={metlifeLogo}
                  alt="Metlife Logo"
                  style={{ height: 38, marginBottom: 12 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Cotización de Seguro de Vida / Ecosistema
                </Typography>
              </Box>
              <img
                src={asesoraFoto}
                alt={datosAsesora.nombre}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  border: "3px solid #17d4b6",
                  boxShadow: "0 2px 12px #1abc7480",
                  objectFit: "cover"
                }}
              />
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={7}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#777", fontWeight: 700 }}
                >
                  Cliente:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {cliente.nombre}
                </Typography>
                <Typography variant="body2">
                  Correo: {cliente.correo || "-"}
                </Typography>
                <Typography variant="body2">
                  Celular: {cliente.celular || "-"}
                </Typography>
                <Typography variant="body2">
                  Edad: {cliente.edad || "-"} &nbsp;|&nbsp; Género:{" "}
                  {cliente.genero || "-"}
                </Typography>
                <Typography variant="body2">
                  Ciudad: {cliente.ciudad || "-"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#777", fontWeight: 700 }}
                >
                  Póliza:
                </Typography>
                <Typography variant="body2">
                  Categoría: <b>{categoriaPoliza}</b>
                </Typography>
                <Typography variant="body2">
                  Tipo: <b>{tipoPoliza}</b>
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 3 }} />

            {/* Tabla Coberturas EXCEL */}
            <Typography
              variant="h6"
              sx={{ color: "#1abc74", mb: 2, fontWeight: 700 }}
            >
              Coberturas incluidas
            </Typography>
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
              <table className="excel-table">
                <thead>
                  <tr>
                    <th>Cobertura</th>
                    <th style={{ textAlign: "right" }}>Valor asegurado</th>
                  </tr>
                </thead>
                <tbody>
                  {coberturasSeleccionadas.map((cob, idx) => (
                    <tr key={idx}>
                      <td>{cob.nombre}</td>
                      <td style={{ textAlign: "right" }}>{formatCurrency(cob.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Divider sx={{ mb: 3 }} />

            {/* BLOQUE VERDE - NO BREAK */}
            <Box
              className="no-break"
              sx={{
                background: "#aeea8c",
                borderRadius: 2,
                p: 2,
                mb: 3
              }}
            >
              <table style={{
                width: "100%",
                fontFamily: "inherit",
                fontSize: 17,
                background: "#aeea8c",
                borderRadius: "8px"
              }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, padding: 6 }}>
                      PRIMA DE INVERSIÓN MENSUAL
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        textAlign: "right",
                        padding: 6
                      }}
                    >
                      {formatCurrency(datosAdicionales.primaInversion)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: 6 }}>
                      TOTAL INVERSIÓN MENSUAL
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        textAlign: "right",
                        padding: 6
                      }}
                    >
                      {formatCurrency(datosAdicionales.totalInversion)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: 6 }}>
                      ASISTENCIA VIAJE INTERNACIONAL
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        textAlign: "right",
                        padding: 6
                      }}
                    >
                      {datosAdicionales.asistenciaViaje === "INCLUIDO"
                        ? "INCLUIDO"
                        : "NO INCLUIDO"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, padding: 6 }}>
                      ACUMULACIÓN DE CAPITAL CUANDO TU CUMPAS{" "}
                      {datosAdicionales.aniosAcumulacion
                        ? datosAdicionales.aniosAcumulacion
                        : "___"}{" "}
                      AÑOS
                    </td>
                    <td
                      style={{
                        fontWeight: 700,
                        textAlign: "right",
                        padding: 6
                      }}
                    >
                      {formatCurrency(datosAdicionales.valorAcumulado)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>

            {/* Suma asegurada y Prima mensual */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 6,
                mb: 2
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#888", fontWeight: 600 }}
                >
                  Suma asegurada total:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, fontSize: 20 }}
                >
                  {formatCurrency(cotizacion.sumaAsegurada)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#888", fontWeight: 600 }}
                >
                  Prima mensual:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#1abc74"
                  }}
                >
                  {formatCurrency(cotizacion.primaMensual)}
                </Typography>
              </Box>
            </Box>

            {cotizacion.notas && (
              <Box
                sx={{
                  background: "#f9fcfa",
                  borderRadius: 2,
                  p: 2,
                  mb: 2
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#1abc74" }}
                >
                  Notas/Observaciones:
                </Typography>
                <Typography variant="body2">
                  {cotizacion.notas}
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={asesoraFoto}
                alt={datosAsesora.nombre}
                style={{ width: 48, height: 48, borderRadius: "50%" }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {datosAsesora.nombre}
                </Typography>
                <Typography variant="body2">{datosAsesora.cargo}</Typography>
                <Typography variant="body2">{datosAsesora.correo}</Typography>
                <Typography variant="body2">{datosAsesora.celular}</Typography>
              </Box>
            </Box>
            {!generandoPDF && (
              <Box sx={{ display: "flex", gap: 2, mt: 5, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="info"
                  sx={{ fontWeight: 700, flex: 1, minWidth: 170 }}
                  onClick={handleDescargarPDF}
                >
                  Descargar PDF
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 700, flex: 1, minWidth: 170 }}
                  onClick={handleDescargarYEnviarCorreo}
                >
                  Enviar por correo
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ fontWeight: 700, flex: 1, minWidth: 170 }}
                  onClick={handleDescargarYEnviarWhatsApp}
                >
                  Enviar por WhatsApp
                </Button>
                <Button
                  variant="outlined"
                  sx={{ fontWeight: 700, flex: 1, minWidth: 170 }}
                  onClick={() => setShowResumen(false)}
                >
                  Editar datos
                </Button>
              </Box>
            )}
          </Box>
        </div>
      )}
    </Box>
  );
}