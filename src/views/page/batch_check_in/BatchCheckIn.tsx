import { useContext, useEffect, useState } from "react";
import css from './BatchCheckIn.module.css'
import { HiDotsVertical } from "react-icons/hi";
import Popup from "../../component/popup/Popup";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import AppContext from "../../../Context";
import { ConfirmationAlertEntity, MiniAlertEntity } from "../../layout/alert/AlertEntity";
import TablePaginationUtils from "../../../utility/TablePagination";
import { BatchCheckInEntity, LinenCheckInEntity } from "../../../data/entity/LinenCheckInEntity";
import { format } from "date-fns";
import { RiRfidFill } from "react-icons/ri";
import axios from 'axios';
const BatchCheckIn = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    // const contextUserEntity = context.contextUserEntity;
    const setContextLoading = context.setContextLoading;
    const contextShowConfirmationAlertFunc = context.contextShowConfirmationAlertFunc
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const [tableListBatchCheckIn, setTableListBatchCheckIn] = useState<BatchCheckInEntity[] | null>(null)
    const [paginationTableListBatchCheckIn, setPaginationTableListBatchCheckIn] = useState({
        start: 0,
        end: 15
    })
    const [showTooltip, setShowTooltip] = useState<{ [key: number]: boolean }>({});
    const [showPopupScanNewBatchLinens, setShowPopupScanNewBatchLinens] = useState<boolean>(false);
    const [showPopupViewBatchLinens, setShowPopupViewBatchLinens] = useState<boolean>(false);
    const [selectedScanNewBatchLinens, setSelectedScanNewBatchLinens] = useState<BatchCheckInEntity | null>(null)
    const [selectedViewBatchLinen, setSelectedViewBatchLinen] = useState<BatchCheckInEntity | null>(null)
    const [filterSearch, setFilterSearch] = useState<string>()
    const [inputFilterSearch, setInputFilterSearch] = useState<string>()
    const [dataRFID, setDataRFID] = useState<any>([])

    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------//

    const handleGetData = async () =>{
        try {
            const response = await axios.get('https://elaundry-demo.vercel.app/api/data');
            const data = response.data; // Assuming the response contains the JSON provided
            if (data.length > 0) {
                setDataRFID(data); // Extract the rfid array
            } else {
                console.log('No RFID data found.');
            }
        } catch (err: any) {
            console.log(err.message || 'Something went wrong!');
        }
    }

    const handleScanBatch = async () => {
        // Add data to server
        try {
            const response = await axios.get('https://elaundry-demo.vercel.app/api/scan');
            const data = response.data; 
            if (data.length > 0 && data[0]) {
                console.log(data[0].rfid)
                const result = dataRFID.filter((item:any) => data[0].rfid.includes(item.id_rfid));
                return result
            } else {
                console.log('No RFID data found.');
            }
        } catch (err: any) {
            console.log(err.message || 'Something went wrong!');
        }
    }


    const handlePopupAddNew = async () => {
        const sample_add_new_linen = await handleScanBatch()
        setShowPopupScanNewBatchLinens(true);
        if(sample_add_new_linen){
            // const sample_add_new_linen: LinenCheckInEntity[] = [
            //     { id_linen: 1, id_rfid: "AD82232DD", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 12 },
            //     { id_linen: 2, id_rfid: "AD82A3234", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 45 },
            //     { id_linen: 3, id_rfid: "AD82A335D", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 32 },
            //     { id_linen: 4, id_rfid: "AD82A3345", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 1 },
            //     { id_linen: 5, id_rfid: "AD82A223C", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 23 }
            // ]
            setSelectedScanNewBatchLinens(null)
            for (let i = 0; i < sample_add_new_linen.length; i++) {
                if (i === 0) {
                    setSelectedScanNewBatchLinens({
                        id: 3,
                        qty: i + 1,
                        type: 'INFEKSIUS',
                        batch: 202411030003,
                        linens: [sample_add_new_linen[0]]
                    })
                } else {
                    setSelectedScanNewBatchLinens((prev) => {
                        if (!prev) return null;
                        const updatedLinens = prev?.linens ? [...prev.linens, sample_add_new_linen[i]] : [sample_add_new_linen[i]];
                        console.log({ ...prev, qty: i + 1, linens: updatedLinens })
                        return { ...prev, qty: i + 1, linens: updatedLinens };
                    });
                }
            }
        }
    };


    const handleSaveAddNew = async (type_choosed: 'INFEKSIUS' | 'NON INFEKSIUS') => {
        if (selectedScanNewBatchLinens == null) return
        setContextLoading(true)
        try {
            let new_selected_scan_new_batch_linens: BatchCheckInEntity = { ...selectedScanNewBatchLinens, type: type_choosed }
            setTableListBatchCheckIn(prev => [...(prev || []), new_selected_scan_new_batch_linens]);
            setSelectedScanNewBatchLinens(null);
            setShowPopupScanNewBatchLinens(false)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString(), level: 3 }))
        }
    }

    const handlePopupBatch = async (data: BatchCheckInEntity) => {
        setSelectedViewBatchLinen(data)
        setShowPopupViewBatchLinens(true)
    }

    const handleDelete = async (data: BatchCheckInEntity) => {
        contextShowConfirmationAlertFunc(new ConfirmationAlertEntity({
            alertQuestion: `Are you sure you want delete ${data.batch}?`,
            onClickYes: async () => {
                setContextLoading(true)
                try {
                    setTableListBatchCheckIn((prevList) => {
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
            const sample_data: BatchCheckInEntity[] = [
                {
                    id: 1, batch: 202411030001, type: 'INFEKSIUS', qty: 3, linens: [
                        { id_linen: 1, id_rfid: "AD82A356F", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 12 },
                        { id_linen: 2, id_rfid: "AD82A3457", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 45 },
                        { id_linen: 3, id_rfid: "AD82A246D", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 17 }
                    ]
                },

                {
                    id: 2, batch: 202411030002, type: 'NON INFEKSIUS', qty: 2, linens: [
                        { id_linen: 4, id_rfid: "AD8223EDD", ruangan: "MAWAR 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 2 },
                        { id_linen: 5, id_rfid: "AD8223EAD", ruangan: "MAWAR 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 47 }
                    ]
                }
            ]
            setTableListBatchCheckIn(sample_data)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const filtering = (val: BatchCheckInEntity) => {
        if (!filterSearch || filterSearch.trim() === "") {
            return true;
        }
        const searchTerm = filterSearch.toLowerCase();
        return (
            val.batch?.toString().includes(searchTerm) || val.type?.toLowerCase().includes(searchTerm)
        );

    };

    const toggleTooltip = (index: number) => {
        setShowTooltip({
            [index]: !showTooltip[index]
        });
    };

    useEffect( () => {
        handleGetData()
        generateData()
        // eslint-disable-next-line
    }, []);

    //------------------------FUNCTIONS------------------------//

    return (
        <div>
            {/* Button & Filter Area */}
            {/* Space For Running Text */}
            <div style={{ height: "4dvh" }} >&nbsp;</div>
            {/* Button & Filter Area */}
            <div style={{ height: "15dvh", backgroundColor: "var(--skyblue-600)", padding: "1dvh 4vw 1vh 4vw", position: "relative", zIndex: "1", alignItems: "center" }}>
                <div className={css['container-header']}>
                    <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                        <div style={{ flex: 1 }} className={css[`search-container`]}>
                            <input
                                className={css['search-input']}
                                id="search"
                                type="text"
                                placeholder="Search..."
                                onChange={(event) => {
                                    setInputFilterSearch(event.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        setFilterSearch(inputFilterSearch);
                                    }
                                }}
                            />
                            <div>&nbsp;</div>
                        </div>
                        <button className={css['search-button']} onClick={() => { setFilterSearch(inputFilterSearch) }}>
                            <IoMdSearch />
                        </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                        <button className={css['add-new-button']} onClick={() => { handlePopupAddNew() }}>
                            <RiRfidFill /> Scan Plastik Batch
                        </button>
                        {/* <button className={css['add-new-button']} onClick={() => { handlePopupAddNew() }}>
                            Button Lain 1
                        </button>
                        <button className={css['add-new-button']} onClick={() => { handlePopupAddNew() }}>
                            Button Lain 2
                        </button> */}
                    </div>
                </div>
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
                                    <th>Batch Check In</th>
                                    <th>QTY</th>
                                    <th>TYPE</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            {tableListBatchCheckIn != null &&
                                <tbody>
                                    {tableListBatchCheckIn?.filter((val) => filtering(val)).slice(paginationTableListBatchCheckIn.start, paginationTableListBatchCheckIn.end).map((row, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1 + paginationTableListBatchCheckIn.start}</td>
                                                <td>{row.batch}</td>
                                                <td>{row.qty}</td>
                                                <td>{row.type}</td>
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
                            {tableListBatchCheckIn != null &&
                                <div>{paginationTableListBatchCheckIn.start + 1}-{paginationTableListBatchCheckIn.end > tableListBatchCheckIn.filter((val) => filtering(val)).length ? tableListBatchCheckIn.filter((val) => filtering(val)).length ?? 0 : paginationTableListBatchCheckIn.end ?? 0}</div>
                            }
                            <div>of</div>
                            <div>{tableListBatchCheckIn?.filter((val) => filtering(val)).length ?? 0}</div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("left", tableListBatchCheckIn, paginationTableListBatchCheckIn, setPaginationTableListBatchCheckIn) }}><FaArrowLeft /></div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("right", tableListBatchCheckIn, paginationTableListBatchCheckIn, setPaginationTableListBatchCheckIn) }}><FaArrowRight /></div>
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
                        <div className={'flex gap-x-5 mt-8'}>
                            <button
                                className={css['button-enabled']}
                                onClick={() => handleSaveAddNew('INFEKSIUS')}
                            >
                                Set As Infeksius Batch
                            </button>
                            <button
                                className={css['button-enabled']}
                                onClick={() => handleSaveAddNew('NON INFEKSIUS')}
                            >
                                Set As Non Infeksius Batch
                            </button>
                            {/* <button
                                className={css['button-enabled']}
                                onClick={(e) => handleScanBatch(e)}
                            >
                                Scan Batch
                            </button> */}
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

export default BatchCheckIn