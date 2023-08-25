import CatLoader from "@/components/CatLoader";
import Layout from "@/components/Layout";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminsPage({ swal }) {
  const [email, setEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function addAdmin(e) {
    e.preventDefault();
    axios
      .post("/api/admins", { email })
      .then((res) => {
        Swal.fire({
          title: "Admin created",
          icon: "success",
        });
        setEmail("");
        loadAdmins();
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: err.response.data.message,
          icon: "error",
        });
      });
  }

  function loadAdmins() {
    setIsLoading(true);
    axios.get("/api/admins").then((res) => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }

  function deleteAdmin(_id, email) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete admin ${email}?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios.delete("/api/admins?_id=" + _id).then(() => {
          Swal.fire({
            title: "Admin deleted",
            icon: "success",
          });
          loadAdmins();
        });
      }
    });
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  return (
    <Layout>
      <h1>Admins</h1>
      <h2>Add new admin</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          {" "}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="mb-0"
            placeholder="Email"></input>
          <button type="submit" className="btn-primary py-1 whitespace-nowrap">
            Add admin
          </button>
        </div>
      </form>
      <h2>Existing admins</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Admin email</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4 flex justify-center align-middle">
                  <CatLoader />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 &&
            adminEmails.map((email) => (
              <tr key={email._id}>
                <td>{email.email}</td>
                <td>{email.createdAt && prettyDate(email.createdAt)}</td>
                <td>
                  <button
                    className="btn-red"
                    onClick={() => deleteAdmin(email._id, email.email)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
