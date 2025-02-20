import { Button, Result } from 'antd'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Result
        status="500"
        title="Something went wrong"
        subTitle={<span className="text-red-500">{error.message}</span>}
        extra={
          <Button type="primary" onClick={resetErrorBoundary}>
            Try Again
          </Button>
        }
      />
    </div>
  )
}
