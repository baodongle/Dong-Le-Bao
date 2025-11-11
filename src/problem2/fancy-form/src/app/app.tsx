import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { SwapPage } from '@/pages/swap'
import { Toaster } from '@/shared/ui'
import { QueryProvider } from './providers/QueryProvider'

export function App() {
  return (
    <QueryProvider>
      <SwapPage />
      <Toaster richColors />
      <TanStackDevtools
        plugins={[
          {
            name: 'TanStack Query',
            render: <ReactQueryDevtoolsPanel />,
          },
          FormDevtoolsPlugin(),
        ]}
      />
    </QueryProvider>
  )
}

export default App
