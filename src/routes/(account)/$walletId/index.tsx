import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(account)/$walletId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/"!</div>
}
