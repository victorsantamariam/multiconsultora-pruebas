import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Stack
} from "@mui/material";
import metlifeLogo from "./metlife-logo.png";
import consultoras from "./data/consultoras";
import html2pdf from "html2pdf.js";
import PdfPortada from "./components/PdfPortada";
import ProductoForm from "./components/ProductoForm";

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

// Formato moneda
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
    // Solo actualiza si el total es diferente
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
      // Si estaba editando este, limpia el form
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
      `Hola ${cliente.nombre},\n\nAdjunto encontrarás tu cotización de seguro.\n\nSaludos,\n${consultora?.nombre || "Asesora"}`
    );
    window.open(`mailto:${cliente.correo}?subject=${subject}&body=${body}`);
  };

  const handleEnviarWhatsApp = () => {
    const mensaje = encodeURIComponent(
      `Hola ${cliente.nombre}, te comparto la cotización de seguro MetLife.`
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

  // FORMULARIO DE CONSULTORA
  if (!consultora) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "radial-gradient(circle at 50% 20%, #e7f0fa 60%, #e0e7ef 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            background: "#fff",
            borderRadius: 3,
            boxShadow: "0 2px 24px #b7e4fc33",
            p: 4,
            minWidth: 320,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 2, color: "#1976d2" }}
          >
            Ingresa el código de consultora
          </Typography>
          <form onSubmit={handleCodigoSubmit}>
            <TextField
              label="Código"
              value={codigoConsultora}
              onChange={(e) => setCodigoConsultora(e.target.value)}
              fullWidth
              variant="outlined"
              autoFocus
              required
            />
            {errorCodigo && (
              <Typography sx={{ color: "red", mt: 1 }}>
                {errorCodigo}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, width: "100%" }}
            >
              Acceder
            </Button>
          </form>
        </Box>
      </Box>
    );
  }

  // =========== RENDER PRINCIPAL ==============
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 20%, #e7f0fa 60%, #e0e7ef 100%)",
      }}
    >
      {/* ENCABEZADO Y CONSULTORA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "24px 32px 0 32px",
          justifyContent: "space-between",
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
          mt: 3,
        }}
      >
        <img
          src={consultora.foto}
          alt={consultora.nombre}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "5px solid #17d4b6",
            boxShadow: "0 2px 16px #1abc7480",
            objectFit: "cover",
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
          {consultora.nombre}
        </Typography>
        <Typography sx={{ color: "#757575", fontSize: 20, mb: 1 }}>
          {consultora.cargo}
        </Typography>
        <Typography sx={{ fontSize: 16, color: "#1976d2" }}>
          {consultora.email}
        </Typography>
        <Typography sx={{ fontSize: 16, color: "#1976d2" }}>
          {consultora.telefono}
        </Typography>
        <Button
          variant="text"
          sx={{ mt: 1, color: "#888" }}
          onClick={() => setConsultora(null)}
        >
          Cambiar consultora
        </Button>
      </Box>

      {/* CONTENEDOR PRINCIPAL CENTRADO */}
      <Box
        sx={{
          maxWidth: 800,
          margin: "40px auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {!showResumen && (
          <>
            {/* Datos del cliente */}
            <Box
              sx={{
                background: "#fff",
                borderRadius: 3,
                boxShadow: "0 2px 24px #b7e4fc33",
                p: 4,
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
                Datos del cliente
              </Typography>
              {/* Primera fila: Nombre, Correo, Celular */}
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                  label="Nombre completo *"
                  name="nombre"
                  fullWidth
                  value={cliente.nombre}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                />
                <TextField
                  label="Correo electrónico *"
                  name="correo"
                  type="email"
                  fullWidth
                  value={cliente.correo}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                />
                <TextField
                  label="Celular *"
                  name="celular"
                  fullWidth
                  value={cliente.celular}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                />
              </Stack>
              {/* Segunda fila: Edad, Género, Ciudad */}
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Edad *"
                  name="edad"
                  type="number"
                  value={cliente.edad}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  select
                  label="Género *"
                  name="genero"
                  value={cliente.genero}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">Seleccione</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </TextField>
                <TextField
                  label="Ciudad *"
                  name="ciudad"
                  value={cliente.ciudad}
                  onChange={handleClienteChange}
                  variant="outlined"
                  required
                  autoComplete="off"
                  fullWidth
                />
              </Stack>
            </Box>

            {/* Formulario de producto */}
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

            {/* Lista de productos agregados */}
            <Box
              sx={{
                background: "#fff",
                borderRadius: 3,
                boxShadow: "0 2px 10px #b7e4fc33",
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Productos agregados a la cotización
              </Typography>
              {productos.length === 0 && (
                <Typography sx={{ color: "#999" }}>
                  No has agregado productos aún.
                </Typography>
              )}
              {productos.map((prod, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 2,
                    p: 2,
                    background: "#f5fcf8",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  >
                  <Box>
                    <Typography>
                      <b>{prod.tipoPoliza}</b> ({prod.categoriaPoliza})
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "#888" }}>
                      Prima: {formatCurrency(prod.cotizacion.primaMensual)} | Suma asegurada: {formatCurrency(prod.cotizacion.sumaAsegurada)}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleEditProducto(idx)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteProducto(idx)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Botón final */}
            <Box
              sx={{
                textAlign: "center",
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
                  fontSize: 18,
                }}
                disabled={!datosCompletos}
                onClick={() => setShowResumen(true)}
              >
                Generar cotización y compartir
              </Button>
              {!datosCompletos && (
                <Typography sx={{ color: "#aaa", mt: 2, fontSize: 15 }}>
                  Completa los datos del cliente y agrega al menos un producto para continuar
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* ======================== RESUMEN PDF ============================== */}
        {showResumen && (
          <div id="pdf-content" style={{ margin: 0, padding: 0 }}>
            {/* PORTADA Y SALTO DE PÁGINA */}
            <div className="only-pdf"> </div>
            <PdfPortada consultora={consultora} />
            <div style={{ pageBreakAfter: "" }} />

            {/* COTIZACIÓN: recorrer productos */}
            <Box
              sx={{
                maxWidth: 900,
                margin: "0 auto",
                background: "#fff",
                borderRadius: 5,
                boxShadow: "0 2px 32px #b7e4fc44",
                p: { xs: 2, md: 5 },
              }}
              id="resumen-cotizacion"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 4,
                }}
              >
                <Box>
                  <img
                    src={metlifeLogo}
                    alt="Metlife Logo"
                    style={{ height: 38, marginBottom: 12 }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Cotización de Seguro de Vida / Plan Proteccion
                  </Typography>
                </Box>
                <img
                  src={consultora.foto}
                  alt={consultora.nombre}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    border: "3px solid #17d4b6",
                    boxShadow: "0 2px 12px #1abc7480",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 2 }}>
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
              </Box>
              <Divider sx={{ mb: 3 }} />

              {productos.map((prod, idx) => (
                <Box
                
                  key={idx}
                  sx={{
                    background: "#fafcff",
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    p: 3,
                    mb: 5,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 700, mb: 1 }}>
                    Producto {idx + 1}: {prod.tipoPoliza} ({prod.categoriaPoliza})
                  </Typography>
               
                  {/* Tabla Coberturas */}
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#1abc74", mb: 1, fontWeight: 700 }}
                  >
                    Coberturas incluidas
                  </Typography>
                  <div style={{ overflowX: "auto", marginBottom: 12 }}>
                    <table className="excel-table">
                      <thead>
                        <tr>
                          <th>COBERTURA</th>
                          <th style={{ textAlign: "right" }}>VALOR ASEGURADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...(prod.coberturasFijas || []).filter(c => c.valor), ...(prod.coberturasLibres || [])].map((cob, idx2) => (
                          <tr key={idx2}>
                            <td>{cob.nombre}</td>
                            <td style={{ textAlign: "right" }}>
                              {formatCurrency(cob.valor)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                   {/* TARJETA ECOSISTEMA BIENESTAR */}
                {prod.categoriaPoliza === "PLAN_PROTECCION" && prod.tipoPoliza === "Ecosistema" && (
                  <Box sx={{
                    background: "#e3f3fd",
                    border: "2px solid #2196f3",
                    borderRadius: 3,
                    p: 3,
                    mt: 2,
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
                {/* FIN TARJETA ECOSISTEMA */}

                  {/* Asistencias incluidas */}
                  {prod.asistenciasSeleccionadas.length > 0 && (
                    <Box
                      sx={{
                        background: "#e8f5e9",
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#1abc74", fontWeight: 700, mb: 1 }}
                      >
                        Asistencias incluidas
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 22, listStyle: "none" }}>
                        {prod.asistenciasSeleccionadas.map((asistencia, idx3) => (
                          <li key={idx3} style={{ fontSize: 17, marginBottom: 2 }}>
                            <span style={{ color: "#26b164", fontWeight: "bold", marginRight: 8 }}>✅</span>
                            {asistencia}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}

                  {/* Datos de inversión */}
                  <Box
                    className="no-break"
                    sx={{
                      background: "#aeea8c",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        fontFamily: "inherit",
                        fontSize: 17,
                        background: "#aeea8c",
                        borderRadius: "8px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 700, padding: 6 }}>
                            PRIMA MENSUAL DE FONDO DE INVERSIÓN
                          </td>
                          <td
                            style={{
                              fontWeight: 700,
                              textAlign: "right",
                              padding: 6,
                            }}
                          >
                            {formatCurrency(prod.datosAdicionales.primaInversion)}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, padding: 6 }}>
                            PRIMA MENSUAL DE PROTECCIÓN
                          </td>
                          <td
                            style={{
                              fontWeight: 700,
                              textAlign: "right",
                              padding: 6,
                            }}
                          >
                            {formatCurrency(prod.cotizacion.primaMensual)}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 700, padding: 6 }}>
                            ACUMULACIÓN DE CAPITAL A LOS{" "}
                            {prod.datosAdicionales.aniosAcumulacion || "___"} AÑOS
                          </td>
                          <td
                            style={{
                              fontWeight: 700,
                              textAlign: "right",
                              padding: 6,
                            }}
                          >
                            {formatCurrency(prod.datosAdicionales.valorAcumulado)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>

                  {/* Notas/observaciones */}
                  {prod.cotizacion.notas && (
                    <Box
                      sx={{
                        background: "#f9fcfa",
                        borderRadius: 2,
                        p: 2,
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: "#1abc74" }}>
                        Notas/Observaciones:
                      </Typography>
                      <Typography variant="body2">{prod.cotizacion.notas}</Typography>
                    </Box>
                  )}

                  {/* Suma asegurada y Prima mensual */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 6,
                      mb: 2,
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
                        {formatCurrency(prod.cotizacion.sumaAsegurada)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#888", fontWeight: 600 }}
                      >
                        Total inversión mensual:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          fontSize: 20,
                          color: "#1abc74",
                        }}
                      >
                        {formatCurrency(prod.datosAdicionales.totalInversion)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ mb: 2 }} />

              {/* Datos de la consultora */}
              <Box
                className="no-break"
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <img
                  src={consultora.foto}
                  alt={consultora.nombre}
                  style={{ width: 48, height: 48, borderRadius: "50%" }}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {consultora.nombre}
                  </Typography>
                  <Typography variant="body2">{consultora.cargo}</Typography>
                  <Typography variant="body2">{consultora.email}</Typography>
                  <Typography variant="body2">{consultora.telefono}</Typography>
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
    </Box>
  );
}