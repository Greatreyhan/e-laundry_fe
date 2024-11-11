import { useContext, useEffect, useState } from "react";
import AppContext from "../../../Context";
import { MiniAlertEntity } from "../../layout/alert/AlertEntity";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import css from "./Dashboard.module.css";
import type { ChartOptions } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DashboardLinenEntity } from "../../../data/entity/DashboardsEntity";
ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
  ArcElement
);

const Dashboard = () => {
  //-----------------------STATE VIEWS-----------------------//

  const context = useContext(AppContext);
  const contextUserEntity = context.contextUserEntity;
  const setContextLoading = context.setContextLoading;
  const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;

  const [linensData, setLinensData] = useState<DashboardLinenEntity | null>(
    null
  );
  const [listLabelsGraph, setListLabelsGraph] = useState<string[]>([]);
  const [listValueQTYGraph, setListValueQTYGraph] = useState<number[]>([]);
  const [listColorGraph, setListColorGraph] = useState<string[]>([]);

  const optionsBarChart: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: "black",
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        display: true,
        ticks: {
          color: "black",
          font: {
            weight: "bold",
          },
          callback: function (value) {
            return value.toLocaleString("id-ID");
          },
        },
        max: Math.max(...listValueQTYGraph) * 1.2,
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "top",
        display: true,
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
          value: {
            color: "black",
          },
        },
      },
    },
  };

  //-----------------------STATE VIEWS-----------------------//

  //------------------------FUNCTIONS------------------------//

  const generateData = async () => {
    setContextLoading(true);
    try {
      let array_value: number[] = [34, 12, 23, 12, 67, 105];
      let array_label: string[] = [
        "OUT FROM ROOM",
        "CHECK IN",
        "WASHING",
        "READY TO PACK",
        "CHECKOUT",
        "ON ROOM",
      ];
      let array_color: string[] = [
        "#0EA5E9",
        "#0EA5E9",
        "#0EA5E9",
        "#0EA5E9",
        "#0EA5E9",
        "#0EA5E9",
      ];
      setListValueQTYGraph(array_value);
      setListColorGraph(array_color);
      setListLabelsGraph(array_label);
      setLinensData({ bersih: 105, kotor: 148, kadaluarsa: 5 });
      setContextLoading(false);
    } catch (error: any) {
      setContextLoading(false);
      contextShowMiniAlertFunc(
        new MiniAlertEntity({ messages: error.toString() })
      );
    }
  };

  useEffect(() => {
    generateData();
    // eslint-disable-next-line
  }, []);

  //------------------------FUNCTIONS------------------------//
  return (
    <div>
      <div className={css.welcome}>
        {/* <div className='text-white font-semibold text-lg'>
                    Dashboard For &nbsp;
                    <input
                        type='date'
                        style={{ backgroundColor: "white", color: "var(--skyblue-600)", padding: "0px 5px", borderRadius: "5px" }}
                        value={format(filterInboundOutbound.start_date, "yyyy-MM-dd")}
                        onChange={(event) => {
                            setFilterInboundOutbound((prevState) => ({
                                ...prevState,
                                start_date: new Date(event.target.value)
                            }));
                        }}
                    /> Until  &nbsp;
                    <input
                        type='date'
                        style={{ backgroundColor: "white", color: "var(--skyblue-600)", padding: "0px 5px", borderRadius: "5px" }}
                        value={format(filterInboundOutbound.end_date, "yyyy-MM-dd")}
                        onChange={(event) => {
                            setFilterInboundOutbound((prevState) => ({
                                ...prevState,
                                end_date: new Date(event.target.value)
                            }));
                        }}
                    />
                </div> */}
        <span>
          Welcome, {contextUserEntity?.username ?? ""}{" "}
          {`(${contextUserEntity?.role ?? ""})`}
        </span>
      </div>
      <div className={css.card}>
        <div className={css.cardShadow}>
          <div className={css.title}>LINENS RECAP</div>
          <div className={css.body}>
            <div className={css.bodyTitle}>
              <span>Linen Bersih</span>
              <span>Linen Kotor</span>
              <span>Linen Kadaluarsa</span>
            </div>
            <div className={css.bodyContent}>
              <span>{linensData?.bersih ?? "N/A"}</span>
              <span>{linensData?.kotor ?? "N/A"}</span>
              <span>{linensData?.kadaluarsa ?? "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={css.chartCard}>
        <span>PROGRESS RECAP</span>
        {/* <button style={{ position: "absolute", right: "5px", top: "5px", padding: "2px 5px" }} className='skyblue-button' onClick={() => setShowPopup(true)}>
                    Details
                </button> */}
        <div className={css.chart}>
          <Bar
            options={optionsBarChart}
            data={{
              labels: listLabelsGraph,
              datasets: [
                {
                  label: "Total QTY",
                  data: listValueQTYGraph,
                  backgroundColor: listColorGraph,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
