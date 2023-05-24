import "./widgetLg.css";
import { useEffect, useState } from "react";
import { userRequest } from '../../requestMethods';
import {format} from 'timeago.js';
import { useTranslation } from 'react-i18next';
import { useLocale } from "../../constants";


const WidgetLg = () => {
  const [orders, setOrders] = useState([]);
  const { t } = useTranslation(["widgetLg"]);
  const locale = useLocale();

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await userRequest.get("orders");
        !ignore && setOrders(res.data);
      } catch(err) {
        console.log(err);
      }
    })();

    return () => {
      ignore = false
    }
  }, []);
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">{t("latest_transactions")}</h3>
      <table className="widgetLgTable">
        <thead>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">{t("customer")}</th>
            <th className="widgetLgTh">{t("date")}</th>
            <th className="widgetLgTh">{t("amount")}</th>
            <th className="widgetLgTh">{t("status")}</th>
          </tr>
        </thead>
        {orders.map((order) => (
        <tbody key={order._id}>
          <tr className="widgetLgTr" key={order._id}>
            <td className="widgetLgUser">
              <span className="widgetLgName">{order.userId}</span>
            </td>
            <td className="widgetLgDate">{format(order.createdAt, locale)}</td>
            <td className="widgetLgAmount">{order.amount} {t("uah")}</td>
            <td className="widgetLgStatus">
              <Button type={order.status} />
            </td>
          </tr>
        </tbody>
        ))}
      </table>
    </div>
  );
};

export default WidgetLg;
