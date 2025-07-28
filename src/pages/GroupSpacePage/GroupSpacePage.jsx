import Header from "../../components/Header";
import "./GroupSpacePage.css";
import PList from "../../components/GroupSpace/CheckList/Person/PList";
import GList from "../../components/GroupSpace/CheckList/Group/GList";
import GroupProvider from "../../context/GroupProvider";
import Sidebar from "../../components/Sidebar";
import NeedClean from "../../components/GroupSpace/NeedClean/NeedClean";
import { useState, useEffect, useContext } from "react";
import CreatedSpace from "../../components/CreatedSpace";
import NoPersonSpace from "../../components/GroupSpace/CreatedSpace/NoPersonSpace";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

// const PMockSpaces = [
//     // {
//     //     item_name: "책상",
//     //     start_x: 0,
//     //     start_y: 0,
//     //     width: 5,
//     //     height: 3,
//     //     size: 1,
//     //     direction: "horizontal",
//     // },
//     // {
//     //     item_name: "침대",
//     //     start_x: 4,
//     //     start_y: 4,
//     //     width: 2,
//     //     height: 2,
//     //     size: 2,
//     //     direction: "vertical",
//     // },
// ];

function GroupSpacePage() {
    const [selectedData, setSelectedData] = useState({});
    const [personSpaces, setPersonSpaces] = useState([]);
    const [clickedDiagram, setClickedDiagram] = useState({});
    const nav = useNavigate();
    // '그룹공간'의 '사이드바'로부터 선택한 공간 뭔지 가져오는 함수 (하위->상위 파일로 정보 보내는 것)
    const getSelectedData = (data) => {
        setSelectedData(data);
        clickedDiagram.clickedSidebar = true; // 개인공간에서 장소 클릭했던거 꺼야지 사이드바 클릭 가능해서 (사이드바 클릭 시를 useEffect로 주고 clickedDiagram 꺼버린 것)
    };

    // 선택한 '도형(하위공간)'이 뭔지 가져오는 함수
    const getClickedDiagram = (data) => {
        setClickedDiagram({
            space_name: data.item_name,
            clickedSidebar: false,
        });
    };
    console.log(selectedData);

    // 각 개인공간 id에 해당하는 Data만 가져옴
    useEffect(() => {
        // setPersonSpaces(localStorageData || []);
    }, [selectedData]);

    return (
        <GroupProvider>
            <div className="GroupSpace">
                <Header />
                <div className="GroupSpaceContent">
                    <div className="sidebar">
                        <Sidebar
                            getSelectedData={getSelectedData}
                            selectedData={selectedData}
                        />
                    </div>
                    <div className="NClean_space_List">
                        <div className="middle">
                            <div className="mostCleanNeeded">
                                <NeedClean />
                            </div>
                            {/* {personSpaces.length !== 0 && ( */}
                            <Button
                                type="editSpace"
                                text={"공간 편집"}
                                onClick={() => {
                                    selectedData.owner === "all"
                                        ? nav("/createSpace")
                                        : nav(
                                              `/createItem/${selectedData.id}`,
                                              {
                                                  state: {
                                                      spaceId: selectedData.id,
                                                  },
                                              }
                                          ); // pull하고 바꾸기
                                }}
                            />
                            <div className="space">
                                {/* '/' 기준 '참/거짓'이라할 때 ==> 공간구조도 -> 그룹/개인 -> 그룹공간구조도/(개인 공간구조도 만들기 전 -> 만들기 페이지/개인공간구조도)*/}
                                {selectedData.space_type === 0 ? (
                                    <CreatedSpace
                                        type={"GroupSpace"}
                                        space_type={0}
                                        selectedData={selectedData}
                                        // getSelectedData={getSelectedData} // 공간구조도 클릭 시 체크리스트 뜸 (잘못 구현함)
                                    />
                                ) : personSpaces.length > 0 &&
                                  personSpaces[0].parent_space_id ===
                                      selectedData.id ? ( // 개인공간의 루트공간과, 선택한 루트공간이 같다면
                                    <CreatedSpace
                                        type={"GroupSpace"}
                                        space_type={1}
                                        selectedData={selectedData}
                                        getClickedDiagram={getClickedDiagram}
                                        // getSelectedData={getSelectedData} // 공간구조도 클릭 시 체크리스트 뜸 (잘못 구현함)
                                    />
                                ) : (
                                    <NoPersonSpace
                                        selectedData={selectedData}
                                    />
                                )}
                            </div>
                        </div>
                        {selectedData.space_type === 0 ? ( // 그룹 공간이면 GList 띄움
                            <GList selectedPlace={selectedData.name} />
                        ) : clickedDiagram.clickedSidebar ? ( // 개인 공간에서 선택된 공간이 있다면 -> 개인별 체크리스트 띄워줌
                            <PList
                                selectedParentPlace={selectedData.name}
                                selectedName={selectedData.owner}
                            />
                        ) : (
                            // 개인 공간 도형이 선택되면 -> 해당 공간 도형별 개인 체크리스트 띄워줌
                            <GList
                                selectedData={selectedData}
                                selectedPlace={clickedDiagram.space_name}
                            />
                        )}
                    </div>
                </div>
            </div>
        </GroupProvider>
    );
}

export default GroupSpacePage;
