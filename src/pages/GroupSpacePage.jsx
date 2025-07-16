import Header from "../components/Header";
import "./GroupSpacePage.css";
import PList from "../components/GroupSpace/CheckList/Person/PList";
import GList from "../components/GroupSpace/CheckList/Group/GList";
import GroupProvider from "../context/GroupProvider";
import Sidebar from "../components/Sidebar";
import NeedClean from "../components/GroupSpace/NeedClean/NeedClean";
import { useState, useEffect, useContext } from "react";
import CreatedSpace from "../components/CreatedSpace";
import NoPersonSpace from "../components/GroupSpace/CreatedSpace/NoPersonSpace";

const PMockSpaces = [
    {
        item_name: "책상",
        start_x: 0,
        start_y: 0,
        width: 5,
        height: 3,
        size: 1,
        direction: "horizontal",
    },
    {
        item_name: "침대",
        start_x: 4,
        start_y: 4,
        width: 2,
        height: 2,
        size: 2,
        direction: "vertical",
    },
];

function GroupSpacePage() {
    const [selectedData, setSelectedData] = useState({});
    const [personSpaces, serPersonSpaces] = useState(PMockSpaces);

    // '그룹공간'의 '사이드바, 공간구조도'로부터 선택한 공간 뭔지 가져오는 함수 (하위->상위 파일로 정보 보내는 것)
    const getSelectedData = (data) => {
        setSelectedData(data);
    };

    return (
        <GroupProvider>
            <div className="GroupSpace">
                <Header />
                <div className="GroupSpaceContent">
                    <div className="sidebar">
                        <Sidebar getSelectedData={getSelectedData} />
                    </div>
                    <div className="middle">
                        <div className="mostCleanNeeded">
                            <NeedClean />
                        </div>
                        <div className="space">
                            <CreatedSpace
                                cellSize={60.65}
                                selectedData={selectedData}
                                // getSelectedData={getSelectedData} // 공간구조도 클릭 시 체크리스트 뜸 (잘못 구현함)
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
