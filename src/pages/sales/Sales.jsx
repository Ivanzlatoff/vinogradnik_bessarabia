import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./sales.css";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useState, useMemo, useEffect } from "react";
import { userRequest } from "../../requestMethods";


const Sales = () => {
  const [orderStats, setOrderStats] = useState([]);

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
    (async () => {
      try {
        const res = await userRequest.get("/orders/income");
        res.data.map(item => 
          setOrderStats(prev => [
            ...prev,
            {name:MONTHS[item._id-1], "Sales": item.total},
          ])
        );
      } catch(err) {
        console.log(err)
      }
    })()
  }, [MONTHS]);

  return (
    <div className="sales">
      <FeaturedInfo />
      <Chart data={orderStats} title="Sales" grid dataKey="Sales"/>
      <div className="salesWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
};

export default Sales;
