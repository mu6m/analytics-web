"use client";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { list } from "postcss";

Chart.register(CategoryScale);

export default function App() {
	const [lists, setLists]: any = useState({
		ip_hit: [],
		url_hit: [],
		stat: [],
		chartData: {},
	});
	useEffect(() => {
		const fetchData = async () => {
			const db_data = await axios.get("/api/stats");

			let chartData = {};
			if (db_data.data.stat.length > 0) {
				chartData = {
					labels: db_data.data.stat.map((data: any) => data.time),
					datasets: [
						{
							label: "ip hits",
							data: db_data.data.stat.map((data: any) => data.hits),
							backgroundColor: [
								"rgba(75,192,192,1)",
								"#ecf0f1",
								"#50AF95",
								"#f3ba2f",
								"#2a71d0",
							],
							borderColor: "black",
							borderWidth: 2,
						},
					],
				};
			}
			setLists({
				ip_hit: db_data.data.ip_hit,
				url_hit: db_data.data.url_hit,
				stat: db_data.data.stat,
				chartData,
			});
		};

		fetchData();
	}, []);

	const [Tag, setTag] = useState(null);
	const website_input: any = useRef();
	async function createTag() {
		const { data } = await axios.post("/api/", {
			url: website_input.current.value,
		});
		setTag(data.id);
	}

	return (
		<main className="flex min-h-screen flex-col items-center gap-4 p-24 max-w-2xl mx-auto">
			<b>Hits This Month</b>
			{lists.stat.length == 0 ? (
				"not enough hits to display inthe chart"
			) : (
				<Line
					data={lists.chartData}
					options={{
						plugins: {
							legend: {
								display: false,
							},
						},
					}}
				/>
			)}
			<b>ips with most hits</b>

			{lists.ip_hit.length == 0 ? (
				"there are no ip's"
			) : (
				<>
					{lists.ip_hit.map((item: any) => {
						<p>{item.ip}</p>;
					})}
				</>
			)}

			<b>most viewed pages</b>
			{lists.url_hit.length == 0 ? (
				"there are no ip's that viewed your website"
			) : (
				<>
					{lists.url_hit.map((item: any) => {
						<p>{item.url}</p>;
					})}
				</>
			)}
			<b>generate a url tag</b>
			<div className="mb-4">
				<label
					className="block text-gray-700 text-sm font-bold mb-2"
					htmlFor="username"
				>
					Url
				</label>
				<input
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="url"
					type="url"
					placeholder="url"
					ref={website_input}
				/>
			</div>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={createTag}
			>
				Generate
			</button>
			{Tag !== null && <b>you tag is "{Tag}"</b>}
		</main>
	);
}
