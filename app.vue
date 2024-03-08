<script setup lang="ts">
import { client } from '@passwordless-id/webauthn'

const challenge = useState('challenge', () => crypto.randomUUID())
const name = ref('Paolo')

const onSubmit = async () => {
  try {
    const registration = await client.register(name.value, challenge.value, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: true,
      userHandle: "recommended to set it to a random 64 bytes value",
      debug: true
    })
    $fetch('/api/passkey/register', {
      method: 'POST',
      body: registration
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
  <p>{{ challenge }}</p>
  <input type="text" v-model="name">
  <button @click="onSubmit">
    Sign in
  </button>
</template>
