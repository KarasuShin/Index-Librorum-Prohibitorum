import { toast } from '~/components/ui/use-toast'

export interface HttpOptions {
  baseURL?: string
  timeout?: number
}

export interface FetchOptions extends HttpOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  accessToken: boolean
  responseType: string
}

class RequestException extends Error {
  message: string

  code: number

  constructor(code: number, message: string) {
    super()
    this.message = message
    this.code = code
  }
}

export class Http {
  private httpOptions: HttpOptions

  constructor(options: HttpOptions) {
    this.httpOptions = options
  }

  private checkStatusCode = (code: number, msg?: string) => {
    if (code >= 200 && code < 300) {
      return
    }
    switch (code) {
      case 400:
        throw new RequestException(400, msg ?? 'something went wrong')
      case 401:
        throw new RequestException(401, msg ?? 'login required')
      case 403:
        throw new RequestException(403, msg ?? 'access denied')
      case 500:
        throw new RequestException(500, msg ?? 'server error')
      default:
        throw new RequestException(code, msg ?? 'something went wrong')
    }
  }

  private baseFetch = async <T = any>(
    url: string,
    payload: any,
    options: Partial<FetchOptions>,
  ) => {
    const mixedOptions = {
      accessToken: true,
      ...this.httpOptions,
      ...options,
    }
    let requestUrl = url
    let body: BodyInit | null = null
    if (mixedOptions.baseURL) {
      requestUrl = `${mixedOptions.baseURL}${url}`
    }
    const headers = new Headers()
    if (payload instanceof FormData) {
      body = payload
    } else {
      headers.set('Content-Type', 'application/json')
      if (payload?.current) {
        payload.pageNum = payload.current
        delete payload.current
      }
      if (mixedOptions.method === 'GET' && payload) {
        requestUrl = `${requestUrl}?${new URLSearchParams(payload)}`
      }
      if (mixedOptions.method === 'POST' || mixedOptions.method === 'PUT') {
        body = JSON.stringify(payload)
      }
    }
    const res = await fetch(requestUrl, {
      method: mixedOptions.method,
      headers,
      body,
    })
    try {
      this.checkStatusCode(res.status)
      const contentType: string | null = res.headers.get('Content-Type')
      let json
      if (
        contentType
        ?.toLowerCase()
        .includes(
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
      ) {
        json = await res.blob()
      } else if (
        contentType
        ?.toLowerCase()
        .includes(
          'application/octet-stream',
        )
      ) {
        const fileName = decodeURIComponent(res.headers.get('content-disposition')?.split('fileName=')[1] ?? '文件')
        const formData = new FormData()
        formData.append('fileName', fileName)
        const blob = await res.blob()
        formData.append('blob', blob)
        json = formData
      } else {
        json = await res.json()
        if (json.code) {
          this.checkStatusCode(json.code, json.msg)
        }
      }
      return json as T
    } catch (error) {
      if (error instanceof RequestException) {
        toast({
          title: error.code.toString(),
          variant: 'destructive',
          description: error.message,
        })
      }
      throw new Error('Bad Request')
    }
  }

  get = <T = any>(url: string, payload?: any, options?: FetchOptions) => this.baseFetch<T>(url, payload, { ...options, method: 'GET' })

  post = <T = any>(url: string, payload?: any, options?: FetchOptions) => this.baseFetch<T>(url, payload ?? {}, { ...options, method: 'POST' })

  put = <T = any>(url: string, payload?: any, options?: FetchOptions) => this.baseFetch<T>(url, payload, { ...options, method: 'PUT' })

  delete = <T = any>(url: string, payload?: any, options?: FetchOptions) => this.baseFetch<T>(url, payload, { ...options, method: 'DELETE' })
}

export const http = new Http({
  baseURL: '/api',
  timeout: 1e4,
})
