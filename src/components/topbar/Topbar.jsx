import { useEffect } from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { selectAllMessages } from "../../redux/messageRedux";
import { getRefreshToken } from "../../requestMethods";


const Topbar = () => {
  const user = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation(["topbar"]);
  const messages = useSelector(selectAllMessages);
  const numUnreadMessages = messages?.filter(n => !n?.read).length;

  const handleLanguage = (e) => {
    i18n.changeLanguage(e.target.value)
  };
  
  useEffect(() => {
    if (localStorage.getItem("i18nextLng")?.length > 2) {
      i18next.changeLanguage("en");
    }
  }, []);

  useEffect(() => {
    if (!user) {
      // Navigate to login page if user is logged out
      navigate("/login");
    }
  }, [user, navigate]);
  
  const handleClick = (e) => {
    e.preventDefault();
    const refreshTokenId = getRefreshToken().refreshTokenId;
    logout(dispatch, { refreshTokenId });
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <Link to="/" style={{ textDecoration: 'none'}}>
            <span className="logo">{t("logo")}</span>
          </Link>
        </div>
        <div className="topRight">
          {user
            ? <button className="logoutButton" onClick={(e) => handleClick(e)}>{t("logout")}</button>
            : <Link to="/login" className="logoutButton">{t("login")}</Link>
          }
          <Link to="/messages"> 
            <div className="topbarIconContainer">
              <NotificationsNone />
              {numUnreadMessages > 0 && <span className="topIconBadge">{numUnreadMessages}</span>}
            </div>
          </Link>
          <div className="topbarIconContainer">
            <Language />
            <select 
              className="selectLanguage"
              onChange={handleLanguage} 
              value={localStorage.getItem("i18nextLng")}
            >
              <option value="en">EN</option>
              <option value="ua">UA</option>
            </select>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <img src="https://firebasestorage.googleapis.com/v0/b/shop-80015.appspot.com/o/grape-icon.png?alt=media&token=edb90e89-ed75-4e1d-b172-d92fdaba92bb" alt="" className="topAvatar" />
        </div>
      </div>
    </div>
  );
}

export default Topbar