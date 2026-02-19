// app/api/employees/route.ts

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


// ---------------- GET ----------------

export async function GET() {

  const client = await clientPromise;

  const db = client.db("employeeDB");

  const employees = await db
    .collection("employees")
    .find()
    .toArray();

  return Response.json(employees);

}



// ---------------- POST ----------------

export async function POST(request: Request) {

  const body = await request.json();

  const client = await clientPromise;

  const db = client.db("employeeDB");

  await db.collection("employees").insertOne({

    name: body.name,

    position: body.position,

  });

  const employees = await db
    .collection("employees")
    .find()
    .toArray();

  return Response.json(employees);

}



// ---------------- PUT (UPDATE) ----------------

export async function PUT(request: Request) {

  const body = await request.json();

  const client = await clientPromise;

  const db = client.db("employeeDB");

  await db.collection("employees").updateOne(

    { _id: new ObjectId(body.id) },

    {

      $set: {

        name: body.name,

        position: body.position,

      },

    }

  );

  const employees = await db
    .collection("employees")
    .find()
    .toArray();

  return Response.json(employees);

}



// ---------------- DELETE ----------------

export async function DELETE(request: Request) {

  const body = await request.json();

  const client = await clientPromise;

  const db = client.db("employeeDB");

  await db.collection("employees").deleteOne({

    _id: new ObjectId(body.id),

  });

  const employees = await db
    .collection("employees")
    .find()
    .toArray();

  return Response.json(employees);

}
