// app/api/employees/route.ts

import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// const employees = [
//   { name: "kajal", position: "manager" },
//   { name: "nemish", position: "developer" },
// ];

export async function GET() {
  await client.connect();

  const db = client.db("employeeDB");

  const collection = db.collection("employees");

  const employees = await collection.find().toArray();
  return Response.json(employees);
}

export async function POST(request: Request) {
  const newEmployee = await request.json();

  await client.connect();
  const db = client.db("employeeDB");
  const collection = db.collection("employees");
  await collection.insertOne(newEmployee);
  const employees = await collection.find().toArray();

  return Response.json(employees);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  await client.connect();

  const db = client.db("employeeDB");

  const collection = db.collection("employees");

  await collection.deleteOne({ _id: new ObjectId(id) });

  const employees = await collection.find().toArray();

  return Response.json(employees);
}

export async function PUT(request: Request) {
  const { id, name, position } = await request.json();

  await client.connect();

  const db = client.db("employeeDB");

  const collection = db.collection("employees");

  await collection.updateOne(
    { _id: new ObjectId(id) },

    { $set: { name, position } },
  );

  const employees = await collection.find().toArray();

  return Response.json(employees);
}
