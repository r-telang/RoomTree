import type { NextPage } from "next";

import AdminCard from "../../components/AdminCard";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";
import NothAuthorised from "../../components/NotAuthorised";
import useUnauthorisedUser from "../../utils/useUnauthorisedUser";

const MyOfficeSpaces: NextPage = () => {

    const allSpaces = trpc.catalog.getAllSpaces.useQuery();
    const [searchTerm, setSearchTerm] = useState("");

    const searchSpace = (e: React.FormEvent<HTMLInputElement>) => {
        const keyword = e.currentTarget.value;
        setSearchTerm(keyword);
        console.log(searchTerm)
    }
    const [filteredSpaces, setFilteredSpaces] = useState(allSpaces.data?.spaces)

    useEffect(() => {
        setFilteredSpaces(
            allSpaces.data?.spaces.filter((value) => {
                if (searchTerm === "") {
                    return true;
                }
                else if (JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase())) {
                    return true;
                }
                return false;
            })
        )

    }, [searchTerm, allSpaces.data?.spaces])


    if (useUnauthorisedUser()) {
        return <NothAuthorised />
    }

    return <div>
        <br />
        <div className="max-w-2xl mx-auto">

            <div className="container">

                <div className="row height d-flex justify-content-center align-items-center">

                    <div className="col-md-8">

                        <div className="search">

                            <input type="text" className="form-control" placeholder="Search Office Spaces" onChange={(e) => searchSpace(e)} />
                        </div>

                    </div>

                </div>
            </div>
        </div>
        <br />
        <div className="d-flex flex-wrap justify-content-center">
            {filteredSpaces?.map(space => <AdminCard key={space.id} space={space} />)}
        </div>
    </div>
}

export default MyOfficeSpaces