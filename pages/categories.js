import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CatLoader from "@/components/CatLoader";

export default function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setIsLoading(false);
      setCategories(result.data);
    });
  }
  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete("/api/categories?_id=" + _id);
        fetchCategories();
      }
    });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return indexToRemove !== pIndex;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          {" "}
          <input
            className=""
            type="text"
            placeholder={"Category name"}
            value={name}
            onChange={(e) => setName(e.target.value)}></input>
          <select
            className=""
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}>
            <option value="0">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2">
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  value={property.name}
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                  type="text"
                  placeholder="Property name (example: color)"></input>
                <input
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                  value={property.values}
                  type="text"
                  placeholder="Values"></input>
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="btn-red">
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {" "}
          {editCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>{" "}
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2}>
                  <div className="flex p-10 justify-center items-center">
                    <CatLoader />
                  </div>
                </td>
              </tr>
            ) : null}
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1">
                      Edit
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => deleteCategory(category)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
