import axios from "axios";
import { useEffect, useState } from "react";
import CatLoader from "./CatLoader";
import { subHours } from "date-fns";

export default function HomeStats() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex p-10 justify-center items-center">
        <CatLoader />
      </div>
    );
  }

  const ordersToday = orders.filter((o) => {
    return new Date(o.createdAt) > subHours(new Date(), 24);
  });
  const ordersWeek = orders.filter((o) => {
    return new Date(o.createdAt) > subHours(new Date(), 24 * 7);
  });
  const ordersMonth = orders.filter((o) => {
    return new Date(o.createdAt) > subHours(new Date(), 24 * 30);
  });

  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach((order) => {
      const { line_items } = order;
      line_items.forEach((item) => {
        const lineSum = item.quantity * (item.price_data.unit_amount / 100);
        sum += lineSum;
      });
    });
    return new Intl.NumberFormat("ru-RU").format(sum);
  }

  return (
    <div>
      <h2>Orders</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Today</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-des">{ordersToday.length} orders today</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This week</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-des">{ordersWeek.length} orders this week</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This month</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-des">{ordersMonth.length} orders this month</div>
        </div>
      </div>
      <h2>Revenue</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Today</h3>
          <div className="tile-number">$ {ordersTotal(ordersToday)}</div>
          <div className="tile-des">{ordersToday.length} orders today</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This week</h3>
          <div className="tile-number">$ {ordersTotal(ordersWeek)}</div>
          <div className="tile-des">{ordersWeek.length} orders this week</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This month</h3>
          <div className="tile-number">$ {ordersTotal(ordersMonth)}</div>
          <div className="tile-des">{ordersMonth.length} orders this month</div>
        </div>
      </div>
    </div>
  );
}
