import { useRouter } from "next/router";
import { Alert } from "react-bootstrap";

const NothAuthorised = () => {

    const router = useRouter();

    setTimeout(() => {
        router.replace("/catalog")
    }, 1000);

    return <div className="d-flex justify-content-center flex-nowrap my-5">
        <Alert variant="danger">
            <h1> You are not authorised to view this page. </h1>
        </Alert>
    </div>
}


export default NothAuthorised