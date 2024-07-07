import prisma from "@/lib/prisma";

export async function GET() {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);

	const stat = await prisma.hit.groupBy({
		by: ["url", "createdAt"],
		where: {
			createdAt: {
				gte: startDate,
				lt: endDate,
			},
		},
		_count: {
			user_id: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	});
	const ip_hit = await prisma.user.findMany({
		take: 10,
		orderBy: {
			hits: {
				_count: "desc",
			},
		},
	});

	const url_hit = await prisma.hit.groupBy({
		by: ["url"],
		_count: {
			url: true,
		},
		orderBy: {
			_count: {
				url: "desc",
			},
		},
		take: 10,
	});
	return Response.json({
		ip_hit,
		url_hit,
		stat,
	});
}
