function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export default defineEventHandler(async (e) => {
  await sleep(1000)
  const body = await readBody(e)

  return {
    data: Object.keys(JSON.parse(body)).filter(Boolean).join(', ')
  }
})
