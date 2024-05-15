import { useSession } from "next-auth/react"
import { trpc } from "./trpc"

function useUnauthorisedUser() {
    const { data: sessionData } = useSession()

    const email = sessionData?.user?.email + ""

    const isAdminUser = trpc.user.isUserAdmin.useQuery({ email: email }).data
    const isOwnerUser = trpc.user.isUserOwner.useQuery({ email: email }).data

    return (!isAdminUser && !isOwnerUser)

}

export default useUnauthorisedUser