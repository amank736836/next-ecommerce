import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartData,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    data: number[];
    label: string;
    backgroundColor: string;
    borderColor: string;
    labels?: string[];
}

export const LineChart = ({
    data = [],
    label,
    backgroundColor,
    borderColor,
    labels = [],
}: LineChartProps) => {
    const LineChartOptions: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const LineChartData: ChartData<"line", number[], string> = {
        labels,
        datasets: [
            {
                fill: true,
                label,
                data,
                backgroundColor,
                borderColor,
            },
        ],
    };

    return <Line data={LineChartData} options={LineChartOptions} />;
};
