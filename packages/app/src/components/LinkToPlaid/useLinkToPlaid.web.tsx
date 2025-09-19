import { useEffect, useMemo } from "react"
import { usePublishEvent } from "@onerlaw/framework/frontend/utils"
import { trpc } from "../../common/contexts/TRPCContext"
import * as Sentry from "@sentry/react-native"
import { usePlaidLink } from "react-plaid-link"
import { EmitterEvent } from "../../common/utils/events"

export function useLinkToPlaid(tokenId?: string) {
  const emit = usePublishEvent<EmitterEvent>("plaid_link_success")

  const {
    data: createData,
    error: createError,
    mutateAsync: createLinkToken,
  } = trpc.createLinkToken.useMutation()
  const {
    data: updateData,
    error: updateError,
    mutateAsync: updateLinkToken,
  } = trpc.updateLinkToken.useMutation()
  const { mutateAsync: exchangePublicToken, error: exchangeError } =
    trpc.exchangePublicToken.useMutation()

  useEffect(() => {
    if (tokenId) {
      updateLinkToken({
        tokenId,
      })
    } else {
      createLinkToken()
    }
  }, [tokenId, createLinkToken, updateLinkToken])

  const data = tokenId ? updateData : createData
  const error = tokenId ? updateError : createError

  const token = data?.token || null

  // this is also web only, so we shouldn't call it unless we are on the web platform
  const { open, ready } = usePlaidLink({
    token,
    // @todo the second argument is a metadata object so we could
    // display data right away technically
    onSuccess: async (publicToken, metadata) => {
      exchangePublicToken({
        publicToken,
        accounts: metadata.accounts.map((account) => ({
          id: account.id,
          name: account.name,
          mask: account.mask,
          type: account.type,
        })),
      })
      emit()
    },
  })

  // notify sentry of the error since we want to render nothing if it fails
  useMemo(() => {
    if (!error) {
      return
    }
    Sentry.captureException(error)
  }, [error])

  useMemo(() => {
    if (!exchangeError) {
      return
    }
    Sentry.captureException(exchangeError)
  }, [exchangeError])

  return {
    ready,
    error,
    token,
    openLink: open,
  }
}
