import "./widgetSm.css";
import { Visibility } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { userRequest } from '../../requestMethods';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';


const WidgetSm = () => {
  const { t } = useTranslation(["widgetSm"])
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await userRequest.get("users/?new=true")
        !ignore && setUsers(res.data)
      } catch(err) {
        console.log(err);
      }
    })();

    return () => {
      ignore = true
    };
  }, []);
  
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">{t("newJoinMembers")}</span>
      <ul className="widgetSmList">
        {users?.map((user) => (
          <li className="widgetSmListItem" key={user._id}>
            <div className="widgetSmUserBlock">
              <img
                src={user.img ||
                  "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
                }
                alt=""
                className="widgetSmImg"
                />
              <div className="widgetSmUser">
                <span className="widgetSmUsername">{user.username}</span>
                <span className="widgetSmEmail">{user.email}</span>
              </div>
            </div>
            <NavLink to={`/user/${user._id}`}>
              <button className="widgetSmButton">
                <Visibility className="widgetSmIcon" />
                {t("display")}
              </button>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WidgetSm;
