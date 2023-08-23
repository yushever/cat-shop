import CatLoader from "@/components/CatLoader";
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, []);

  async function fetchAll() {
    await axios.get("/api/products").then((res) => {
      setProducts(res.data);
    });
    await axios.get("/api/settings?name=featuredProductId").then((res) => {
      setFeaturedProductId(res.data.value);
    });
    await axios.get("/api/settings?name=shippingFee").then((res) => {
      setShippingFee(res.data.value);
    });
  }

  async function saveSettings() {
    setIsLoading(true);
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId,
    });
    await axios.put("/api/settings", {
      name: "shippingFee",
      value: shippingFee,
    });
    setIsLoading(false);
    await Swal.fire({
      title: "Settings saved",
      icon: "success",
    });
  }

  return (
    <Layout>
      <h1>Settings</h1>
      {isLoading && (
        <div className="flex p-10 justify-center items-center">
          <CatLoader />
        </div>
      )}
      {!isLoading && (
        <>
          <label>Featured product</label>
          <select
            onChange={(e) => setFeaturedProductId(e.target.value)}
            value={featuredProductId}>
            {products.length > 0 &&
              products.map((product) => (
                <option value={product._id}>{product.title}</option>
              ))}
          </select>
          <label>Shipping price (in usd)</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}></input>
          <div>
            <button className="btn-primary" onClick={saveSettings}>
              Save settings
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}
