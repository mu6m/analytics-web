import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const { url }: any = await req.json();
	console.log(req.body);
	const data = await prisma.website.create({
		data: {
			url,
		},
	});
	return Response.json(data);
}
