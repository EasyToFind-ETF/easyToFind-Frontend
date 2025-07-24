'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import type * as React from 'react'

export default function QueryProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}