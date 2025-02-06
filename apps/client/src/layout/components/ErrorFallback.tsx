import { FC } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { Container, Typography, Button } from '@mui/material'

const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Container>
      <Typography variant="h5" color="error" gutterBottom>
        Something went wrong.
      </Typography>
      <Typography variant="body1">{error.message}</Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </Container>
  )
}

export default ErrorFallback
