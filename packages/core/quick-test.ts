import { guard } from './src'

async function test() {
  const ok = await guard(async () => 42)
  const fail = await guard(() => {
    throw new Error('boom')
  })

  console.log(ok)
  console.log(fail)
}

test()