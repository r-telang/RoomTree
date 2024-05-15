import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Payment: NextPage = () => {

    const router = useRouter()

    const { id } = router.query;


    const [name, setName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvc, setCvc] = useState("")

    console.log(id)

    return <>

        <div className="container p-0 mx-auto my-5">


            <h2 className="h1-responsive font-weight-bold text-center my-4">Booking</h2>


            <div className="row">


                <div className="col-md-9 mb-md-0 mb-5">
                    <form id="contact-form" name="contact-form" action="">

                        <div className="row">

                            <div className="col-md-6">
                                <div className="md-form mb-0">
                                    <input type="text" id="name" name="name" className="form-control" />
                                    <p className="text mb-1">Name</p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="md-form mb-0">
                                    <input type="text" id="email" name="email" className="form-control" />
                                    <p className="text mb-1">Email</p>
                                </div>
                            </div>


                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="md-form mb-0">
                                    <input type="number" id="subject" name="subject" className="form-control" />
                                    <p className="text mb-1">Phone Number</p>
                                </div>
                            </div>
                        </div>

                    </form>


                </div>

            </div>

        </div>
        <div className="container p-0 mx-auto my-5">
            <div className="card px-4">
                <p className="h8 py-3">Payment Details</p>
                <div className="row gx-3">
                    <div className="col-12">
                        <div className="d-flex flex-column">
                            <p className="text mb-1">Person Name</p>
                            <input className="form-control mb-3" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="d-flex flex-column">
                            <p className="text mb-1">Card Number</p>
                            <input className="form-control mb-3" type="number" placeholder="1234 5678 435678" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex flex-column">
                            <p className="text mb-1">Expiry</p>
                            <input className="form-control mb-3" type="text" placeholder="MM/YYYY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex flex-column">
                            <p className="text mb-1">CVV/CVC</p>
                            <input className="form-control mb-3 pt-2 " type="password" placeholder="***" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="btn btn-primary mb-3">
                            <span className="">Pay $243</span>
                            <span className="fas fa-arrow-right"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Payment