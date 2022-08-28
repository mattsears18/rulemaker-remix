import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useCatch, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { deleteProposal, getProposal } from '~/models/proposal.server'
import { requireUserId } from '~/session.server'

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request)
  invariant(params.proposalId, 'proposalId not found')

  const proposal = await getProposal({ userId, id: params.proposalId })
  if (!proposal) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ proposal })
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request)
  invariant(params.proposalId, 'proposalId not found')

  await deleteProposal({ userId, id: params.proposalId })

  return redirect('/proposals')
}

export default function ProposalDetailsPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.proposal.title}</h3>
      <p className="py-6">{data.proposal.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Proposal not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
