import { useEffect, useMemo } from "react"
import { create, open } from "react-native-plaid-link-sdk"
import * as Sentry from "@sentry/react-native"
import { useTRPC } from "@/src/providers/TRPCProvider"

export function useLinkToPlaid(tokenId?: string) {
  const t = useTRPC()

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

  useEffect(() => {
    if (!data?.token) {
      return
    }
    create({
      token: data.token,
      noLoadingState: true,
    })
  }, [tokenId, data?.token])

  const token = data?.token || null

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

  const openLink = () => {
    open({
      onSuccess: async (success) => {
        exchangePublicToken({
          publicToken: success.publicToken,
          accounts: success.metadata.accounts.map((account) => ({
            id: account.id,
            name: account.name,
            mask: account.mask,
            type: account.type,
          })),
        }).finally(() => {
          emit()
        })

        // create a new token for the next time
        createLinkToken()
      },
      onExit: () => {
        // create a new token for the next time
        createLinkToken()
      },
    })
  }

  return {
    // this is to match the contract with web
    ready: true,
    error,
    token,
    openLink,
  }
}
