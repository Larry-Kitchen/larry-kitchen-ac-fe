
import { useState } from "react";
// material-ui
import { Box, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// project import
import MainCard from 'components/MainCard';
import OrdersTable from './OrdersTable';

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

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState(dayjs());

  const locations = ["Room A", "Room B", "Room C", "Room D", "Room E"];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
                <Typography variant="h3">Larry's Kitchen's Trainings</Typography>
              </Grid>

              {/* Button to Open Modal */}
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                  Request Training Baru
                </Button>
              </Grid>
            </Grid>

            {/* Orders Table */}
            <MainCard sx={{ mt: 2 }} content={false}>
              <OrdersTable />
            </MainCard>
          </Grid>
        </Grid>

        {/* Popup Form (Modal) */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <h2>Pengajuan Training Baru</h2>
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField disabled label="Nama Trainer" variant="outlined" fullWidth />
              <TextField label="Nama Training" variant="outlined" fullWidth />
              <TextField label="Kapasitas Training" type="number" variant="outlined" fullWidth />
              <FormControl fullWidth>
                <InputLabel>Lokasi Kelas Training</InputLabel>
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {locations.map((loc, index) => (
                    <MenuItem key={index} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DateTimePicker
                label="Waktu Training"
                value={dateTime}
                onChange={(newValue) => setDateTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <TextField label="Deskripsi Training" variant="outlined" fullWidth multiline rows={3} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "4px 24px 20px 24px" }}>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleClose} variant="contained" color="primary">Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
