import Header from "../components/Header";
import "./GroupSpacePage.css";
import PList from "../components/GroupSpace/CheckList/Person/PList";
import GList from "../components/GroupSpace/CheckList/Group/GList";
import GroupProvider from "../context/GroupProvider";
import Sidebar from "../components/Sidebar";
import NeedClean from "../components/GroupSpace/NeedClean/NeedClean";
import { useState, useEffect, useContext } from "react";
import CreatedSpace from "../components/CreatedSpace";

function GroupSpacePage() {
    const [selectedData, setSelectedData] = useState({});

    const getSidebarData = (data) => {
        setSelectedData(data);
    };
    const getCreatedSpaceData = (data) => {
        setSelectedData(data);
    };
    console.log(selectedData);
    return (
        <GroupProvider>
            <div className="GroupSpace">
                <Header />
                <div className="GroupSpaceContent">
                    <div className="sidebar">
                        <Sidebar getSidebarData={getSidebarData} />
                    </div>
                    <div className="middle">
                        <div className="mostCleanNeeded">
                            <NeedClean />
                        </div>
                        <div className="space">
                            <CreatedSpace
                                cellSize={60.65}
                                getCreatedSpaceData={getCreatedSpaceData}
                            />
                        </div>
                    </div>
                    {selectedData.space_type == 0 ? (
                        <GList selectedPlace={selectedData.name} />
                    ) : (
                        <PList
                            selectedParentPlace={selectedData.name}
                            selectedName={selectedData.owner}
                        />
                    )}
                </div>
            </div>
        </GroupProvider>
    );
}

export default GroupSpacePage;
