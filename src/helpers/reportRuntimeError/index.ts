export const reportRuntimeError = (error: Error) => {
  if (typeof reportError === 'function') {
    reportError(error)
    return
  }

  if (typeof ErrorEvent === 'function') {
    window.dispatchEvent(
      new ErrorEvent('error', {
        error,
        message: error.message
      })
    )
  }
}
