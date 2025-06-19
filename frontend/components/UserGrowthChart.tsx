import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function UserGrowthChart() {
  const [growthData, setGrowthData] = useState({
    currentMonthUsers: 0,
    lastMonthUsers: 0,
    twoMonthsAgoUsers: 0,
    threeMonthsAgoUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGrowthData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/dashboard-userGrowth`);
      const data = await response.json();
      setGrowthData({
        currentMonthUsers: data.currentMonthUsers,
        lastMonthUsers: data.lastMonthUsers,
        twoMonthsAgoUsers: data.twoMonthsAgoUsers,
        threeMonthsAgoUsers: data.threeMonthsAgoUsers,
      });
      setIsLoading(false); // Set loading to false after data is fetched
    };

    fetchGrowthData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: ["3 Months Ago", "2 Months Ago", "Last Month", "This Month"],
    datasets: [
      {
        label: "New Users",
        data: [
          growthData.threeMonthsAgoUsers,
          growthData.twoMonthsAgoUsers,
          growthData.lastMonthUsers,
          growthData.currentMonthUsers,
        ],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "User Growth Over Last 3 Months",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-4 mt-4">
      <Line data={data} options={options} />
    </div>
  );
}
