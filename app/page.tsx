"use client";

import { useState, useEffect } from "react";

type Employee = {
  _id: string;
  name: string;
  position: string;
};

export default function Home() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [editId, setEditId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  // ------------useEffect -------------------

  useEffect(() => {
    setLoading(true);

    fetch(`/api/employees?search=${search}`)
      .then((res) => res.json())

      .then((data) => {
        setEmployees(data);

        setLoading(false);
      });
  }, [search]);

  //  --------------- add employee -----------------------

  async function handleAddEmployee(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !position) {
      setError("both field are compulsory");
      return;
    }

    setLoading(true);

    if (editId) {
      // UPDATE employee

      const res = await fetch("/api/employees", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: editId,
          name,
          position,
        }),
      });

      const updatedEmployees = await res.json();

      setEmployees(updatedEmployees);

      setEditId(null);
    } else {
      // ADD employee

      const res = await fetch("/api/employees", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          position,
        }),
      });

      const updatedEmployees = await res.json();

      setEmployees(updatedEmployees);
    }

    setName("");
    setPosition("");
    setError("");
    setLoading(false);
  }

  // ------------ Delete Employee -------------------

  async function handleDeleteEmployee(id: string) {
    const res = await fetch("/api/employees", {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id }),
    });

    const updatedEmployees = await res.json();

    setEmployees(updatedEmployees);
  }

  //  -----------------edit employee -------------------

  function handleEditEmployee(emp: Employee) {
    setName(emp.name);
    setPosition(emp.position);
    setEditId(emp._id);
  }

  return (
    <div className="w-full  bg-zinc-50 font-sans">
      <div className="max-w-7xl mx-auto text-center p-20">
        <h1 className="text-3xl font-semibold text-gray-600">
          Employee Manager
        </h1>
        <button className="bg-green-400 rounded-xl text-white p-4 mt-5 cursor-pointer transition-colors duration-300 hover:bg-green-500">
          Add Employee
        </button>

        {/* form section */}

        <h3 className="mt-6 text-3xl font-semibold text-gray-600">
          {editId ? "Update Employee" : "Add Employee"}
        </h3>

        <form onSubmit={handleAddEmployee} className="mt-5 ">
          <div className="max-w-xl mx-auto mt-5 ">
            {error && (
              <p className="text-red-400 text-2xl text-center">{error}</p>
            )}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Employee Name"
              className="w-full border rounded-xl mb-5 border-blue-300 p-4"
            />
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter Employee Position"
              className="w-full border rounded-xl mb-5 border-blue-300 p-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-400 rounded-xl text-white p-4  cursor-pointer transition-colors duration-300 hover:bg-green-500"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : editId ? (
                "Update Employee"
              ) : (
                "Save Employee"
              )}
            </button>
          </div>
        </form>

        {/* Employee list */}

        <div className="max-w-xl mx-auto mt-5 ">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Employee...."
            className="w-full max-w-xl border border-gray-300 rounded-xl p-3 mb-4"
          />

          <h3 className="mt-6 text-3xl font-semibold text-gray-600">
            Employee List
          </h3>
          <ul className="space-y-4 border border-blue-300 p-10 mt-5 list-disc list-inside">
            {employees
              .filter(
                (emp) =>
                  emp.name.toLowerCase().includes(search.toLowerCase()) ||
                  emp.position.toLowerCase().includes(search.toLowerCase()),
              )
              .map((emp, index) => (
                <li
                  key={index}
                  className="flex justify-between text-center items-center"
                >
                  <span className="text-xl font-semibold text-gray-600">
                    <strong>{emp.name}</strong> - {emp.position}
                  </span>

                  <span>
                    <button
                      type="button"
                      onClick={() => handleEditEmployee(emp)}
                      className="bg-blue-400 text-white rounded-xl ml-4 font-semibold p-2 hover:bg-blue-500 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                  </span>

                  <span>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleDeleteEmployee(emp._id)}
                      className="bg-red-400 text-white rounded-xl ml-4 font-semibold p-2 hover:bg-red-500 transition-colors"
                    >
                      {loading ? "Deleting..." : "🗑 Delete"}
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
