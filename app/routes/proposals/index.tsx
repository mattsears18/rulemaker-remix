import { Link } from '@remix-run/react'

export default function ProposalIndexPage() {
  return (
    <p>
      No proposal selected. Select a proposal on the left, or{' '}
      <Link to="new" className="text-blue-500 underline">
        create a new proposal.
      </Link>
    </p>
  )
}
