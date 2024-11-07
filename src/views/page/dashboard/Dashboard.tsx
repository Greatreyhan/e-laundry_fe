import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../Context';
import { MiniAlertEntity } from '../../layout/alert/AlertEntity';
import {
    Chart as ChartJS,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { DashboardLinenEntity } from '../../../data/entity/DashboardsEntity';
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

    const [linensData, setLinensData] = useState<DashboardLinenEntity | null>(null)
    const [listLabelsGraph, setListLabelsGraph] = useState<string[]>([])
    const [listValueQTYGraph, setListValueQTYGraph] = useState<number[]>([])
    const [listColorGraph, setListColorGraph] = useState<string[]>([])

    const optionsBarChart: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutBounce',
        },
        scales: {
            x: {
                display: true,
                ticks: {
                    color: "black",
                    font: {
                        weight: "bold"
                    }
                }
            },
            y: {
                display: true,
                ticks: {
                    color: "black",
                    font: {
                        weight: "bold"
                    },
                    callback: function (value) {
                        return (value).toLocaleString('id-ID');
                    }
                },
                max: Math.max(...listValueQTYGraph) * 1.2
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
                anchor: 'end',
                align: 'top',
                display: true,
                labels: {
                    title: {
                        font: {
                            weight: 'bold'
                        }
                    },
                    value: {
                        color: 'black'
                    }
                },
            },
        },
    };

    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------//

    const generateData = async () => {
        setContextLoading(true)
        try {
            let array_value: number[] = [34, 12, 23, 12, 67, 105]
            let array_label: string[] = ['OUT FROM ROOM', 'CHECK IN', 'WASHING', 'READY TO PACK', 'CHECKOUT', 'ON ROOM']
            let array_color: string[] = ['#0EA5E9','#0EA5E9','#0EA5E9','#0EA5E9','#0EA5E9','#0EA5E9']
            setListValueQTYGraph(array_value)
            setListColorGraph(array_color)
            setListLabelsGraph(array_label)
            setLinensData({bersih: 105, kotor: 148, kadaluarsa: 5})
            setContextLoading(false)

        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    useEffect(() => {
        generateData()
        // eslint-disable-next-line
    }, []);

    //------------------------FUNCTIONS------------------------//
    return (
        <div>
            <div style={{ height: "10vh", backgroundColor: "var(--skyblue-600)", padding: "0vh 2vw 0vh 2vw", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
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
                <div></div>
                <div className='text-white font-semibold text-lg'>
                    Welcome, {contextUserEntity?.username ?? ""} {`(${contextUserEntity?.role ?? ""})`}
                </div>
            </div>
            <div style={{ height: "25vh", margin: "0vh 1.5vw 0vh 4vw", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div style={{ flex: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: "50%", margin: "6px 12px 12px 0px", borderRadius: "5px", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)" }}>
                        <div style={{ flex: "20%", backgroundColor: "var(--skyblue-200)", color: "var(--skyblue-950)", fontWeight: "600", margin: "1vh", borderRadius: "5px" }}>
                            LINENS RECAP
                        </div>
                        <div style={{ flex: "80%", display: "flex", flexDirection: "column", width: "100%", justifyContent: "space-around" }}>
                            <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around", color: "var(--skyblue-500)", fontWeight: "500" }}>
                                <div style={{ flex: "33%" }}>Linen Bersih</div>
                                <div style={{ flex: "33%" }}>Linen Kotor</div>
                                <div style={{ flex: "33%" }}>Linen Kadaluarsa</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around", fontSize: "30px", fontWeight: "600", color: "var(--skyblue-800)" }}>
                                <div style={{ flex: "33%" }}>{linensData?.bersih?? "N/A"}</div>
                                <div style={{ flex: "33%" }}>{linensData?.kotor ?? "N/A"}</div>
                                <div style={{ flex: "33%" }}>{linensData?.kadaluarsa ?? "N/A"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ height: "62vh", position: "relative", margin: "1vh 1.5vw 2vh 4vw", borderRadius: "5px", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)" }}>
                <div style={{ height: "10%", fontWeight: "600", color: "var(--skyblue-800)" }}>PROGRESS RECAP</div>
                {/* <button style={{ position: "absolute", right: "5px", top: "5px", padding: "2px 5px" }} className='skyblue-button' onClick={() => setShowPopup(true)}>
                    Details
                </button> */}
                <div style={{ height: "90%", maxWidth: "100%", margin: "0vh 1vw" }}>
                    <Bar
                        options={optionsBarChart}
                        data={{
                            labels: listLabelsGraph,
                            datasets: [
                                {
                                    label: "Total QTY",
                                    data: listValueQTYGraph,
                                    backgroundColor: listColorGraph
                                },
                            ]
                        }}
                    />

                </div>
            </div>
        </div>
    )
}

export default Dashboard