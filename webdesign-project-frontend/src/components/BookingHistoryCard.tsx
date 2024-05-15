/* eslint-disable @next/next/no-img-element */
import dateFormat from "dateformat";
import { Button } from "react-bootstrap";
import cuidToImageNum from "../utils/cuidToImageNum";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import type { Unpacked } from "../utils/typehelpers";

type HistoryOutput = RouterOutputs["catalog"]["getMyBookings"]["spaces"]

type BookingHistoryProps = {
    history: Unpacked<HistoryOutput>
}
const mystyle = {
    height: "150px",
    width: "235px"
};

const BookingHistoryCard = (props: BookingHistoryProps) => {
    const toTime = new Date(props.history.timeSlot.date)
    const history = trpc.catalog.getMyBookings.useQuery()

    const { mutate: cancel } = trpc.catalog.cancelBooking.useMutation({
        onSuccess: () => {
            alert("Booking cancelled")
            history.refetch()
        }
    })

    toTime.setHours(toTime.getHours() + 1)

    async function cancelBooking() {
        const result = confirm("Are you sure you want to cancel this booking?")
        if (result) {
            cancel({
                id: props.history.id
            })
        }
    }

    return <div className="container card flex-row flex-wrap my-3 py-4">
        <div className="card-header border-0">
            <img src={cuidToImageNum(props.history.spaceId + "")} style={mystyle} alt="" />
        </div>
        <div className="card-block px-2">
            <h4 className="card-title">{props.history.space.title}</h4>
            <h6 className="card-text">{props.history.space.description} @ {props.history.space.location.name}</h6>
            <h6 className="card-text">{dateFormat(props.history.timeSlot.date, "dd mmm yyyy hh:MM TT")} - {dateFormat(toTime, "hh:MM TT")}</h6>
            <Button variant="danger" className="my-4" onClick={cancelBooking}>Cancel Booking</Button>
        </div>
    </div>
}

export default BookingHistoryCard