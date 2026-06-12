export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  // TODO: replace with real credential check against your DB
  if (email !== 'admin@example.com' || password !== 'password') {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  await setUserSession(event, {
    user: { email }
  })

  return { ok: true }
})
