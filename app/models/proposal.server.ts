import type { User, Proposal } from '@prisma/client'

import { prisma } from '~/db.server'

export type { Proposal } from '@prisma/client'

export function getProposal({
  id,
  userId,
}: Pick<Proposal, 'id'> & {
  userId: User['id']
}) {
  return prisma.proposal.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  })
}

export function getProposalListItems({ userId }: { userId: User['id'] }) {
  return prisma.proposal.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export function createProposal({
  body,
  title,
  userId,
}: Pick<Proposal, 'body' | 'title'> & {
  userId: User['id']
}) {
  return prisma.proposal.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export function deleteProposal({
  id,
  userId,
}: Pick<Proposal, 'id'> & { userId: User['id'] }) {
  return prisma.proposal.deleteMany({
    where: { id, userId },
  })
}
