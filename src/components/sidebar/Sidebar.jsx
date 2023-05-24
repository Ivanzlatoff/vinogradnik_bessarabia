import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
  Shop
} from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import { selectAllMessages } from "../../redux/messageRedux";

const SideBarLink = ({ to, children }) => 
  <NavLink 
    to={to} 
    children={children} 
    className={({ isActive }) => "sidebarListItem" + (isActive ? " active" : "")} 
  />


export const Sidebar = () => {
  const { t } = useTranslation(["sidebar"]);
  const messages = useSelector(selectAllMessages);
  const numUnreadMessages = messages?.filter(n => !n?.read).length;

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">{t("dashboard")}</h3>
          <ul className="sidebarList">
            <SideBarLink to="/">
                <LineStyle className="sidebarIcon" />
                {t("home")}
            </SideBarLink>
            <SideBarLink to="/analytics">
              <Timeline className="sidebarIcon" />
              {t("analytics")}
            </SideBarLink>
            <SideBarLink to="/sales">
                <TrendingUp className="sidebarIcon" />
                {t("sales")}
            </SideBarLink>
            <SideBarLink to="/orders">
                <Shop className="sidebarIcon" />
                {t("orders")}
            </SideBarLink>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">{t("quickMenu")}</h3>
          <ul className="sidebarList">
            <SideBarLink to="/users">
                <PermIdentity className="sidebarIcon" />
                {t("users")}
            </SideBarLink>
            <SideBarLink to="/products">
                <Storefront className="sidebarIcon" />
                {t("products")}
            </SideBarLink>
            <SideBarLink to="/transactions">
              <AttachMoney className="sidebarIcon" />
              {t("transactions")}
            </SideBarLink>
            <SideBarLink to="/reports">
              <BarChart className="sidebarIcon" />
              {t("reports")}
              </SideBarLink>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">{t("messages")}</h3>
          <ul className="sidebarList">
            <SideBarLink to="/mail">
              <MailOutline className="sidebarIcon" />
              {t("mail")}
            </SideBarLink>
            <SideBarLink to="/feedback">
              <DynamicFeed className="sidebarIcon" />
              {t("feedback")}
            </SideBarLink>
            <SideBarLink to="/messages">
              <ChatBubbleOutline className="sidebarIcon" />
              {t("messages")} {numUnreadMessages > 0 && `(${numUnreadMessages})`}
            </SideBarLink>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">{t("staff")}</h3>
          <ul className="sidebarList">
            <SideBarLink to="/manage">
              <WorkOutline className="sidebarIcon" />
              {t("manage")}
              </SideBarLink>
            <SideBarLink to="/staff_analytics">
              <Timeline className="sidebarIcon" />
              {t("analytics")}
            </SideBarLink>
            <SideBarLink to="/staff_reports">
              <Report className="sidebarIcon" />
              {t("reports")}
            </SideBarLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
