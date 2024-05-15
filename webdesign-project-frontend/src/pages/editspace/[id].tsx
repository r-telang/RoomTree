import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import type { Location } from "@prisma/client";
import Dropdown from 'react-bootstrap/Dropdown'
import cuidToImageNum from "../../utils/cuidToImageNum";


const OfficeSpace: NextPage = () => {

    const locations = trpc.catalog.getLocations.useQuery();

    type ComponentState = {
        showModal: boolean;
        selectedLocation: Location | undefined;
        name: string;
        description: string;
    }

    const router = useRouter();

    const { id } = router.query;

    const id_string: string = id?.toString() || ""

    const { data, refetch: refetchSpace } = trpc.catalog.getSpaceById.useQuery({ id: id_string })

    const [show, setShow] = useState(false);

    const { mutate: editSpace } = trpc.catalog.editSpace.useMutation({
        onSuccess: () => {
            refetchSpace()
        }
    })

    const { mutate: deleteSpace } = trpc.catalog.deleteSpace.useMutation({
        onSuccess: () => {
            router.replace("/myspaces")
        }
    })

    const [state, setState] = useState<ComponentState>({
        showModal: false,
        selectedLocation: data?.space?.location,
        name: data?.space?.title || "",
        description: data?.space?.description || "",
    });

    const handleRemove = async () => {
        deleteSpace({
            id: id_string,
        })
    }

    const handleSaveChanges = async () => {
        editSpace({
            id: id_string,
            title: state.name,
            description: state.description,
            locationId: state.selectedLocation?.id + ""
        })
        setShow(false)
    }

    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const [showRemove, setShowRemove] = useState(false);

    const handleCloseRemove = () => setShowRemove(false);
    const handleShowRemove = () => setShowRemove(true);

    return <>
        <div className="card container my-5">
            <img src={cuidToImageNum(id_string)} className="card-img-top img-thumbnail" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{data?.space?.title}</h5>
                <p className="card-text">{data?.space?.description}</p>
                <p className="card-text">{data?.space?.location.name}</p>

            </div>

            <div className="d-flex">
                <Button variant="primary" onClick={handleShow}>
                    Edit
                </Button>
                &nbsp;
                <Button variant="danger" onClick={handleShowRemove}>
                    Remove
                </Button>
            </div>
            <br />
        </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body><Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" defaultValue={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" defaultValue={state.description} onChange={(e) => setState({ ...state, description: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Location</Form.Label>
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

                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
            </Form></Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type="submit" variant="primary" onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>

        <Modal show={showRemove} onHide={handleCloseRemove}>
            <Modal.Header closeButton>
                <Modal.Title>Remove Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseRemove}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleRemove}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>

    </>
}

export default OfficeSpace