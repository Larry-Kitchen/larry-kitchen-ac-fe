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
  trainingName,
  trainingTrainerName,
  trainingCapacity,
  trainingStatus,
  trainingLocation,
  trainingDate,
  trainingDescription,
  students
) {
  return {
    trainingName,
    trainingTrainerName,
    trainingCapacity,
    trainingStatus,
    trainingLocation,
    trainingDate,
    trainingDescription,
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

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};


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
  { id: 'trainingName', align: 'left', label: 'Nama Training' },
  { id: 'trainingTrainerName', align: 'center', label: 'Nama Trainer' },
  { id: 'trainingCapacity', align: 'center', label: 'Kapasitas' },
  { id: 'trainingStatus', align: 'center', label: 'Status' },
  { id: 'trainingLocation', align: 'center', label: 'Kelas' },
  { id: 'trainingDate', align: 'center', label: 'Tanggal' },
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
    'PENDING': { color: 'warning', title: 'Pending' },
    'OPEN': { color: 'success', title: 'Open' },
    'DENIED': { color: 'error', title: 'Rejected' }
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
export default function OrderTable({ trainingData }) {
  const order = 'asc';
  const orderBy = 'trainingName';

  const [open, setOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);

  const userRole = localStorage.getItem('userRole');

  // Open Detail Modal
  const handleOpen = (training, trainingId) => {
    setSelectedTraining(training);
    setSelectedTrainingId(trainingId)
    setOpen(true);
  };

  // Close Detail Modal
  const handleClose = () => {
    setOpen(false);
    setSelectedTraining(null);
    setSelectedTrainingId(null);
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
            {trainingData.map((row, index) => (
              <TableRow key={row.trainingName} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.trainingName}</TableCell>
                <TableCell align="center">{row.trainingTeacherName}</TableCell>
                <TableCell align="center">{row.trainingCapacity}</TableCell>
                <TableCell align="center">
                  <OrderStatus status={row.trainingStatus} align={'center'} />
                </TableCell>
                <TableCell align="center">{row.trainingClass}</TableCell>
                <TableCell align="center">{formatDate(row.trainingDate)}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" size="small" onClick={() => handleOpen(row, row.trainingId)}>
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Dialog Component */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h3" paddingTop={1}>
            Detail Training
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography fontWeight="bold" paddingRight={1}>Nama Training :</Typography>
              <Typography>{selectedTraining?.trainingName || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography fontWeight="bold" paddingRight={1}>Nama Trainer:</Typography>
              <Typography>{selectedTraining?.trainingTeacherName || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography fontWeight="bold" paddingRight={1}>Kapasitas:</Typography>
              <Typography>{selectedTraining?.trainingCapacity || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography fontWeight="bold" paddingRight={1}>Kelas:</Typography>
              <Typography>{selectedTraining?.trainingClass || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography fontWeight="bold" paddingRight={1}>Date:</Typography>
              <Typography>{formatDate(selectedTraining?.trainingDate) || '-'}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: '' }}>
              <Typography fontWeight="bold" paddingRight={1}>Status:</Typography>
              <OrderStatus status={selectedTraining?.trainingStatus} align={'left'} />
            </Box>

            <Box sx={{ display: '', justifyContent: '' }}>
              <Typography fontWeight="bold" paddingBottom={1}>Deskripsi:</Typography>
              <TextField
                disabled
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={selectedTraining?.trainingDescription}
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
                        borderColor: 'rgba(0, 0, 0, 0.2)'
                      }
                    }
                  }
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography fontWeight="bold" variant="h6">Student List:</Typography>
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