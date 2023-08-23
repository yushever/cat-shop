import CatLoader from "@/components/CatLoader";
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const [products, setProducts] = useState([]);
  const [featuredProductId, setFeaturedProductId] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  useEffect(() => {
    setProductsLoading(true);
    setFeaturedLoading(true);
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setProductsLoading(false);
    });
    axios.get("/api/settings?name=featuredProductId").then((res) => {
      setFeaturedProductId(res.data.value);
      setFeaturedLoading(false);
    });
  }, []);

  async function saveSettings() {
    await axios
      .put("/api/settings", {
        name: "featuredProductId",
        value: featuredProductId,
      })
      .then(() => {
        Swal.fire({
          title: "Settings saved",
          icon: "success",
        });
      });
  }

  return (
    <Layout>
      <h1>Settings</h1>
      {(productsLoading || featuredLoading) && (
        <div className="flex p-10 justify-center items-center">
          <CatLoader />
        </div>
      )}
      {!productsLoading && !featuredLoading && (
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
