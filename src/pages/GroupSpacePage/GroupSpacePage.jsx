import Header from "../../components/Header";
import "./GroupSpacePage.css";
import PList from "../../components/GroupSpace/CheckList/Person/PList";
import GList from "../../components/GroupSpace/CheckList/Group/GList";
import GroupProvider from "../../context/GroupProvider";
import Sidebar from "../../components/Sidebar";
import NeedClean from "../../components/GroupSpace/NeedClean/NeedClean";
import { useState, useEffect, useContext, createContext, useRef } from "react";
import CreatedSpace from "../../components/CreatedSpace";
import NoPersonSpace from "../../components/GroupSpace/CreatedSpace/NoPersonSpace";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export const TriggerStateContext = createContext();
export const TriggerSetStateContext = createContext();

function GroupSpacePage() {
    const [selectedData, setSelectedData] = useState({});
    const [isSubspace, setIsSubspace] = useState([]);
    const [clickedDiagram, setClickedDiagram] = useState({});
    const [trigger, setTrigger] = useState(0);
    const [loadedComponents, setLoadedComponents] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);
    const [owner, setOwner] = useState("");
    const prevSpaceTypeRef = useRef();

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const res = await axiosInstance.get("/mypage/info/");
                setOwner(res.data.data.name);
            } catch (error) {
                console.error("로그인 주체 불러옴:", error);
            }
        };
        fetchOwner();
    }, []);

    // 사이드바 클릭 시 로딩창 뜨게 함 (공용->개인공간으로 옮겼을 때, 개인공간 중에서 움직였을 때)
    // '일정시간 timeout'시킴 (백에서 데이터 다 불러왔을 때하면 코드 수정할게 많아서)
    useEffect(() => {
        const prev = prevSpaceTypeRef.current;
        const curr = selectedData?.space_type;

        setIsLoadingSidebar(true);

        if (curr !== prev) {
            // 변경이 일어났을 때만 1초 대기
            const timer = setTimeout(() => {
                setIsLoadingSidebar(false);
            }, 1500);

            // 다음 비교를 위해 현재값 저장
            prevSpaceTypeRef.current = curr;

            return () => clearTimeout(timer);
        } else if (selectedData.space_type === 1) {
            const timer = setTimeout(() => {
                setIsLoadingSidebar(false);
            }, 900);
            return () => clearTimeout(timer);
        } else {
            // 변경 없으면 바로 끔
            setIsLoadingSidebar(false);
            prevSpaceTypeRef.current = curr;
        }
    }, [selectedData]);

    const totalComponents = 3; // 로딩을 기다릴 컴포넌트 수 (그룹공간 페이지, 가장 청소 필요한 공간(제일 나중에 불려오길래, 잔머리?로 얘만 컴포넌트 세 줌))
    const handleComponentLoaded = () => {
        setLoadedComponents((prev) => {
            const next = prev + 1;
            if (next === totalComponents) setIsLoading(false);
            return next;
        });
    };

    const nav = useNavigate();
    // '그룹공간'의 '사이드바'로부터 선택한 공간 뭔지 가져오는 함수 (하위->상위 파일로 정보 보내는 것)
    const getSelectedData = (data) => {
        setSelectedData(data);
    };
    // 선택한 '도형(하위공간)'이 뭔지 가져오는 함수
    const getClickedDiagram = (data) => {
        setClickedDiagram({
            space_name: data.space_name,
        });
        selectedData.isClickedSidebar = false;
    };

    // 각 개인공간 id에 해당하는 Data만 가져옴
    useEffect(() => {
        const fetchSpaces = async () => {
            try {
                const response = await axiosInstance.get("/spaces/info/");
                const spaces = response.data.data;
                setIsSubspace(
                    spaces.find(
                        (space) => space.space_name === selectedData.name
                    )?.items.length !== 0
                );
            } catch (error) {
                console.error("spaces 불러오기 실패: ", error);
            } finally {
                handleComponentLoaded();
            }
        };

        fetchSpaces();
    }, [selectedData]);

    console.log(owner, selectedData);

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
                            <TriggerStateContext.Provider value={trigger}>
                                <div className="mostCleanNeeded">
                                    <NeedClean
                                        onLoaded={handleComponentLoaded}
                                    />
                                </div>
                            </TriggerStateContext.Provider>
                            {selectedData.space_type &&
                            owner !== selectedData.owner ? (
                                <div className="editSpace_null"></div>
                            ) : (
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
                                                          spaceId:
                                                              selectedData.id,
                                                      },
                                                  }
                                              ); // pull하고 바꾸기
                                    }}
                                />
                            )}
                            <TriggerStateContext.Provider value={trigger}>
                                <div className="space">
                                    {/* '/' 기준 '참/거짓'이라할 때 ==> 공간구조도 -> 그룹/개인 -> 그룹공간구조도/(개인 공간구조도 만들기 전 -> 만들기 페이지/개인공간구조도)*/}
                                    {selectedData.space_type === 0 ? (
                                        <CreatedSpace
                                            type={"GroupSpace"}
                                            space_type={0}
                                            selectedData={selectedData}
                                            onLoaded={handleComponentLoaded}
                                        />
                                    ) : isSubspace ? ( // 개인공간의 루트공간과, 선택한 루트공간이 같다면
                                        <CreatedSpace
                                            type={"GroupSpace"}
                                            space_type={1}
                                            selectedData={selectedData}
                                            getClickedDiagram={
                                                getClickedDiagram
                                            }
                                            onLoaded={handleComponentLoaded}
                                        />
                                    ) : (
                                        <NoPersonSpace
                                            selectedData={selectedData}
                                        />
                                    )}
                                </div>
                            </TriggerStateContext.Provider>
                        </div>
                        <TriggerSetStateContext.Provider value={setTrigger}>
                            <TriggerStateContext.Provider value={trigger}>
                                {selectedData.space_type === 0 ? ( // 그룹 공간이면 GList 띄움
                                    <GList selectedPlace={selectedData.name} />
                                ) : selectedData.isClickedSidebar ? ( // 개인 공간에서 선택된 공간이 있다면 -> 개인별 체크리스트 띄워줌
                                    <PList
                                        selectedParentPlace={selectedData.name}
                                        selectedName={selectedData.owner}
                                    />
                                ) : (
                                    // 개인 공간 도형이 선택되면 -> 해당 공간 도형별 개인 체크리스트 띄워줌
                                    <GList
                                        selectedData={selectedData}
                                        selectedPlace={
                                            clickedDiagram.space_name
                                        }
                                    />
                                )}
                            </TriggerStateContext.Provider>
                        </TriggerSetStateContext.Provider>
                        {!isLoading &&
                            isLoadingSidebar && ( // 그룹공간 페이지 불러올 때는 안 뜨게 하는 것 ('!isLoading &&' === 그룹공간페이지 로딩중 뜨면 사이드바 클릭 시 로딩은 없어진다, 안쓰면 그룹공간 불러올 때 중복돼서 뜸)
                                <div className="save-overlay-sidebar">
                                    <div className="save-spinner-sidebar"></div>
                                    <div className="save-message-sidebar">
                                        잠시만 기다려주세요 <br />
                                        그룹 정보를 불러오는 중입니다 ...
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="save-overlay">
                    <div className="save-spinner"></div>
                    <div className="save-message">
                        잠시만 기다려주세요 <br />
                        그룹 정보를 불러오는 중입니다 ...
                    </div>
                </div>
            )}
        </GroupProvider>
    );
}

export default GroupSpacePage;
