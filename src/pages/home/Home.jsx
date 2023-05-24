import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useState, useMemo, useEffect } from "react";
import { userRequest } from "../../requestMethods";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


const Home = () => {
  const { t } = useTranslation(["home"]);
  const [userStats, setUserStats] = useState([]);
  const user = useSelector(state => state.user);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    []
  );

  useEffect(() => {
    let ignore = false;
    (user && (async () => {
      try {
        const res = await userRequest.get("/users/stats");
        !ignore && setUserStats([]);
        res.data.map(item => 
          !ignore && setUserStats(prev => [
            ...prev,
            {name:`${MONTHS[item._id.month-1]}-${item._id.year}`, "Active User": item.total},
          ])
        );
      } catch(err) {
        console.log(err)
      }
    })());

    return () => {
      ignore = true;
    };
  }, [MONTHS, user]);

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart 
        data={userStats} 
        title={t("userRegistrationAnalytics")} 
        grid dataKey="Active User"
      />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
};

export default Home;
