<script setup lang="ts">
import { client } from '@passwordless-id/webauthn'
import type { AuthenticateBody, RegisterBody } from './src/types';
import * as v from 'valibot'

const form = ref()

const schema = v.object({
  username: v.string([
    v.minLength(1, 'Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ])
})

const state = reactive({
  username: ''
})

const session = await useJWTSession()
const userHandle = useState(() => getRandomU64() + '')

const onRegister = async () => {

  try {
    await form.value.validate()
    const { challenge } = await $fetch('/api/passkey/challenge', {
      method: 'GET',
    })
    const registration = await client.register(state.username, challenge, {
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
    window.location.reload()
  } catch (err) {
    console.error(err)
  }
}

const onSignIn = async () => {
  await form.value.validate()
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
        username: state.username
      } as AuthenticateBody
    })
    window.location.reload()
  } catch (err) {
    console.error(err)
  }
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

    <Body class="m-4">
      <h2 class="text-3xl mb-4">
        Hi {{ session.username }}
      </h2>
      <UButton class="mv-4" @click="onSignOut">
        Sign out
      </UButton>
    </Body>
  </template>
  <template v-else>

    <Body class="m-4">
      <h2 class="text-3xl mb-8">
        Welcome to WebAuthn Demo
      </h2>
      <UForm ref="form" :schema="schema" :state="state">
        <UFormGroup class=" max-w-xs" label="Username" name="username">
          <UInput placeholder="user@example.com" type="text" v-model="state.username" />
        </UFormGroup>
        <UButton class="mv-4" @click="onRegister">
          Register
        </UButton>
        <UButton class="m-4" @click="onSignIn">
          Sign in
        </UButton>
      </UForm>
    </Body>
  </template>

</template>
