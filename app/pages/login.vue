<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h1 class="heading-2 text-center">
          Sign in
        </h1>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          class="w-full justify-center"
          :loading="pending"
        >
          Sign in
        </UButton>
      </UForm>

      <USeparator
        label="or continue with"
        class="my-4"
      />

      <div class="space-y-2">
        <UButton
          as="a"
          href="/auth/google"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-google"
          class="w-full justify-center"
        >
          Continue with Google
        </UButton>

        <UButton
          as="a"
          href="/auth/github"
          color="neutral"
          variant="outline"
          icon="i-simple-icons-github"
          class="w-full justify-center"
        >
          Continue with GitHub
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ auth: false })

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const pending = ref(false)
const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  pending.value = true
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: event.data })
    await navigateTo('/')
  } catch {
    toast.add({ title: 'Invalid credentials', color: 'error' })
  } finally {
    pending.value = false
  }
}
</script>
