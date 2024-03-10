<script setup lang="ts">
import { client } from '@passwordless-id/webauthn'
import type { AuthenticateBody, RegisterBody } from './src/types';

const session = await useJWTSession()

const username = ref('')
const userHandle = useState(() => getRandomU64() + '')

const onRegister = async () => {
  try {
    const { challenge } = await $fetch('/api/passkey/challenge', {
      method: 'GET',
    })
    const registration = await client.register(username.value, challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: true,
      userHandle: userHandle.value,
      debug: true
    })
    await $fetch('/api/passkey/register', {
      method: 'POST',
      body: {
        registration,
        challenge
      } as RegisterBody
    })
  } catch (err) {
    console.error(err)
  }
  window.location.reload()
}

const onSignIn = async () => {
  try {
    const { challenge } = await $fetch('/api/passkey/challenge', {
      method: 'GET',
    })
    const authentication = await client.authenticate([], challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      debug: true
    })
    await $fetch('/api/passkey/signin', {
      method: 'POST',
      body: {
        authentication,
        challenge,
        username: username.value
      } as AuthenticateBody
    })
  } catch (err) {
    console.error(err)
  }
  window.location.reload()
}

const onSignOut = async () => {
  await $fetch('/api/passkey/signout', {
    method: 'GET',
  })
  window.location.reload()
}

</script>

<template>

  <Head>
    <Title>
      WebAuthn Demo
    </Title>
  </Head>
  <template v-if="session">
    <p>Hi {{ session.username }}</p>
    <button @click="onSignOut">
      Sign out
    </button>
  </template>
  <template v-else>
    <div>
      Hi there!
    </div>
    <p>Challenge</p>
    <input type="text" v-model="username">
    <button @click="onRegister">
      Register
    </button>
    <button @click="onSignIn">
      Sign in
    </button>

  </template>


</template>
