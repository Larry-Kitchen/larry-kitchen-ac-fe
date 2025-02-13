
import { useState, useEffect } from "react";
// material-ui
import { Box, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// project import
import MainCard from 'components/MainCard';
import OrdersTable from './OrdersTable';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState(dayjs());
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  const userToken = localStorage.getItem('sessionToken');

  const locations = ["Carmy 1", "Carmy 2", "Sydney", "Marcus"];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // if (loading) return <TableBody><TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow></TableBody>;
  // if (error) return <TableBody><TableRow><TableCell colSpan={6} align="center">Error: {error}</TableCell></TableRow></TableBody>;

  const fetchTrainings = async () => {
    try {
      const response = await fetch(
        "https://52d8-114-124-149-99.ngrok-free.app/api/training/training-list",
        {
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${userToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data);
      setTrainingData(data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log(values);

    try {
      const response = await fetch('https://52d8-114-124-149-99.ngrok-free.app/api/training/request-training', {
        method: 'POST',
        headers: {
          "Authorization" : `Bearer ${userToken}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({
          userId: userId,
          trainingName: values.trainingName,
          trainingDesc: values.description,
          trainingCapacity: values.capacity,
          trainingClass: values.location,
          trainingDate: values.dateTime,
        })
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
      handleClose()
    }
  };

  const handleApprove = async (trainingId) => {
    try {
      const response = await fetch(`https://52d8-114-124-149-99.ngrok-free.app/api/training/${trainingId}/approve`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${userToken}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ trainingStatus: "approved" })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve training');
      }

      console.log("Training approved successfully", data);
      alert("Training has been approved!");
    } catch (error) {
      console.error("Error approving training:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const validationSchema = Yup.object({
    trainingName: Yup.string().required("Nama Training wajib diisi"),
    capacity: Yup.number().max(30, "Kapasitas maksimum adalah 30").positive("Kapasitas harus angka positif").integer("Harus angka bulat").required("Kapasitas Training wajib diisi"),
    location: Yup.string().required("Lokasi wajib dipilih"),
    dateTime: Yup.date().required("Waktu Training wajib diisi"),
    description: Yup.string().max(500, "Deskripsi maksimal 500 karakter").required("Deskripsi Training wajib diisi"),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px"
        }}
      >
        <Grid
          container
          rowSpacing={4.5}
          columnSpacing={2.75}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} md={7} lg={8}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h3">Training Larry's Kitchen</Typography>
              </Grid>

              {userRole !== 'MANAGER' && (
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleOpen}>
                    Request Training Baru
                  </Button>
                </Grid>
              )}
            </Grid>

            {/* Orders Table */}
            <MainCard sx={{ mt: 2 }} content={false}>
              <OrdersTable trainingData={trainingData}/>
            </MainCard>
          </Grid>
        </Grid>

        {/* Popup Form (Modal) */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <h2>Pengajuan Training Baru</h2>
          </DialogTitle>

          <Formik
            initialValues={{
              trainingName: "",
              capacity: "",
              location: "",
              dateTime: null,
              description: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <DialogContent>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75, mt: 1 }}>
                    <TextField disabled label={userName} variant="outlined" fullWidth />

                    {/* Training Name */}
                    <Box>
                      <Field name="trainingName" as={TextField} label="Nama Training" variant="outlined" fullWidth />
                      <ErrorMessage name="trainingName" component="div" style={{ color: "red", fontSize: "0.7rem", marginTop: "0.25rem" }} />
                    </Box>

                    {/* Capacity */}
                    <Box>
                      <Field name="capacity" as={TextField} label="Kapasitas Training" type="number" variant="outlined" fullWidth />
                      <ErrorMessage name="capacity" component="div" style={{ color: "red", fontSize: "0.7rem", marginTop: "0.25rem" }} />
                    </Box>

                    {/* Location */}
                    <Box>
                      <FormControl fullWidth>
                        <InputLabel>Lokasi Kelas Training</InputLabel>
                        <Field
                          name="location"
                          as={Select}
                          value={values.location}
                          onChange={(e) => setFieldValue("location", e.target.value)}
                        >
                          {locations.map((loc, index) => (
                            <MenuItem key={index} value={loc}>
                              {loc}
                            </MenuItem>
                          ))}
                        </Field>
                      </FormControl>
                      <ErrorMessage name="location" component="div" style={{ color: "red", fontSize: "0.7rem", marginTop: "0.25rem" }} />
                    </Box>

                    {/* DateTime Picker */}
                    <Box>
                      <FormControl fullWidth>
                        <DateTimePicker
                          label="Waktu Training"
                          value={values.dateTime}
                          onChange={(newValue) => setFieldValue("dateTime", newValue)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        <ErrorMessage name="dateTime" component="div" style={{ color: "red", fontSize: "0.7rem", marginTop: "0.25rem" }} />
                      </FormControl>
                    </Box>

                    {/* Description */}
                    <Box>
                      <Field name="description" as={TextField} label="Deskripsi Training" variant="outlined" fullWidth multiline rows={3} />
                      <ErrorMessage name="description" component="div" style={{ color: "red", fontSize: "0.7rem", marginTop: "0.25rem" }} />
                    </Box>
                  </Box>
                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{ padding: "4px 24px 20px 24px" }}>
                  <Button onClick={handleClose} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    Submit
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
