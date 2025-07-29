// import "./PListAddModal.css";
import "bootstrap/dist/css/bootstrap.min.css"; // 지우지 말기, 여기 css 맞춰둬서 없애면 전체 UI 빠게짐 (그룹홈/공간 페이지들도..)
import Select from "react-select";

const DropDown = ({ title, targetPlaceData, setCreateData, createData }) => {
    const options = targetPlaceData.map((place) => ({
        label: place.place, // 보일 값
        value: place.place, // DB에 전달될 값
    }));

    // 선택지에 띄울 정보 골라냄
    const selectedOption = options.find(
        (option) => option.value === createData.place
    );

    return (
        <div className="custom-dropdown-wrapper" style={{ width: "100%" }}>
            <label
                style={{
                    marginBottom: "8px",
                    display: "block",
                    fontWeight: "bold",
                }}
            >
                {title}
            </label>
            <Select
                classNamePrefix="custom-select"
                options={options}
                value={selectedOption}
                onChange={(option) =>
                    setCreateData({ ...createData, place: option.value })
                }
                placeholder="장소 선택"
                isSearchable={false}
                styles={{
                    control: (base) => ({
                        ...base,
                        height: "40px",
                        width: "145px",
                        borderRadius: "15px",
                        padding: "1px 8px",
                        fontSize: "1rem",
                        borderColor: "#ccc",
                        boxShadow: "none",
                        fontFamily: "inherit", // 상속
                        textAlign: "center",
                        "&:hover": { borderColor: "#8be2b6" },
                    }),
                    menu: (base) => ({
                        ...base,
                        borderRadius: 12,
                        overflow: "hidden",
                        zIndex: 9999,
                        fontFamily: "inherit",
                    }),
                    option: (base, state) => ({
                        ...base,
                        height: "40px",
                        backgroundColor: state.isSelected
                            ? "#9CE7C1"
                            : state.isFocused
                            ? "#f0f0f0"
                            : "white",
                        color: "black",
                        fontSize: "1rem",
                        padding: "8px 12px",
                        fontFamily: "inherit",
                    }),
                }}
            />
        </div>
    );
};

export default DropDown;
