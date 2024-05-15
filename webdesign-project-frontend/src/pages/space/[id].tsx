/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link"
import { trpc } from "../../utils/trpc";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import { useEffect, useState } from "react";
import type { TimeSlot } from "@prisma/client";
import dateFormat, { masks } from "dateformat";
import { Button } from "react-bootstrap";
import { useSession } from "next-auth/react";
import cuidToImageNum from "../../utils/cuidToImageNum";
// import Button from "react-bootstrap/esm/Button";


type ComponentState = {
    selectedDate: string | null;
    selectedTimeSlot: TimeSlot | null;
    selectedHours: number;
    bookButtonEnabled: boolean;
}

const OfficeSpace: NextPage = () => {

    const router = useRouter();
    const session = useSession()

    const { id } = router.query;

    const id_string: string = id?.toString() || ""

    const { data } = trpc.catalog.getSpaceById.useQuery({ id: id_string })

    const { mutate: bookSpace } = trpc.catalog.bookTimeSlots.useMutation({
        onSuccess: () => {
            alert("Space booked")
            router.push("/history")
        },
        onError: (err) => {
            alert("Unable to book the space. Please select a different time slot / space")
        }
    })

    const [state, setState] = useState<ComponentState>({
        selectedDate: null,
        selectedTimeSlot: null,
        selectedHours: 0,
        bookButtonEnabled: false
    })

    const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([] as TimeSlot[])

    const handleSelectDate = (e: string) => {
        setState({ ...state, selectedDate: e })
    }

    const handleSelectHours = (hours: number) => {
        setState({ ...state, selectedHours: hours })
    }

    const timeSlots = trpc.catalog.getTimeSlots.useQuery()

    const dateSet = new Set<string>()

    timeSlots.data?.timeSlots.forEach(time => {
        dateSet.add(time?.date?.toDateString())
    })

    useEffect(() => {
        if (!state.selectedDate) {
            console.log("No date selected")
            return setFilteredTimeSlots([])
        }

        console.log("Date selected " + state.selectedDate)

        console.log(timeSlots.data?.timeSlots.length)

        setFilteredTimeSlots(timeSlots.data?.timeSlots.filter(time => time.date.toDateString() === state.selectedDate) as TimeSlot[])

    }, [state.selectedDate])

    function formatTimeSlotAsTime(timeSlot: TimeSlot): string {
        const date = timeSlot.date

        return dateFormat(date, "hh:MM TT")
    }

    useEffect(() => {
        console.log({ selectedTimeSlot: state.selectedTimeSlot, selectedHours: state.selectedHours, selectedDate: state.selectedDate })

        if (!state.selectedTimeSlot || !state.selectedHours || !state.selectedDate) {
            return setState({ ...state, bookButtonEnabled: false })
        }

        setState({ ...state, bookButtonEnabled: true })

    }, [state.selectedTimeSlot, state.selectedHours, state.selectedDate])

    function handleBookButton() {
        if (!state.selectedDate || !state.selectedTimeSlot || !state.selectedHours) {
            alert("Select the details")
            return
        }

        if (!(session.status === "authenticated" && session.data)) {
            return alert("Log in to book the space")
        }

        const index = filteredTimeSlots.indexOf(state.selectedTimeSlot)

        const finalTimeSlots = filteredTimeSlots.slice(index, index + state.selectedHours)

        console.log({ finalTimeSlots })

        if (finalTimeSlots.length !== state.selectedHours) {
            const result = confirm("Only " + finalTimeSlots.length + " hours are available from that time slot. Do you want to book them?")

            if (!result) {
                return
            }
        }

        // booking logic
        bookSpace({
            spaceId: id_string,
            timeSlotIds: finalTimeSlots.map(ts => ts.id),
        })
    }

    return <>
        <div className="card container my-5">
            <img src={cuidToImageNum(id_string)} className="card-img-top img-thumbnail" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{data?.space?.title}</h5>
                <p className="card-text">{data?.space?.description}</p>
                <p className="card-text">{data?.space?.location.name}</p>

            </div>

            <div className="d-flex">
                <DropdownButton
                    title={state.selectedDate ? state.selectedDate : "Select Date"}
                    id="dropdown-menu-align-right"
                >
                    {[...dateSet].map((date, idx) => {
                        return <Dropdown.Item key={idx} eventKey={date} onClick={() => handleSelectDate(date)}>{date}</Dropdown.Item>
                    })}

                </DropdownButton>&nbsp;
                <DropdownButton
                    title={state.selectedTimeSlot ? formatTimeSlotAsTime(state.selectedTimeSlot) : "Select Time Slot"}
                    id="dropdown-menu-align-right"
                >
                    {filteredTimeSlots ? filteredTimeSlots.map((ts, idx) => {
                        return <Dropdown.Item key={idx} eventKey={ts.date.toString()}
                            onClick={() => setState({ ...state, selectedTimeSlot: ts })}
                        >{formatTimeSlotAsTime(ts)}</Dropdown.Item>
                    }) : <></>}
                </DropdownButton>&nbsp;
                <DropdownButton
                    title={state.selectedHours ? state.selectedHours : "Select number of hours"}
                    id="dropdown-menu-align-right"
                >
                    {[1, 2, 3, 4, 5].map((item, idx) => <Dropdown.Item key={item} eventKey={item}
                        onClick={() => handleSelectHours(item)}
                    >{item}</Dropdown.Item>)}

                </DropdownButton>&nbsp;
                <Button variant="primary" disabled={!state.bookButtonEnabled} onClick={() => handleBookButton()}>Book</Button>
                {/* <Link className={`btn btn-primary ${state.bookButtonEnabled ? "" : "disabled"}`} href={`/payment/${id}`} onClick={handleBookButton}>Book</Link> */}
            </div>
            <br />
        </div>

    </>
}

export default OfficeSpace