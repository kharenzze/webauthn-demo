<script setup lang="ts">
import { client } from '@passwordless-id/webauthn'

const name = ref('Paolo')
const userHandle = useState(() => getRandomU64() + '')

const onSubmit = async () => {
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
      }
    })
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>
  <div>
    Hi there!
  </div>
  <p>Challenge</p>
  <input type="text" v-model="name">
  <button @click="onSubmit">
    Sign in
  </button>
</template>
