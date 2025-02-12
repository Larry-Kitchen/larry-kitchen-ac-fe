import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import Dot from 'components/@extended/Dot';

function createData(training_no, training_name, training_capacity, training_status, training_location) {
  return { training_no, training_name, training_capacity, training_status, training_location };
}

const rows = [
  createData(84564564, 'Camera Lens', 40, 2, 'Carmy 1'),
  createData(98764564, 'Laptop', 30, 0, 'Sydney'),
  createData(98756325, 'Mobile', 20, 1, 'Marcus'),
  createData(98652366, 'Handset', 10, 1, 'Carmy 2'),
  createData(13286564, 'Computer Accessories', 25, 1, 'Carmy 2'),
  createData(86739658, 'TV', 10, 0, 'Marcus'),
  createData(13256498, 'Keyboard', 15, 2, 'Sydney'),
  createData(98753263, 'Mouse', 20, 2, 'Sydney'),
  createData(98753275, 'Desktop', 10, 1, 'Carmy 1'),
  createData(98753291, 'Chair', 10, 0, 'Marcus')
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'training_no',
    align: 'left',
    disablePadding: false,
    label: 'Training No.'
  },
  {
    id: 'training_name',
    align: 'left',
    disablePadding: true,
    label: 'Training Name'
  },
  {
    id: 'training_capacity',
    align: 'center',
    disablePadding: false,
    label: 'Capacity'
  },
  {
    id: 'training_status',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'training_location',
    align: 'right',
    disablePadding: false,
    label: 'Location'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const order = 'asc';
  const orderBy = 'training_no';

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
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.training_no}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary"> {row.training_no}</Link>
                  </TableCell>
                  <TableCell>{row.training_name}</TableCell>
                  <TableCell align="center">{row.training_capacity}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.training_status} />
                  </TableCell>
                  <TableCell align="right">{row.training_location}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };
