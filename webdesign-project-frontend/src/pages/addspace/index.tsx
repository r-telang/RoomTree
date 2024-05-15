import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import Dropdown from 'react-bootstrap/Dropdown'
import { useState } from "react";
import type { Location } from "@prisma/client";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useRouter } from "next/router";
import useUnauthorisedUser from "../../utils/useUnauthorisedUser";
import NothAuthorised from "../../components/NotAuthorised";


type ComponentState = {
    showModal: boolean;
    newLocationName: string;
    selectedLocation: Location | null;
    name: string;
    description: string;
}

const AddOfficeSpace: NextPage = () => {

    const locations = trpc.catalog.getLocations.useQuery();
    const router = useRouter();


    const { mutate } = trpc.catalog.addLocation.useMutation({
        onSuccess: () => {
            locations.refetch();

            setState({ ...state, showModal: false, newLocationName: "" });
        }
    })

    const { mutate: addSpace } = trpc.catalog.addSpace.useMutation({
        onSuccess: (params) => {
            router.push(`/space/${params.id}`)
        }
    })

    const [state, setState] = useState<ComponentState>({
        showModal: false,
        newLocationName: "",
        selectedLocation: null,
        name: "",
        description: "",
    });

    const handleModelOkClick = async () => {
        setState({ ...state, showModal: false });
        mutate({ name: state.newLocationName })
    }

    const handleAddSpaceClick = async () => {

        if (state.name == "" || state.description == "" || !state.selectedLocation) {
            return alert("Please fill all fields")
        }


        addSpace({
            title: state.name,
            description: state.description,
            locationId: state.selectedLocation?.id + ""
        })
    }

    if (useUnauthorisedUser()) {
        return <NothAuthorised />
    }

    return <div className="container">
        <br />
        <h1>Add new workspace</h1>
        <br />
        <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
            <div className="col-md-8">
                <input type="text" className="form-control" id="inputtext4" placeholder="Enter Name" value={state.name}
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                />
            </div>

            <div className="col-md-8">
                <input type="text" className="form-control" id="inputAddress" placeholder="Enter Description"
                    value={state.description}
                    onChange={(e) => setState({ ...state, description: e.target.value })}
                />
            </div>

            <div className="col-md-8">
                <div>
                    <div><span>Select Location</span></div>
                    <Dropdown>
                        <Dropdown.Toggle variant="success">{state.selectedLocation ? state.selectedLocation.name : "Select Location"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {locations.data?.locations?.map((item, idx) => (
                                <Dropdown.Item key={idx} onClick={() => {
                                    setState({ ...state, selectedLocation: item });
                                }
                                }>
                                    {item.name}
                                </Dropdown.Item>
                            ))}
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setState({ ...state, showModal: true })}>Add New Location</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown><br />
                </div>
            </div>
            <div className="col-12">
                <button type="submit" className="btn btn-primary" onClick={handleAddSpaceClick}>Add</button>
            </div>
        </form>

        <Modal show={state.showModal} onHide={() => { setState({ ...state, showModal: false }) }}>
            <Modal.Header closeButton>
                <Modal.Title>Add a new Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Location Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Location Name"
                            value={state.newLocationName}
                            onChange={(e) => setState({ ...state, newLocationName: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { setState({ ...state, showModal: false }) }}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleModelOkClick}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
}

export default AddOfficeSpace