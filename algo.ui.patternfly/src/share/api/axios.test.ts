import axios from 'axios'
import { describe, expect, it } from 'vitest'
import apiClient from './axios'
import { ApiHttpError } from './types'

function getRejectedInterceptor() {
  const handlers = (apiClient.interceptors.response as unknown as {
    handlers: Array<{ rejected?: (error: unknown) => Promise<unknown> }>
  }).handlers

  const rejected = handlers.at(-1)?.rejected
  if (!rejected) {
    throw new Error('Expected response rejected interceptor to be registered.')
  }

  return rejected
}

describe('apiClient response interceptor', () => {
  it('preserves canceled Axios requests so hooks can ignore aborts', async () => {
    const canceledError = new axios.CanceledError('canceled')
    const rejected = getRejectedInterceptor()

    await expect(rejected(canceledError)).rejects.toBe(canceledError)
  })

  it('normalizes non-cancel Axios failures to ApiHttpError', async () => {
    const rejected = getRejectedInterceptor()
    const axiosError = new axios.AxiosError(
      'Request failed with status code 500',
      'ERR_BAD_RESPONSE',
      undefined,
      undefined,
      {
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: { headers: axios.AxiosHeaders.from({}) },
        data: { message: 'Internal server error.' },
      },
    )

    await expect(rejected(axiosError)).rejects.toMatchObject<ApiHttpError>({
      name: 'ApiHttpError',
      message: 'Internal server error.',
      status: 500,
    })
  })
})