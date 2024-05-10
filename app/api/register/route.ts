// route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

import { z } from "zod";
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z.string().min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password is required" }),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  console.log(body);
  const validation = formSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ message: "Validation failed" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (user) {
    return NextResponse.json(
      { message: "user exist, please login" },
      { status: 400 }
    );
  }
  const pwhashed = await bcrypt.hash(body.password, 10);

  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: pwhashed,
    },
  });

  return NextResponse.json(
    { message: "Success, user created" },
    { status: 200 }
  );
};
