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

const PMockSpaces = [
    // {
    //     item_name: "책상",
    //     start_x: 0,
    //     start_y: 0,
    //     width: 5,
    //     height: 3,
    //     size: 1,
    //     direction: "horizontal",
    // },
    // {
    //     item_name: "침대",
    //     start_x: 4,
    //     start_y: 4,
    //     width: 2,
    //     height: 2,
    //     size: 2,
    //     direction: "vertical",
    // },
];

function GroupSpacePage() {
    const [selectedData, setSelectedData] = useState({});
    const [personSpaces, setPersonSpaces] = useState(PMockSpaces);
    const nav = useNavigate();

    // '그룹공간'의 '사이드바, 공간구조도'로부터 선택한 공간 뭔지 가져오는 함수 (하위->상위 파일로 정보 보내는 것)
    const getSelectedData = (data) => {
        setSelectedData(data);
    };

    // const localStorageData = JSON.parse(
    //     localStorage.getItem(`spaces_${selectedData.id}`)
    // );
    // console.log(localStorageData);
    // useEffect(() => localStorageData && setPersonSpaces(localStorageData), []);

    return (
        <GroupProvider>
            <div className="GroupSpace">
                <Header />
                <div className="GroupSpaceContent">
                    <div className="sidebar">
                        <Sidebar getSelectedData={getSelectedData} />
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
                                onClick={
                                    () =>
                                        selectedData.owner === "all"
                                            ? nav("/createSpace")
                                            : nav(
                                                  `/createItem/${selectedData.id}`,
                                                  {
                                                      state: {
                                                          spaceId:
                                                              selectedData.id,
                                                      },
                                                  }
                                              ) // pull하고 바꾸기
                                }
                            />
                            {console.log(selectedData)}
                            <div className="space">
                                {/* '/' 기준 '참/거짓'이라할 때 ==> 공간구조도 -> 그룹/개인 -> 그룹공간구조도/(개인 공간구조도 만들기 전 -> 만들기 페이지/개인공간구조도)*/}
                                {!selectedData.space_type ? (
                                    <CreatedSpace
                                        type={"GroupSpace"}
                                        space_type={0}
                                        selectedData={selectedData}
                                        // getSelectedData={getSelectedData} // 공간구조도 클릭 시 체크리스트 뜸 (잘못 구현함)
                                    />
                                ) : personSpaces.length === 0 ? (
                                    <NoPersonSpace
                                        selectedData={selectedData}
                                    />
                                ) : (
                                    <CreatedSpace
                                        type={"GroupSpace"}
                                        space_type={1}
                                        selectedData={selectedData}
                                        // getSelectedData={getSelectedData} // 공간구조도 클릭 시 체크리스트 뜸 (잘못 구현함)
                                    />
                                )}
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
            </div>
        </GroupProvider>
    );
}

export default GroupSpacePage;
