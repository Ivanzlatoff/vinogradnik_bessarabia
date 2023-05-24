import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { userRequest } from "../../requestMethods";
import { useTranslation } from "react-i18next";


const FeaturedInfo = () => {
  const [income, setIncome] = useState([]);
  const [perc, setPerc] = useState(0);
  const { t } = useTranslation(["featuredInfo"]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try{
        const res = await userRequest.get("orders/income");
        !ignore && setIncome(res.data);
        !ignore && setPerc((res.data[income.length - 1]?.total*100) / res.data[income.length - 2]?.total - 100);
      } catch(err) {
        console.log(err);
      }
    })();

    return () => ignore = true;
  }, [income.length]);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">{t("revenue")}</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{income[income.length - 1]?.total} {t("uah")}</span>
          <span className="featuredMoneyRate">
            %{Math.floor(perc) || ''}{" "} 
            {perc < 0 ? (
              <ArrowDownward  className="featuredIcon negative"/>
            ) : (
              <ArrowUpward className="featuredIcon"/>
            )}
          </span>
        </div>
        <span className="featuredSub">{t("compared_to_last_month")}</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">{t("sales")}</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$4,415</span>
          <span className="featuredMoneyRate">
            -1.4 <ArrowDownward className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">{t("compared_to_last_month")}</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">{t("cost")}</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpward className="featuredIcon"/>
          </span>
        </div>
        <span className="featuredSub">{t("compared_to_last_month")}</span>
      </div>
    </div>
  );
};

export default FeaturedInfo;
