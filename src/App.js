import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Paper,
  Container,
  Grid,
  Avatar,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Tooltip
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  Security,
  AttachMoney,
  CalendarToday,
  Star,
  ArrowBack,
  GetApp,
  WhatsApp,
  Edit,
  Delete
} from "@mui/icons-material";
import metlifeLogo from "./metlife-logo.png";
import consultoras from "./data/consultoras";
import html2pdf from "html2pdf.js";
import ProductoForm from "./components/ProductoForm";
import TarjetaEcosistemaBienestar from "./components/TarjetaEcosistemaBienestar";

// Estado inicial de un producto
const initialProductState = {
  categoriaPoliza: "",
  tipoPoliza: "",
  cotizacion: {
    sumaAsegurada: "",
    primaMensual: "",
    notas: "",
  },
  coberturasFijas: [],
  coberturasLibres: [],
  asistenciasSeleccionadas: [],
  datosAdicionales: {
    primaInversion: "",
    totalInversion: "",
    aniosAcumulacion: "",
    valorAcumulado: "",
  },
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Consultora y cliente
  const [codigoConsultora, setCodigoConsultora] = useState("");
  const [consultora, setConsultora] = useState(null);
  const [errorCodigo, setErrorCodigo] = useState("");
  const [cliente, setCliente] = useState({
    nombre: "",
    correo: "",
    celular: "",
    edad: "",
    genero: "",
    ciudad: "",
  });

  // Productos
  const [productos, setProductos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formProducto, setFormProductoOriginal] = useState(initialProductState);

  // Proxy para actualizar el formulario
  const setFormProducto = (nuevoEstado) => {
    setFormProductoOriginal(nuevoEstado);
  };

  // Actualiza el total de inversión cuando cambian valores relevantes
  useEffect(() => {
    const primaMensual = Number(formProducto.cotizacion.primaMensual) || 0;
    const primaInversion = Number(formProducto.datosAdicionales.primaInversion) || 0;
    const total = primaMensual + primaInversion;
    if (formProducto.datosAdicionales.totalInversion !== total) {
      setFormProducto((prev) => ({
        ...prev,
        datosAdicionales: {
          ...prev.datosAdicionales,
          totalInversion: total,
        },
      }));
    }
  }, [formProducto.cotizacion.primaMensual, formProducto.datosAdicionales.primaInversion]);

  // Manejo de código de consultora
  const handleCodigoSubmit = (e) => {
    e.preventDefault();
    const encontrada = consultoras.find(
      (c) => c.codigo === codigoConsultora.trim()
    );
    if (encontrada) {
      setConsultora(encontrada);
      setErrorCodigo("");
    } else {
      setConsultora(null);
      setErrorCodigo("Código incorrecto. Intenta de nuevo.");
    }
  };

  // Handlers cliente
  const handleClienteChange = (e) =>
    setCliente({ ...cliente, [e.target.name]: e.target.value });

  // Guardar o editar producto
  const handleSaveProducto = () => {
    if (editingIndex !== null) {
      // Editar
      const nuevos = [...productos];
      nuevos[editingIndex] = formProducto;
      setProductos(nuevos);
      setEditingIndex(null);
    } else {
      // Agregar
      setProductos([...productos, formProducto]);
    }
    setFormProducto(initialProductState);
  };

  // Editar producto
  const handleEditProducto = (idx) => {
    setFormProducto(productos[idx]);
    setEditingIndex(idx);
  };

  // Eliminar producto
  const handleDeleteProducto = (idx) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      setProductos(productos.filter((_, i) => i !== idx));
      if (editingIndex === idx) {
        setFormProducto(initialProductState);
        setEditingIndex(null);
      }
    }
  };

  // PDF y compartir
  const [showResumen, setShowResumen] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const handleDescargarPDF = async () => {
    setGenerandoPDF(true);
    setTimeout(() => {
      const element = document.getElementById("pdf-content");
      html2pdf()
        .set({
          margin: 0,
          filename: `Cotizacion_${cliente.nombre || "cliente"}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "px", format: [794, 1122], orientation: "portrait" },
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
      `Hola ${cliente.nombre},\n\nAdjunto encontrarás tu cotización de seguro.\n\n¡Saludos!,\n${consultora?.nombre || "Asesora"}`
    );
    window.open(`mailto:${cliente.correo}?subject=${subject}&body=${body}`);
  };

  const handleEnviarWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `Hola ${cliente.nombre}, te comparto la cotización de seguro MetLife. 🛡️✨`
    );
    const celularLimpio = cliente.celular.replace(/\D/g, "");
    if (celularLimpio) {
      window.open(`https://wa.me/${celularLimpio}?text=${mensaje}`);
    } else {
      alert("El cliente no tiene número de celular registrado.");
    }
  };

  // Validación para generar PDF (al menos un producto y datos de cliente)
  const datosCompletos =
    cliente.nombre &&
    cliente.correo &&
    cliente.celular &&
    cliente.edad &&
    cliente.genero &&
    cliente.ciudad &&
    productos.length > 0;

  // Calcular total de la cotización
  const calcularTotal = () => {
    return productos.reduce((total, producto) => {
      const primaMensual = Number(producto.cotizacion.primaMensual) || 0;
      const primaInversion = Number(producto.datosAdicionales.primaInversion) || 0;
      return total + primaMensual + primaInversion;
    }, 0);
  };

  // Calcular total mensual de cada producto
  const calcularProductoTotal = (producto) => {
    const primaMensual = Number(producto.cotizacion.primaMensual) || 0;
    const primaInversion = Number(producto.datosAdicionales.primaInversion) || 0;
    return primaMensual + primaInversion;
  };

  // Calcular total acumulado de todos los productos
  const calcularTotalAcumulado = () => {
    return productos.reduce((total, producto) => {
      const acumulado = Number(producto.datosAdicionales.valorAcumulado) || 0;
      return total + acumulado;
    }, 0);
  };

  // FORMULARIO DE CONSULTORA
  if (!consultora) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              minWidth: { xs: "90%", sm: 400 },
              maxWidth: 500,
              textAlign: "center",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <img
                src={metlifeLogo}
                alt="MetLife Logo"
                style={{ height: 60, marginBottom: 16 }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Cotizador Digital
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                Ingresa tu código de consultora para continuar
              </Typography>
            </Box>

            <form onSubmit={handleCodigoSubmit}>
              <TextField
                label="Código de Consultora"
                value={codigoConsultora}
                onChange={(e) => setCodigoConsultora(e.target.value)}
                fullWidth
                variant="outlined"
                autoFocus
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Business sx={{ color: "action.active", mr: 1 }} />,
                }}
              />
              {errorCodigo && (
                <Typography sx={{ color: "error.main", mb: 2 }}>
                  {errorCodigo}
                </Typography>
              )}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                size="large"
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 16,
                  py: 1.5,
                }}
              >
                Acceder al Sistema
              </Button>
            </form>
          </Paper>
        </Fade>
      </Box>
    );
  }

  // =========== RENDER PRINCIPAL ==============
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* HEADER MEJORADO */}
      <Paper
        elevation={4}
        sx={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: 0,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img
                src={metlifeLogo}
                alt="MetLife Logo"
                style={{ height: isMobile ? 40 : 50 }}
              />
              <Avatar
                src={consultora.foto}
                alt={consultora.nombre}
                sx={{
                  width: 44,
                  height: 44,
                  ml: 2,
                  border: "3px solid #1976d2",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#222", ml: 1 }}>
                {consultora.nombre}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setConsultora(null)}
              sx={{ textTransform: "none" }}
            >
              Cambiar consultora
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* PERFIL CONSULTORA MEJORADO */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={8}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 4,
              p: 3,
              mb: 4,
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: 3,
              }}
            >
              <Avatar
                src={consultora.foto}
                alt={consultora.nombre}
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  border: "4px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
              />
              <Box sx={{ textAlign: { xs: "center", md: "left" }, flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {consultora.nombre}
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                  {consultora.cargo}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ fontSize: 20 }} />
                    <Typography>{consultora.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Phone sx={{ fontSize: 20 }} />
                    <Typography>{consultora.telefono}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Cotización - Productos Agregados */}
        {!showResumen && (
          <Container maxWidth="lg" sx={{ pb: 4 }}>
            <Grid container spacing={3}>
              {/* DATOS DEL CLIENTE */}
              <Grid item xs={12}>
                <Slide direction="up" in={true} timeout={600}>
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    }}
                  >
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #1abc9c 0%, #16a085 100%)",
                        color: "white",
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Person sx={{ fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Información del Cliente
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Nombre completo"
                            name="nombre"
                            fullWidth
                            value={cliente.nombre}
                            onChange={handleClienteChange}
                            variant="outlined"
                            required
                            InputProps={{
                              startAdornment: <Person sx={{ color: "action.active", mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Correo electrónico"
                            name="correo"
                            type="email"
                            fullWidth
                            value={cliente.correo}
                            onChange={handleClienteChange}
                            variant="outlined"
                            required
                            InputProps={{
                              startAdornment: <Email sx={{ color: "action.active", mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Número de celular"
                            name="celular"
                            fullWidth
                            value={cliente.celular}
                            onChange={handleClienteChange}
                            variant="outlined"
                            required
                            InputProps={{
                              startAdornment: <Phone sx={{ color: "action.active", mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Edad"
                            name="edad"
                            type="number"
                            value={cliente.edad}
                            onChange={handleClienteChange}
                            variant="outlined"
                            required
                            inputProps={{ min: 0, max: 100 }}
                            InputProps={{
                              startAdornment: <CalendarToday sx={{ color: "action.active", mr: 1 }} />,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="Género"
                            name="genero"
                            value={cliente.genero}
                            onChange={handleClienteChange}
                            variant="outlined"
                            required
                            fullWidth
                          >
                            <MenuItem value="">Seleccione</MenuItem>
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Femenino">Femenino</MenuItem>
                            <MenuItem value="Otro">Otro</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Ciudad"
                            name="ciudad"
                            value={cliente.ciudad}
                            onChange={handleClienteChange}
                            variant="outlined"
                            required
                            fullWidth
                            InputProps={{
                              startAdornment: <LocationOn sx={{ color: "action.active", mr: 1 }} />,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Paper>
                </Slide>
              </Grid>

              {/* FORMULARIO DE PRODUCTOS */}
              <Grid item xs={12}>
                <Slide direction="up" in={true} timeout={800}>
                  <Paper elevation={6} sx={{ borderRadius: 3 }}>
                    <ProductoForm
                      value={formProducto}
                      onChange={setFormProducto}
                      onSave={handleSaveProducto}
                      editing={editingIndex !== null}
                      onCancel={() => {
                        setFormProducto(initialProductState);
                        setEditingIndex(null);
                      }}
                    />
                  </Paper>
                </Slide>
              </Grid>

              {/* PRODUCTOS AGREGADOS */}
              <Grid item xs={12}>
                <Slide direction="up" in={true} timeout={1000}>
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                        color: "white",
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Security sx={{ fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Productos en la Cotización
                      </Typography>
                      <Chip
                        label={productos.length}
                        sx={{
                          background: "rgba(255,255,255,0.2)",
                          color: "white",
                          fontWeight: 700,
                          ml: "auto",
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      {productos.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 6 }}>
                          <Security sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                          <Typography variant="h6" sx={{ color: "text.disabled", mb: 1 }}>
                            No hay productos agregados
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Agrega productos usando el formulario anterior
                          </Typography>
                        </Box>
                      ) : (
                        <Grid container spacing={2}>
                          {productos.map((prod, idx) => (
                            <Grid item xs={12} key={idx}>
                              <Fade in={true} timeout={300 * (idx + 1)}>
                                <Card
                                  elevation={2}
                                  sx={{
                                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                                    borderRadius: 2,
                                    border: "1px solid #e0e0e0",
                                  }}
                                >
                                  <CardContent>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: 2,
                                      }}
                                    >
                                      <Box sx={{ flex: 1 }}>
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            fontWeight: 700,
                                            color: "primary.main",
                                            mb: 1,
                                          }}
                                        >
                                          {prod.tipoPoliza}
                                        </Typography>
                                        {prod.categoriaPoliza === "PLAN_PROTECCION" && prod.tipoPoliza === "Ecosistema Bienestar" ? (
  <TarjetaEcosistemaBienestar>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2" }}>
        {prod.tipoPoliza}
      </Typography>
      <Chip
        label={prod.categoriaPoliza}
        size="small"
        sx={{
          background: "linear-gradient(45deg, #1abc9c, #16a085)",
          color: "white",
          fontWeight: 600,
          mb: 1,
        }}
      />
    </Box>
  </TarjetaEcosistemaBienestar>
) : (
  <>
    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2" }}>
      {prod.tipoPoliza}
    </Typography>
    <Chip
      label={prod.categoriaPoliza}
      size="small"
      sx={{
        background: "linear-gradient(45deg, #1abc9c, #16a085)",
        color: "white",
        fontWeight: 600,
        mb: 1,
      }}
    />
  </>
)}

<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <AttachMoney sx={{ color: "success.main", fontSize: 20 }} />
    <Typography variant="body2">
      <strong>Prima:</strong> {formatCurrency(prod.cotizacion.primaMensual)}
    </Typography>
  </Box>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Security sx={{ color: "info.main", fontSize: 20 }} />
    <Typography variant="body2">
      <strong>Suma:</strong> {formatCurrency(prod.cotizacion.sumaAsegurada)}
    </Typography>
  </Box>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Star sx={{ color: "#764ba2", fontSize: 20 }} />
    <Typography variant="body2" sx={{ color: "#764ba2", fontWeight: 600 }}>
      <strong>Total Mensual:</strong> {formatCurrency(calcularProductoTotal(prod))}
    </Typography>
  </Box>
</Box>
                                        {/* Años acumulados */}
                                        {prod.datosAdicionales.aniosAcumulacion && (
                                          <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                            <CalendarToday sx={{ color: "#1976d2", fontSize: 22, mr: 1 }} />
                                            <Typography variant="body1" sx={{ color: "#1976d2", fontWeight: 700 }}>
                                              Años Acumulados: {prod.datosAdicionales.aniosAcumulacion}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          startIcon={<Edit />}
                                          onClick={() => handleEditProducto(idx)}
                                          sx={{ textTransform: "none" }}
                                        >
                                          Editar
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          color="error"
                                          size="small"
                                          startIcon={<Delete />}
                                          onClick={() => handleDeleteProducto(idx)}
                                          sx={{ textTransform: "none" }}
                                        >
                                          Eliminar
                                        </Button>
                                      </Box>
                                    </Box>
                                    {/* Coberturas */}
                                    {(prod.coberturasFijas.length > 0 || prod.coberturasLibres.length > 0) && (
                                      <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                          Coberturas Incluidas
                                        </Typography>
                                        <Grid container spacing={1}>
                                          {[...prod.coberturasFijas, ...prod.coberturasLibres].map((cobertura, cobIdx) => (
                                            <Grid item xs={12} sm={6} md={4} key={cobIdx}>
                                              <Chip
                                                label={`${cobertura.nombre}${cobertura.valor ? ` — ${formatCurrency(cobertura.valor)}` : ""}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                  borderColor: "primary.main",
                                                  color: "primary.main",
                                                  fontWeight: 500,
                                                }}
                                              />
                                            </Grid>
                                          ))}
                                        </Grid>
                                      </Box>
                                    )}
                                    {/* Asistencias */}
                                    {prod.asistenciasSeleccionadas.length > 0 && (
                                      <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                          Asistencias Incluidas
                                        </Typography>
                                        <Grid container spacing={1}>
                                          {prod.asistenciasSeleccionadas.map((asistencia, asistIdx) => (
                                            <Grid item xs={12} sm={6} md={4} key={asistIdx}>
                                              <Chip
                                                label={asistencia.nombre || asistencia}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                  borderColor: "success.main",
                                                  color: "success.main",
                                                  fontWeight: 500,
                                                }}
                                              />
                                            </Grid>
                                          ))}
                                        </Grid>
                                      </Box>
                                    )}
                                    {/* Notas */}
                                    {prod.cotizacion.notas && (
                                      <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                          Notas Adicionales
                                        </Typography>
                                        <Paper
                                          elevation={1}
                                          sx={{
                                            p: 2,
                                            background: "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)",
                                            borderRadius: 2,
                                          }}
                                        >
                                          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                                            {prod.cotizacion.notas}
                                          </Typography>
                                        </Paper>
                                      </Box>
                                    )}
                                  </CardContent>
                                </Card>
                              </Fade>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </CardContent>
                  </Paper>
                </Slide>
              </Grid>

              {/* BOTÓN GENERAR COTIZACIÓN */}
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Star />}
                    disabled={!datosCompletos}
                    onClick={() => setShowResumen(true)}
                    sx={{
                      background: datosCompletos
                        ? "linear-gradient(45deg, #e74c3c 0%, #c0392b 100%)"
                        : "linear-gradient(45deg, #bdc3c7 0%, #95a5a6 100%)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 18,
                      px: 6,
                      py: 2,
                      borderRadius: 3,
                      textTransform: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      "&:hover": {
                        background: datosCompletos
                          ? "linear-gradient(45deg, #c0392b 0%, #a93226 100%)"
                          : "linear-gradient(45deg, #bdc3c7 0%, #95a5a6 100%)",
                      },
                    }}
                  >
                    Generar Cotización y Compartir
                  </Button>
                  {!datosCompletos && (
                    <Typography sx={{ color: "text.secondary", mt: 2, fontSize: 15 }}>
                      Completa los datos del cliente y agrega al menos un producto para continuar
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        )}

        {/* ======================== RESUMEN PDF MEJORADO ============================== */}
        {showResumen && (
          <Fade in={true} timeout={600}>
            <div>
              {/* CONTROLES DE NAVEGACIÓN */}
              <Paper
                elevation={4}
                sx={{
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  borderRadius: 3,
                  p: 2,
                  mb: 3,
                  "@media print": { display: "none" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => setShowResumen(false)}
                    sx={{ textTransform: "none" }}
                  >
                    Volver al Formulario
                  </Button>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Tooltip title="Descargar PDF">
                      <Button
                        variant="contained"
                        startIcon={<GetApp />}
                        onClick={handleDescargarPDF}
                        disabled={generandoPDF}
                        sx={{
                          background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                          textTransform: "none",
                        }}
                      >
                        {generandoPDF ? "Generando..." : "Descargar PDF"}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Enviar por correo">
                      <Button
                        variant="contained"
                        startIcon={<Email />}
                        onClick={handleDescargarYEnviarCorreo}
                        sx={{
                          background: "linear-gradient(45deg, #FF9800, #F57C00)",
                          textTransform: "none",
                        }}
                      >
                        Enviar Correo
                      </Button>
                    </Tooltip>
                    <Tooltip title="Compartir por WhatsApp">
                      <Button
                        variant="contained"
                        startIcon={<WhatsApp />}
                        onClick={handleDescargarYEnviarWhatsApp}
                        sx={{
                          background: "linear-gradient(45deg, #4CAF50, #45a049)",
                          textTransform: "none",
                        }}
                      >
                        WhatsApp
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>

              {/* CONTENIDO DEL PDF */}
              <div id="pdf-content" style={{ margin: 0, padding: 0 }}>
                {/* CABECERA PDF CON CONSULTORA */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 4,
                    background: "linear-gradient(135deg, #ffffff 0%, #e3e7ed 100%)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={metlifeLogo}
                      alt="MetLife Logo"
                      style={{ height: 50, marginRight: 16 }}
                    />
                    <Avatar
                      src={consultora.foto}
                      alt={consultora.nombre}
                      sx={{
                        width: 66,
                        height: 66,
                        border: "3px solid #1976d2",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#222" }}>
                        {consultora.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#555" }}>
                        {consultora.cargo}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                        color: "#222", // Color negro
                        textShadow: "0 2px 4px rgba(0,0,0,0.08)",
                      }}
                    >
                      COTIZACIÓN DE SEGUROS
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#333", mb: 1 }}>
                      MetLife Colombia
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#555" }}>
                      {new Date().toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  {/* INFORMACIÓN DEL CLIENTE */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "primary.main",
                        borderBottom: "2px solid",
                        borderColor: "primary.main",
                        pb: 1,
                      }}
                    >
                      Información del Cliente
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {cliente.nombre}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                {cliente.edad} años • {cliente.genero}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Email sx={{ color: "action.active", fontSize: 20 }} />
                              <Typography variant="body2">{cliente.correo}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Phone sx={{ color: "action.active", fontSize: 20 }} />
                              <Typography variant="body2">{cliente.celular}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocationOn sx={{ color: "action.active", fontSize: 20 }} />
                              <Typography variant="body2">{cliente.ciudad}</Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* PRODUCTOS COTIZADOS */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "primary.main",
                        borderBottom: "2px solid",
                        borderColor: "primary.main",
                        pb: 1,
                      }}
                    >
                      Productos Cotizados
                    </Typography>
                    <Grid container spacing={3}>
                      {productos.map((producto, idx) => (
                        <Grid item xs={12} key={idx}>
                          <Card
                            elevation={4}
                            sx={{
                              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                              borderRadius: 3,
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mb: 2,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 700, color: "primary.main" }}
                                >
                                  {producto.tipoPoliza}
                                </Typography>
                                <Chip
                                  label={producto.categoriaPoliza}
                                  sx={{
                                    background: "linear-gradient(45deg, #1abc9c, #16a085)",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>

                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <Paper
                                    elevation={1}
                                    sx={{
                                      p: 2,
                                      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                                      borderRadius: 2,
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                      Suma Asegurada
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                                      {formatCurrency(producto.cotizacion.sumaAsegurada)}
                                    </Typography>
                                  </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Paper
                                    elevation={1}
                                    sx={{
                                      p: 2,
                                      background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                                      borderRadius: 2,
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                      Prima Mensual
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                                      {formatCurrency(producto.cotizacion.primaMensual)}
                                    </Typography>
                                  </Paper>
                                </Grid>
                                {producto.datosAdicionales.primaInversion && (
                                  <Grid item xs={12} md={4}>
                                    <Paper
                                      elevation={1}
                                      sx={{
                                        p: 2,
                                        background: "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
                                        borderRadius: 2,
                                      }}
                                    >
                                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                                        Prima Inversión
                                      </Typography>
                                      <Typography variant="h6" sx={{ fontWeight: 700, color: "warning.main" }}>
                                        {formatCurrency(producto.datosAdicionales.primaInversion)}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                )}
                                
                                <Grid item xs={12} md={12}>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 2,
                                      mt: 2,
                                      background: "#f9f9f9",
                                      borderRadius: 2,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end"
                                    }}
                                  >
                                    <Star sx={{ color: "#764ba2", fontSize: 22, mr: 1 }} />
                                    <Typography variant="body1" sx={{ color: "#764ba2", fontWeight: 700 }}>
                                      Valor Mensual del Producto: {formatCurrency(calcularProductoTotal(producto))}
                                    </Typography>
                                  </Paper>
                                </Grid>
                                {/* Años acumulados */}
                                {producto.datosAdicionales.aniosAcumulacion && (
                                  <Grid item xs={12} md={12}>
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        p: 2,
                                        mt: 1,
                                        background: "#e3f2fd",
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                      }}
                                    >
                                      <CalendarToday sx={{ color: "#1976d2", fontSize: 22, mr: 1 }} />
                                      <Typography variant="body1" sx={{ color: "#1976d2", fontWeight: 700 }}>
                                        Años Acumulados: {producto.datosAdicionales.aniosAcumulacion}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                )}
                              </Grid>

                              {/* Coberturas */}
                              {(producto.coberturasFijas.length > 0 || producto.coberturasLibres.length > 0) && (
                                <Box sx={{ mt: 3 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Coberturas Incluidas
                                  </Typography>
                                  
                                  <Grid container spacing={1}>
                                    {[...producto.coberturasFijas, ...producto.coberturasLibres].map((cobertura, cobIdx) => (
                                      <Grid item xs={12} sm={6} md={4} key={cobIdx}>
                                        <Chip
                                          label={`${cobertura.nombre}${cobertura.valor ? ` — ${formatCurrency(cobertura.valor)}` : ""}`}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            borderColor: "primary.main",
                                            color: "primary.main",
                                            fontWeight: 500,
                                          }}
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Box>
                              )}
                              {producto.categoriaPoliza === "PLAN_PROTECCION" && producto.tipoPoliza === "Ecosistema Bienestar" && (
                                <TarjetaEcosistemaBienestar />
                              )}
                              {/* Asistencias */}
                              {producto.asistenciasSeleccionadas.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Asistencias Incluidas
                                  </Typography>
                                  <Grid container spacing={1}>
                                    {producto.asistenciasSeleccionadas.map((asistencia, asistIdx) => (
                                      <Grid item xs={12} sm={6} md={4} key={asistIdx}>
                                        <Chip
                                          label={asistencia.nombre || asistencia}
                                          size="small"
                                          variant="outlined"
                                          sx={{
                                            borderColor: "success.main",
                                            color: "success.main",
                                            fontWeight: 500,
                                          }}
                                        />
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Box>
                              )}

                              {/* Notas */}
                              {producto.cotizacion.notas && (
                                <Box sx={{ mt: 3 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    Notas Adicionales
                                  </Typography>
                                  <Paper
                                    elevation={1}
                                    sx={{
                                      p: 2,
                                      background: "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)",
                                      borderRadius: 2,
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                                      {producto.cotizacion.notas}
                                    </Typography>
                                  </Paper>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* RESUMEN TOTAL */}
                  <Box sx={{ mt: 4 }}>
                    <Paper
                      elevation={6}
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                          Total Mensual de la Cotización
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          {formatCurrency(calcularTotal())}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                          *Valor corresponde a la suma de todas las primas mensuales
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>

                  {/* TOTAL ACUMULACION DE CAPITAL */}
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}>
                      Total Acumulación de Capital
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: "#21926f",
                        mb: 1,
                        textShadow: "0 2px 4px rgba(0,0,0,0.09)",
                      }}
                    >
                      {formatCurrency(calcularTotalAcumulado())}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                      *Suma total acumulada por todos los productos cotizados
                    </Typography>
                  </Box>

                  {/* DATOS DE LA CONSULTORA AL FINAL */}
                  <Box sx={{ mt: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "primary.main",
                        borderBottom: "2px solid",
                        borderColor: "primary.main",
                        pb: 1,
                      }}
                    >
                      Consultora Responsable
                    </Typography>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        maxWidth: 420,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        src={consultora.foto}
                        alt={consultora.nombre}
                        sx={{
                          width: 60,
                          height: 60,
                          border: "3px solid #1976d2",
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {consultora.nombre}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {consultora.cargo}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Email sx={{ color: "action.active", fontSize: 20 }} />
                            <Typography variant="body2">{consultora.email}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Phone sx={{ color: "action.active", fontSize: 20 }} />
                            <Typography variant="body2">{consultora.telefono}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </Box>

                  {/* TÉRMINOS Y CONDICIONES */}
                  <Box sx={{ mt: 4, p: 3, background: "#f8f9fa", borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Términos y Condiciones
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • Esta cotización tiene una validez de 30 días a partir de la fecha de emisión.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • Los valores están sujetos a aprobación médica y pueden variar según el perfil de riesgo del asegurado.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • Para mayor información sobre coberturas, exclusiones y condiciones generales, consulte la póliza correspondiente.
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      • Esta cotización no constituye una oferta de seguro ni genera obligación alguna para MetLife.
                    </Typography>
                  </Box>

                  {/* FOOTER */}
                  <Box sx={{ mt: 4, textAlign: "center", py: 2 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      MetLife Colombia - Protegiendo lo que más importa
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                      www.metlife.com.co | Línea de atención: 01 8000 915 303
                    </Typography>
                  </Box>
                </CardContent>
              </div>
            </div>
          </Fade>
        )}
      </Container>
    </Box>
  );
}