function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <h1>Oops! Something went wrong.</h1>
      <p>{error.message || "The page you're looking for doesn't exist."}</p>
      <a href="/">Go back to Home</a>
    </div>
  )
}

export default ErrorFallback
