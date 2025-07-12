import Header from "../components/Header";
import "./GroupSpacePage.css";
import PList from "../components/GroupSpace/CheckList/Person/PList";
import GList from "../components/GroupSpace/CheckList/Group/GList";
import GroupProvider from "../context/GroupProvider";
import Sidebar from "../components/Sidebar";
import NeedClean from "../components/GroupSpace/NeedClean/NeedClean";
import { useState } from "react";

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
                        <Sidebar />
                    </div>
                    <div className="middle">
                        <div className="mostCleanNeeded">
                            <NeedClean />
                        </div>
                        <div className="space">공간</div>
                    </div>
                    <PList />
                </div>
            </div>
        </GroupProvider>
    );
}

export default GroupSpacePage;
