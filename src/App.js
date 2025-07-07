import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Link,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  Divider
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import { NumericFormat } from "react-number-format";
import metlifeLogo from "./metlife-logo.png";
import asesoraFoto from "./asesora.jpg";
import CoberturasDinamicas from "./components/CoberturasDinamicas";
import html2pdf from "html2pdf.js";

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
    cedula: "",
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
    plazoPagos: "",
    retornoCapital: "",
    notas: ""
  });
  const [coberturasSeleccionadas, setCoberturasSeleccionadas] = useState([]);
  const [showResumen, setShowResumen] = useState(false);

  // Cliente
  const handleClienteChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };
  // Cotización
  const handleCotizacionChange = (e) => {
    setCotizacion({ ...cotizacion, [e.target.name]: e.target.value });
  };

  // Acciones de resumen/generar cotización
  const handleGenerarResumen = () => {
    setShowResumen(true);
    // Aquí podrías generar el PDF, enviar email, WhatsApp, etc.
  };

  const handleDescargarPDF = () => {
    const resumen = document.getElementById("resumen-cotizacion");
    if (resumen) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `Cotizacion_${cliente.nombre || "cliente"}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        })
        .from(resumen)
        .save();
    }
  };

  // Correos y WhatsApp: Descargar PDF y luego abrir enlace
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

  // Validación básica para mostrar el botón de resumen
  const datosCompletos =
    cliente.nombre &&
    tipoPoliza &&
    cotizacion.primaMensual &&
    coberturasSeleccionadas.length > 0;

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
        <Avatar
          src={asesoraFoto}
          alt={datosAsesora.nombre}
          sx={{
            width: 120,
            height: 120,
            border: "5px solid #17d4b6",
            boxShadow: "0 2px 16px #1abc7480"
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
          {datosAsesora.nombre}
        </Typography>
        <Typography sx={{ color: "#757575", fontSize: 20, mb: 1 }}>
          {datosAsesora.cargo}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 2
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <EmailIcon sx={{ color: "#17d4b6", mr: 0.5 }} />
            <Link
              href={`mailto:${datosAsesora.correo}`}
              sx={{ color: "#1976d2", fontSize: 16, fontWeight: 500 }}
              underline="hover"
            >
              {datosAsesora.correo}
            </Link>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PhoneIphoneIcon sx={{ color: "#17d4b6", ml: 2, mr: 0.5 }} />
            <Link
              href={`https://wa.me/${datosAsesora.celular.replace(/\D/g, "")}`}
              sx={{ color: "#1976d2", fontSize: 16, fontWeight: 500 }}
              underline="hover"
              target="_blank"
              rel="noopener"
            >
              {datosAsesora.celular}
            </Link>
          </Box>
        </Box>
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
                  label="Cédula"
                  name="cedula"
                  fullWidth
                  value={cliente.cedula}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                  inputProps={{ maxLength: 15 }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
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
                    setTipoPoliza(""); // Limpiar tipo al cambiar categoría
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
                <TextField
                  label="Plazo de pagos (años)"
                  name="plazoPagos"
                  fullWidth
                  value={cotizacion.plazoPagos}
                  onChange={handleCotizacionChange}
                  variant="outlined"
                  required
                  type="number"
                  inputProps={{ min: 1, max: 99 }}
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

          {/* BLOQUE DE COBERTURAS DINÁMICAS */}
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
            <CoberturasDinamicas
              value={coberturasSeleccionadas}
              onChange={setCoberturasSeleccionadas}
            />
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
                Completa todos los datos y agrega al menos una cobertura para continuar
              </Typography>
            )}
          </Box>
        </>
      )}

      {/* RESUMEN FINAL Y ACCIONES */}
      {showResumen && (
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
            <Avatar
              src={asesoraFoto}
              alt={datosAsesora.nombre}
              sx={{
                width: 76,
                height: 76,
                border: "3px solid #17d4b6",
                boxShadow: "0 2px 12px #1abc7480"
              }}
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
          {/* Datos del Cliente */}
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
                Cédula: {cliente.cedula || "-"}
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
              <Typography variant="body2">
                Plazo de pagos:{" "}
                <b>{cotizacion.plazoPagos || "-"} años</b>
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 3 }} />

          {/* Tabla de Coberturas */}
          <Typography
            variant="h6"
            sx={{ color: "#1abc74", mb: 2, fontWeight: 700 }}
          >
            Coberturas incluidas
          </Typography>
          <Box sx={{ overflowX: "auto", mb: 2 }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                fontFamily: "inherit",
                fontSize: 16
              }}
            >
              <thead style={{ background: "#e4f8f5" }}>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: 10,
                      textAlign: "left"
                    }}
                  >
                    Cobertura
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: 10,
                      textAlign: "center"
                    }}
                  >
                    Valor asegurado
                  </th>
                </tr>
              </thead>
              <tbody>
                {coberturasSeleccionadas.map((cob, idx) => (
                  <tr key={idx}>
                    <td style={{ border: "1px solid #eee", padding: 10 }}>
                      {cob.nombre}
                    </td>
                    <td
                      style={{
                        border: "1px solid #eee",
                        padding: 10,
                        textAlign: "center"
                      }}
                    >
                      {formatCurrency(cob.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Resumen de suma y prima */}
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

          {/* Notas */}
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

          {/* Datos de la asesora al pie */}
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={asesoraFoto}
              alt={datosAsesora.nombre}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {datosAsesora.nombre}
              </Typography>
              <Typography variant="body2">{datosAsesora.cargo}</Typography>
              <Typography variant="body2">
                <EmailIcon
                  sx={{
                    fontSize: 16,
                    verticalAlign: "middle"
                  }}
                />{" "}
                {datosAsesora.correo}
              </Typography>
              <Typography variant="body2">
                <PhoneIphoneIcon
                  sx={{
                    fontSize: 16,
                    verticalAlign: "middle"
                  }}
                />{" "}
                {datosAsesora.celular}
              </Typography>
            </Box>
          </Box>
          {/* Acciones finales */}
          <Box sx={{ display: "flex", gap: 2, mt: 5, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              color="info"
              sx={{ fontWeight: 700, flex: 1, minWidth: 170 }}
              onClick={handleDescargarPDF}
            >
              Descargar PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              color="primary"
              sx={{ fontWeight: 700, flex: 1, minWidth: 170 }}
              onClick={handleDescargarYEnviarCorreo}
            >
              Enviar por correo
            </Button>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
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
        </Box>
      )}
    </Box>
  );
}