import { NavLink } from "react-router-dom";
import "./Header.css";

<<<<<<< Updated upstream
const Header = ({ hideMenu }) => {
=======
const Header = () => {
>>>>>>> Stashed changes
  return (
    <header className="HeadContainer">
      <div className="inner-Header">
        {/* 로고 영역 */}
        <div className="LogoWrapper">
<<<<<<< Updated upstream
          <NavLink to="/groupHome" className="logo-link">
=======
          <NavLink to="/GroupHomePage" className="logo-link">
>>>>>>> Stashed changes
            <img
              src="/assets/clong-logo.png"
              alt="clong logo"
              className="logo-img"
            />
          </NavLink>
        </div>

        {/* 메뉴 영역 */}
<<<<<<< Updated upstream
        {!hideMenu && (
          <nav className="MenuWrapper">
            <NavLink
              to="/groupHome"
              className={({ isActive }) =>
                "menu-item" + (isActive ? " active" : "")
              }
            >
              그룹 홈
            </NavLink>
            <NavLink
              to="/groupSpace"
              className={({ isActive }) =>
                "menu-item" + (isActive ? " active" : "")
              }
            >
              그룹 공간
            </NavLink>
            <NavLink
              to="/GroupJournalPage"
              className={({ isActive }) =>
                "menu-item" + (isActive ? " active" : "")
              }
            >
              그룹 일지
            </NavLink>
          </nav>
        )}

        {/* 마이페이지 영역 */}
        {!hideMenu && (
          <div className="MypageWrapper">
            <NavLink
              to="/MyPage"
              className={({ isActive }) => "mypage" + (isActive ? " active" : "")}
            >
              마이페이지
            </NavLink>
          </div>
        )}
=======
        <nav className="MenuWrapper">
          <NavLink
            to="/GroupHomePage"
            className={({ isActive }) =>
              "menu-item" + (isActive ? " active" : "")
            }
          >
            그룹 홈
          </NavLink>
          <NavLink
            to="/createSpace"
            className={({ isActive }) =>
              "menu-item" + (isActive ? " active" : "")
            }
          >
            그룹 공간
          </NavLink>
          <NavLink
            to="/GroupJournalPage"
            className={({ isActive }) =>
              "menu-item" + (isActive ? " active" : "")
            }
          >
            그룹 일지
          </NavLink>
        </nav>

        {/* 마이페이지 영역 */}
        <div className="MypageWrapper">
          <NavLink
            to="/MyPage"
            className={({ isActive }) => "mypage" + (isActive ? " active" : "")}
          >
            마이페이지
          </NavLink>
        </div>
>>>>>>> Stashed changes
      </div>
    </header>
  );
};

export default Header;
