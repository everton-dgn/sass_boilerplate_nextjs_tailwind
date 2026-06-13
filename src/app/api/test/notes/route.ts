import { type NextRequest, NextResponse } from 'next/server'

import { isTestModeEnabled } from '@/constants/testMode'

import { deleteStore, resetStore } from '../../notes/store'

const createTestModeDisabledResponse = () =>
  NextResponse.json({ error: 'Test mode is disabled.' }, { status: 404 })

const getSessionId = (request: NextRequest) =>
  request.headers.get('x-test-session')

const getSessionIdOrResponse = (request: NextRequest) => {
  if (!isTestModeEnabled()) return createTestModeDisabledResponse()

  const sessionId = getSessionId(request)
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing x-test-session header.' },
      { status: 400 }
    )
  }

  return sessionId
}

export const POST = (request: NextRequest) => {
  const sessionId = getSessionIdOrResponse(request)
  if (sessionId instanceof NextResponse) return sessionId

  const store = resetStore(sessionId)

  return NextResponse.json({
    items: store.size,
    sessionId
  })
}

export const DELETE = (request: NextRequest) => {
  const sessionId = getSessionIdOrResponse(request)
  if (sessionId instanceof NextResponse) return sessionId

  deleteStore(sessionId)

  return NextResponse.json({
    deleted: true,
    sessionId
  })
}
