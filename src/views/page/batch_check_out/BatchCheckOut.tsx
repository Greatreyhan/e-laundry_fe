import { useContext, useEffect, useState } from "react";
import css from './BatchCheckOut.module.css'
import { HiDotsVertical } from "react-icons/hi";
import Popup from "../../component/popup/Popup";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import AppContext from "../../../Context";
import { ConfirmationAlertEntity, MiniAlertEntity } from "../../layout/alert/AlertEntity";
import TablePaginationUtils from "../../../utility/TablePagination";
import { BatchCheckOutEntity, LinenCheckOutEntity } from "../../../data/entity/LinenCheckOutEntity";
import { format } from "date-fns";
import { RiRfidFill } from "react-icons/ri";

const BatchCheckOut = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    // const contextUserEntity = context.contextUserEntity;
    const setContextLoading = context.setContextLoading;
    const contextShowConfirmationAlertFunc = context.contextShowConfirmationAlertFunc
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const [tableListBatchCheckOut, setTableListBatchCheckOut] = useState<BatchCheckOutEntity[] | null>(null)
    const [paginationTableListBatchCheckOut, setPaginationTableListBatchCheckOut] = useState({
        start: 0,
        end: 15
    })
    const [showTooltip, setShowTooltip] = useState<{ [key: number]: boolean }>({});
    const [showPopupScanNewBatchLinens, setShowPopupScanNewBatchLinens] = useState<boolean>(false);
    const [showPopupViewBatchLinens, setShowPopupViewBatchLinens] = useState<boolean>(false);
    const [selectedScanNewBatchLinens, setSelectedScanNewBatchLinens] = useState<BatchCheckOutEntity | null>(null)
    const [selectedViewBatchLinen, setSelectedViewBatchLinen] = useState<BatchCheckOutEntity | null>(null)
    const [filterSearch, setFilterSearch] = useState<string>()
    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------//


    const handlePopupAddNew = async () => {
        setShowPopupScanNewBatchLinens(true);
        const sample_add_new_linen: LinenCheckOutEntity[] = [
            { id_linen: 1, id_rfid: "AD82232DD", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 12 },
            { id_linen: 2, id_rfid: "AD82A3234", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 45 },
            { id_linen: 3, id_rfid: "AD82A335D", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 32 },
            { id_linen: 4, id_rfid: "AD82A3345", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 1 },
            { id_linen: 5, id_rfid: "AD82A223C", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 23 }
        ]
        setSelectedScanNewBatchLinens(null)
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (i === 0) {
                setSelectedScanNewBatchLinens({
                    id: 3,
                    qty: i+1,
                    batch: 202411030003,
                    linens: [sample_add_new_linen[0]]
                })
            } else {
                setSelectedScanNewBatchLinens((prev) => {
                    if (!prev) return null;
                    const updatedLinens = prev?.linens ? [...prev.linens, sample_add_new_linen[i]] : [sample_add_new_linen[i]];
                    return { ...prev, qty: i+1,  linens: updatedLinens };
                });
            }
        }
    };


    const handleSaveAddNew = async () => {
        if (selectedScanNewBatchLinens == null) return
        setContextLoading(true)
        try {setTableListBatchCheckOut(prev => [...(prev || []), selectedScanNewBatchLinens]);
            setSelectedScanNewBatchLinens(null);
            setShowPopupScanNewBatchLinens(false)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString(), level: 3 }))
        }
    }

    const handlePopupBatch = async (data: BatchCheckOutEntity) => {
        setSelectedViewBatchLinen(data)
        setShowPopupViewBatchLinens(true)
    }

    const handleDelete = async (data: BatchCheckOutEntity) => {
            contextShowConfirmationAlertFunc(new ConfirmationAlertEntity({
                alertQuestion: `Are you sure you want delete ${data.batch}?`,
                onClickYes: async () => {
                    setContextLoading(true)
                    try {
                        setTableListBatchCheckOut((prevList) => {
                            if (!prevList) return null;
                            return prevList.filter((batch) => batch.id !== data.id);
                        });
                        contextShowMiniAlertFunc(new MiniAlertEntity({ messages: "Batch Deleted Successfully", level: 1 }));
                        setContextLoading(false)
                    } catch (error: any) {
                        setContextLoading(false)
                        contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
                    }
                },
            }));
        
    }

    const generateData = async () => {
        //todo get
        setContextLoading(true)
        try {
            // const resp = await LocationService.getLocation(0, Number.MAX_SAFE_INTEGER);
            const sample_data: BatchCheckOutEntity[] = [
                {
                    id: 1, batch: 202411030001, qty: 3, linens: [
                        { id_linen: 1, id_rfid: "AD82A356F", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 12 },
                        { id_linen: 2, id_rfid: "AD82A3457", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 45 },
                        { id_linen: 3, id_rfid: "AD82A246D", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 17 }
                    ]
                },
                {
                    id: 2, batch: 202411030002, qty: 2, linens: [
                        { id_linen: 4, id_rfid: "AD8223EDD", ruangan: "MAWAR 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 2 },
                        { id_linen: 5, id_rfid: "AD8223EAD", ruangan: "MAWAR 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 47 }
                    ]
                }
            ]
            setTableListBatchCheckOut(sample_data)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const filtering = (val: BatchCheckOutEntity) => {
        if (!filterSearch || filterSearch.trim() === "") {
            return true;
        }
        const searchTerm = filterSearch.toLowerCase();
        return (
            val.batch?.toString().includes(searchTerm)
        );
        
    };

    const toggleTooltip = (index: number) => {
        setShowTooltip({
            [index]: !showTooltip[index]
        });
    };

    useEffect(() => {
        generateData()
        // eslint-disable-next-line
    }, []);

    //------------------------FUNCTIONS------------------------//

    return (
        <div>
            {/* Button & Filter Area */}
            <div style={{ height: "17dvh", backgroundColor: "var(--skyblue-600)", padding: "1vh 4vw 1vh 4vw", position: "relative", zIndex: "1" }}>
                <div style={{ position: "absolute", fontWeight: "500", color: "var(--skyblue-50)" }}>Batch Check Out</div>
                <div className={css[`search-container`]}>
                    <div className={css["arrow"]}><IoMdSearch /></div>
                    <input
                        className={css['search-input']}
                        id="search"
                        type="text"
                        placeholder="Search..."
                        onChange={(event) => {
                            setFilterSearch(event.target.value)
                        }}
                    />
                    <div>&nbsp;</div>
                </div>
                <button className={css['button-add-new']} onClick={() => { handlePopupAddNew() }}>
                    <RiRfidFill /> Scan Linens
                </button>

            </div>

            {/* Table Area */}
            <div style={{ height: "70dvh", padding: "2vh 4vw 1vh 4vw" }}>
                <div style={{ backgroundColor: "white", boxShadow: "0 0 6px rgba(0.2, 0.2, 0.2, 0.2)", borderRadius: "5px", height: "70vh" }}>
                    <div style={{ height: "100%", width: "100%", position: "relative" }}>
                        <div>&nbsp;</div>
                        <table className="normalTable">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Batch Check Out</th>
                                    <th>QTY</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            {tableListBatchCheckOut != null &&
                                <tbody>
                                    {tableListBatchCheckOut?.filter((val) => filtering(val)).slice(paginationTableListBatchCheckOut.start, paginationTableListBatchCheckOut.end).map((row, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1 + paginationTableListBatchCheckOut.start}</td>
                                                <td>{row.batch}</td>
                                                <td>{row.qty}</td>
                                                <th>
                                                    <div className="can-hover" onClick={() => toggleTooltip(idx)}>
                                                        <HiDotsVertical />
                                                        {showTooltip[idx] &&
                                                            <div className="tooltip" >
                                                                <div className="button-tooltip" onClick={() => { handlePopupBatch(row) }}>Linens</div>
                                                                <div className="button-tooltip-delete" onClick={() => { handleDelete(row) }}>Delete</div>
                                                            </div>
                                                        }
                                                    </div>
                                                </th>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            }
                        </table>
                        <div className={css[`pagination-container`]}>
                            {tableListBatchCheckOut != null &&
                                <div>{paginationTableListBatchCheckOut.start + 1}-{paginationTableListBatchCheckOut.end > tableListBatchCheckOut.length ? tableListBatchCheckOut.length ?? 0 : paginationTableListBatchCheckOut.end ?? 0}</div>
                            }
                            <div>of</div>
                            <div>{tableListBatchCheckOut?.length ?? 0}</div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("left", tableListBatchCheckOut, paginationTableListBatchCheckOut, setPaginationTableListBatchCheckOut) }}><FaArrowLeft /></div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("right", tableListBatchCheckOut, paginationTableListBatchCheckOut, setPaginationTableListBatchCheckOut) }}><FaArrowRight /></div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Popup Scan Batch*/}
            <Popup
                setShowPopup={setShowPopupScanNewBatchLinens}
                showPopup={showPopupScanNewBatchLinens}
                popupTitle={`Add New Batch`}
                popupContent={
                    <>
                        <div style={{ height: "100%", padding: "1vh 1vw", width: "100%", overflow: "auto", position: "relative", }}>
                            <table className="normalTable" style={{ textAlign: "center", marginTop: "2px" }}>
                                <thead>
                                    <tr>
                                        <th>ID Linen</th>
                                        <th>ID RFID</th>
                                        <th>Jenis</th>
                                        <th>Ruangan</th>
                                        <th>Status</th>
                                        <th>Total Wash</th>
                                        <th>Last Wash Date</th>
                                    </tr>
                                </thead>
                                {selectedScanNewBatchLinens?.linens != null && selectedScanNewBatchLinens.linens.length > 0 &&
                                    <tbody>
                                        {selectedScanNewBatchLinens.linens?.map((row, idx) => {
                                            return (
                                                <tr key={idx} >
                                                    <td>{row.id_linen ?? ""}</td>
                                                    <td>{row.id_rfid ?? ""}</td>
                                                    <td>{row.jenis ?? ""}</td>
                                                    <td>{row.ruangan ?? ""}</td>
                                                    <td>{row.status ?? ""}</td>
                                                    <td>{row.total_wash ?? ""}</td>
                                                    <td>{format(row.date_last_wash, 'yyyy-MM-dd') ?? ""}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                }
                            </table>
                        </div>
                        <div className={css['container-button-popup']}>
                            <button
                                className={css['button-enabled']}
                                onClick={() => handleSaveAddNew()}
                            >
                                Mark As Picked and Going To Room
                            </button>
                        </div>
                    </>
                }
            />

            {/* Popup View Batch Linens*/}
            <Popup
                setShowPopup={setShowPopupViewBatchLinens}
                showPopup={showPopupViewBatchLinens}
                popupTitle={`View Linens`}
                popupContent={
                    <>
                        <div style={{ height: "100%", padding: "1vh 1vw", width: "100%", overflow: "auto", position: "relative", }}>
                            <table className="normalTable" style={{ textAlign: "center", marginTop: "2px" }}>
                                <thead>
                                    <tr>
                                        <th>ID Linen</th>
                                        <th>ID RFID</th>
                                        <th>Jenis</th>
                                        <th>Ruangan</th>
                                        <th>Status</th>
                                        <th>Total Wash</th>
                                        <th>Last Wash Date</th>
                                    </tr>
                                </thead>
                                {selectedViewBatchLinen?.linens != null && selectedViewBatchLinen.linens.length > 0 &&
                                    <tbody>
                                        {selectedViewBatchLinen.linens?.map((row, idx) => {
                                            return (
                                                <tr key={idx} >
                                                    <td>{row.id_linen ?? ""}</td>
                                                    <td>{row.id_rfid ?? ""}</td>
                                                    <td>{row.jenis ?? ""}</td>
                                                    <td>{row.ruangan ?? ""}</td>
                                                    <td>{row.status ?? ""}</td>
                                                    <td>{row.total_wash ?? ""}</td>
                                                    <td>{format(row.date_last_wash, 'yyyy-MM-dd') ?? ""}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                }
                            </table>
                        </div>
                    </>
                }
            />

        </div>
    )
}

export default BatchCheckOut