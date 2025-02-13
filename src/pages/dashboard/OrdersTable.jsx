import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Material-UI Components
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Checkbox
} from '@mui/material';

import Dot from 'components/@extended/Dot';

function createData(
  training_name,
  training_trainer_name,
  training_capacity,
  training_status,
  training_location,
  training_date,
  training_description,
  students
) {
  return {
    training_name,
    training_trainer_name,
    training_capacity,
    training_status,
    training_location,
    training_date,
    training_description,
    students
  };
}

const rows = [
  createData('Camera Lens', 'larry', 40, 2, 'Carmy 1', '12 Jan 2002', 'ini detail 1', [
    { student_id: 'S001', student_name: 'larry 1' },
    { student_id: 'S002', student_name: 'larry 2' }
  ]),
  createData('Laptop', 'larry', 30, 0, 'Sydney', '2 Feb 2002', 'ini detail 2', [
    { student_id: 'S003', student_name: 'larry 3' },
    { student_id: 'S004', student_name: 'larry 4' }
  ]),
  createData('Mobile', 'larry', 20, 1, 'Marcus', '2 Jan 2002', 'ini detail 3', [{ student_id: 'S005', student_name: 'larry 5' }])
];

// Sorting Functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Table Headers
const headCells = [
  { id: 'training_name', align: 'left', label: 'Nama Training' },
  { id: 'training_trainer_name', align: 'center', label: 'Nama Trainer' },
  { id: 'training_capacity', align: 'center', label: 'Kapasitas' },
  { id: 'training_status', align: 'center', label: 'Status' },
  { id: 'training_location', align: 'center', label: 'Kelas' },
  { id: 'training_date', align: 'center', label: 'Kelas' },
  { id: 'Action', align: 'center', label: 'Aksi' }
];

// Table Header Component
function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

// Status Indicator Component
function OrderStatus({ status, align }) {
  const statusMap = {
    0: { color: 'warning', title: 'Pending' },
    1: { color: 'success', title: 'Approved' },
    2: { color: 'error', title: 'Rejected' }
  };

  const { color, title } = statusMap[status] || { color: 'primary', title: 'None' };

  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent={align} width="100%">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

OrderStatus.propTypes = { status: PropTypes.number.isRequired };

// Main Table Component
export default function OrderTable() {
  const order = 'asc';
  const orderBy = 'training_name';

  // State for Popup Dialog
  const [open, setOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  // Open Detail Modal
  const handleOpen = (training) => {
    setSelectedTraining(training);
    setOpen(true);
  };

  // Close Detail Modal
  const handleClose = () => {
    setOpen(false);
    setSelectedTraining(null);
  };

  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(
      (prevSelected) =>
        prevSelected.includes(studentId)
          ? prevSelected.filter((id) => id !== studentId)
          : [...prevSelected, studentId]
    );
  };

  const [trainingData, setTrainingData] = useState([]);
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // if (loading) return <TableBody><TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow></TableBody>;
  // if (error) return <TableBody><TableRow><TableCell colSpan={6} align="center">Error: {error}</TableCell></TableRow></TableBody>;

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const formattedData = data.slice(0, 10).map((item, index) => ({
          training_name: `Training ${index + 1}`,
          training_trainer_name: `Trainer ${index + 1}`,
          training_capacity: Math.floor(Math.random() * 30) + 10,
          training_status: index % 2 === 0 ? "Approved" : "Pending",
          training_location: `Location ${index + 1}`,
          training_date: new Date().toISOString().split("T")[0], // Mock date
        }));

        setTrainingData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
              <TableRow key={row.training_name} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.training_name}</TableCell>
                <TableCell align="center">{row.training_trainer_name}</TableCell>
                <TableCell align="center">{row.training_capacity}</TableCell>
                <TableCell align="center">
                  <OrderStatus status={row.training_status} align={'center'} />
                </TableCell>
                <TableCell align="center">{row.training_location}</TableCell>
                <TableCell align="center">{row.training_date}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" size="small" onClick={() => handleOpen(row)}>
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* TODO: Add Popup Dialog Component Here */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h3" paddingTop={1}>
            Training Detail
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography paddingRight={1}>Nama Training :</Typography>
              <Typography>{selectedTraining?.training_name || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography paddingRight={1}>Nama Trainer:</Typography>
              <Typography>{selectedTraining?.training_trainer_name || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography paddingRight={1}>Kapasitas:</Typography>
              <Typography>{selectedTraining?.training_capacity || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography paddingRight={1}>Kelas:</Typography>
              <Typography>{selectedTraining?.training_location || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography paddingRight={1}>Date:</Typography>
              <Typography>{selectedTraining?.training_date || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography paddingRight={1}>Status:</Typography>
              <OrderStatus status={selectedTraining?.training_status} align={'left'} />
            </Box>

            <Box sx={{ display: '', justifyContent: '' }}>
              <Typography paddingBottom={1}>Deskripsi:</Typography>
              <TextField
                label="Deskripsi"
                disabled
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={selectedTraining?.training_description}
                InputProps={{
                  sx: { color: 'black' }
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000'
                  },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-disabled': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.4)'
                      }
                    }
                  }
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Student List:</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      {userRole !== 'MANAGER' && (
                        <TableCell>Check</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTraining?.students?.length > 0 ? (
                      selectedTraining.students.map((student) => (
                        <TableRow key={student.student_id}>
                          
                          <TableCell>{student.student_id}</TableCell>
                          <TableCell>{student.student_name}</TableCell>
                          {userRole !== 'MANAGER' && (
                            <TableCell>
                              <Checkbox
                                checked={selectedStudents.includes(student.student_id)}
                                onChange={() => handleStudentToggle(student.student_id)}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No students available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '4px 24px 20px 24px' }}>
          {userRole !== 'TRAINER' && (
            <>
              <Button onClick={handleClose} variant="contained" color="error">
                Reject
              </Button>
              <Button onClick={handleClose} variant="contained" color="primary">
                Approve
              </Button>
            </>
          )}
          <Button onClick={handleClose} variant="contained" color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}