"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GREEN = "#4ade80";
const BLUE = "#60a5fa";
const TRACK = "rgba(148, 163, 184, 0.14)";
const INK = "rgba(203, 216, 204, 0.78)";

export function ProgressCharts({
  done,
  remaining,
  labels,
  values,
  title,
  barTitle,
  itemLabel,
}: {
  done: number;
  remaining: number;
  labels: string[];
  values: number[];
  title: string;
  barTitle: string;
  itemLabel: string;
}) {
  const hasData = done + remaining > 0;
  const percent = hasData ? Math.round((done / Math.max(1, done + remaining)) * 100) : 0;

  return (
    <div className="progress-charts">
      <section className="progress-chart-card">
        <div className="progress-chart-head">
          <h2>{title}</h2>
          <span>{done + remaining} tracked items</span>
        </div>
        <div
          className="progress-doughnut"
          role="img"
          aria-label={`${title}: ${percent} percent. ${done} completed, ${remaining} remaining.`}
        >
          <Doughnut
            data={{
              labels: ["Completed", "Remaining"],
              datasets: [
                {
                  data: hasData ? [done, remaining] : [0, 1],
                  backgroundColor: hasData ? [GREEN, TRACK] : [TRACK],
                  borderColor: "transparent",
                  borderWidth: 0,
                  hoverOffset: 3,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "72%",
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      hasData ? `${context.label}: ${context.parsed}` : "Nothing marked yet",
                  },
                },
              },
            }}
          />
          <div className="progress-doughnut-center">
            <strong>{percent}%</strong>
            <span>complete</span>
          </div>
        </div>
        <div className="progress-legend">
          <span>
            <i style={{ background: GREEN }} /> Completed
          </span>
          <span>
            <i style={{ background: TRACK }} /> Remaining
          </span>
        </div>
      </section>

      <section className="progress-chart-card is-wide">
        <div className="progress-chart-head">
          <h2>{barTitle}</h2>
          <span>
            {labels.length} {itemLabel}
          </span>
        </div>
        <div
          className="progress-bar-chart"
          role="img"
          aria-label={`${barTitle}. The same values are listed in the table below.`}
        >
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "% complete",
                  data: values,
                  backgroundColor: values.map((value) =>
                    value === 100 ? GREEN : value > 0 ? BLUE : TRACK,
                  ),
                  borderRadius: 4,
                  barThickness: 9,
                },
              ],
            }}
            options={{
              indexAxis: "y" as const,
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  min: 0,
                  max: 100,
                  grid: { color: "rgba(148, 163, 184, 0.1)" },
                  ticks: { color: INK, font: { size: 9 }, stepSize: 25 },
                  border: { display: false },
                },
                y: {
                  grid: { display: false },
                  ticks: { color: INK, font: { size: 9 } },
                  border: { display: false },
                },
              },
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.parsed.x}% complete`,
                  },
                },
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
