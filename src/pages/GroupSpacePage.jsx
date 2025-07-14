import Header from "../components/Header";
import "./GroupSpacePage.css";
import PList from "../components/GroupSpace/CheckList/Person/PList";
import GList from "../components/GroupSpace/CheckList/Group/GList";
import GroupProvider from "../context/GroupProvider";
import Sidebar from "../components/Sidebar";
import NeedClean from "../components/GroupSpace/NeedClean/NeedClean";
import { useState, useEffect } from "react";
import CreatedSpace from "../components/CreatedSpace";

function GroupSpacePage() {
    const [SidebarData, setSidebarData] = useState({});

    const getSidebarData = (data) => {
        setSidebarData(data);
    };

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
                                callfrom="GroupSpace"
                            />
                        </div>
                    </div>
                    {SidebarData.space_type == 0 ? (
                        <GList selectedPlace={SidebarData.name} />
                    ) : (
                        <PList
                            selectedParentPlace={SidebarData.name}
                            selectedName={SidebarData.owner}
                        />
                    )}
                </div>
            </div>
        </GroupProvider>
    );
}

export default GroupSpacePage;
