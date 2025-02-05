import { Typography, Box, Container } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        component="footer"
        sx={{
          backgroundColor: 'grey.100',
          padding: 2,
          marginTop: 'auto',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Le Hong Phong. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </LocalizationProvider>
  )
}

export default Footer
