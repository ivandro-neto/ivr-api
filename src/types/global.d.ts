interface AggregateError extends Error {
  errors: Error[];
}

interface ErrorOptions {
  cause?: unknown;
}