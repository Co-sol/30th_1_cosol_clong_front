import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = ({ hideMenu }) => {
  return (
    <header className="HeadContainer">
      <div className="inner-Header">
        {/* 로고 영역 */}
        <div className="LogoWrapper">
          <NavLink to="/groupHome" className="logo-link">
            <img
              src="/assets/clong-logo.png"
              alt="clong logo"
              className="logo-img"
            />
          </NavLink>
        </div>

        {/* 메뉴 영역 */}
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
              to="/GroupJournal"
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
              className={({ isActive }) =>
                "mypage" + (isActive ? " active" : "")
              }
            >
              마이페이지
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
