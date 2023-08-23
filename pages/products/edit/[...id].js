import CatLoader from "@/components/CatLoader";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const [loading, setIsLoading] = useState(false);

  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
      setIsLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit Product</h1>
      {loading ? (
        <div className="flex p-10 justify-center items-center">
          <CatLoader />
        </div>
      ) : null}
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}
