import Header from "../components/Header";
import "./GroupSpacePage.css";
import PList from "../components/CheckList/PList";
import GList from "../components/CheckList/GList";
import GroupProvider from "../context/GroupProvider";
import Sidebar from "../components/Sidebar";
import NeedClean from "../components/NeedClean/NeedClean";

function GroupSpacePage() {
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
                    <GList />
                </div>
            </div>
        </GroupProvider>
    );
}

export default GroupSpacePage;
