import Header from "../components/Header";
import "./GroupSpacePage.css";
import PList from "../components/CheckList/PList";
import GList from "../components/CheckList/GList";
import GroupProvider from "../context/GroupProvider";

function GroupSpacePage() {
    return (
        <GroupProvider>
            <div className="GroupSpace">
                <Header />
                <div className="GroupSpaceContent">
                    <div className="sidebar">사이드바</div>
                    <div className="middle">
                        <div className="mostCleanNeeded">
                            지금 가장 청소가 필요한 공간
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
