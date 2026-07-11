import { reportRuntimeError } from '..'

class ErrorEventStub {
  type: string
  error: Error
  message: string

  constructor(type: string, init: { error: Error; message: string }) {
    this.type = type
    this.error = init.error
    this.message = init.message
  }
}

describe('[helpers] reportRuntimeError', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should delegate to reportError when available', () => {
    const reportErrorMock = vi.fn()
    vi.stubGlobal('reportError', reportErrorMock)

    const error = new Error('boom')
    reportRuntimeError(error)

    expect(reportErrorMock).toHaveBeenCalledWith(error)
  })

  it('should dispatch an error event when reportError is unavailable', () => {
    const dispatchEvent = vi.fn()
    vi.stubGlobal('reportError', undefined)
    vi.stubGlobal('ErrorEvent', ErrorEventStub)
    vi.stubGlobal('window', { dispatchEvent })

    const error = new Error('boom')
    reportRuntimeError(error)

    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ error, message: 'boom' })
    )
  })
})
