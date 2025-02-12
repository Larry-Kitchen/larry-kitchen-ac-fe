// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import LogoSmall from 'components/logo/LogoSmall';

// project import
import { GithubOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="end" width={'-webkit-fill-available'}>
        <LogoSmall />
        <Chip
          label="Academy"
          variant="outlined"
          size="small"
          color="secondary"
          sx={{ mt: 0.5, ml: 1, fontSize: '0.8rem', height: 20, '& .MuiChip-label': { px: 0.5 } }}
        />
      </Stack>
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
