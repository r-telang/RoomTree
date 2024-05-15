import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import BookingHistoryCard from "../../components/BookingHistoryCard";
import LogInToViewThisPage from "../../components/LogInToViewThisPage";
import { trpc } from "../../utils/trpc";

const HistoryPage: NextPage = () => {

    const { data: sessionData } = useSession();

    const history = trpc.catalog.getMyBookings.useQuery()


    console.log(history)

    if (!sessionData?.user) {
        return <LogInToViewThisPage />
    }

    return <>
        {history.data?.spaces.map((item) => <BookingHistoryCard key={item.id} history={item} />)}
    </>
}

export default HistoryPage
