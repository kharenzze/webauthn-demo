<script setup lang="ts">
import { client } from '@passwordless-id/webauthn'
import type { AuthenticateBody, RegisterBody } from './src/types';

const name = ref('Paolo')
const userHandle = useState(() => getRandomU64() + '')

const onRegister = async () => {
  try {
    const { challenge } = await $fetch('/api/passkey/challenge', {
      method: 'GET',
    })
    const registration = await client.register(name.value, challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: true,
      userHandle: userHandle.value,
      debug: true
    })
    $fetch('/api/passkey/register', {
      method: 'POST',
      body: {
        registration,
        challenge
      } as RegisterBody
    })
  } catch (err) {
    console.error(err)
  }
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
    $fetch('/api/passkey/signin', {
      method: 'POST',
      body: {
        authentication,
        challenge,
        username: name.value
      } as AuthenticateBody
    })
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>

  <Head>
    <Title>
      WebAuthn Demo
    </Title>
  </Head>
  <div>
    Hi there!
  </div>
  <p>Challenge</p>
  <input type="text" v-model="name">
  <button @click="onRegister">
    Register
  </button>
  <button @click="onSignIn">
    Sign in
  </button>
</template>
