export async function useFetching(url: RequestInfo | URL, opts?: RequestInit) {
  return await useLazyFetching(url).send(opts)
}

export function useLazyFetching(url: RequestInfo | URL) {
  const response = shallowRef<Response>()
  const isFetch = ref(false)
  const data = ref<Record<string, string>>({})
  const error = ref<unknown>('')

  async function send(opts?: RequestInit) {
    try {
      isFetch.value = true
      response.value = await fetch(url, opts)
      data.value = await response.value.json()
    } catch (e) {
      error.value = e
    } finally {
      isFetch.value = false
    }
  }

  return {
    send,
    response,
    data,
    error,
    isFetch
  }
}
