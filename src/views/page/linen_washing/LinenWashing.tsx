import { useContext, useEffect, useState } from "react";
import css from './LinenWashing.module.css'
import Popup from "../../component/popup/Popup";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import AppContext from "../../../Context";
import { MiniAlertEntity } from "../../layout/alert/AlertEntity";
import TablePaginationUtils from "../../../utility/TablePagination";
import { format } from "date-fns";
import { RiRfidFill } from "react-icons/ri";
import { AddLinenWashingEntity, LinenWashingEntity } from "../../../data/entity/LinenWashingEntity";

const LinenWashing = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    // const contextUserEntity = context.contextUserEntity;
    const setContextLoading = context.setContextLoading;
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const [tableListLinenWashing, setTableListLinenWashing] = useState<LinenWashingEntity[] | null>(null)
    const [paginationTableListLinenWashing, setPaginationTableListLinenWashing] = useState({
        start: 0,
        end: 15
    })
    const [showPopupScanNewWashedLinens, setShowPopupScanNewWashedLinens] = useState<boolean>(false);
    const [scannedNewLinenWashing, setScannedNewLinenWashing] = useState<AddLinenWashingEntity[] | null>(null)
    const [filterSearch, setFilterSearch] = useState<string>()
    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------//


    const handlePopupAddNew = async () => {
        setShowPopupScanNewWashedLinens(true);
        setScannedNewLinenWashing(null);
    
        const sample_add_new_linen: AddLinenWashingEntity[] = [
            { id_linen: 7, id_rfid: "AD82232DD", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            { id_linen: 8, id_rfid: "AD82A3234", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            { id_linen: 9, id_rfid: "AD82A335D", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            { id_linen: 10, id_rfid: "AD82A3345", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            { id_linen: 11, id_rfid: "AD82A223C", ruangan: "ANGGREK 1", jenis: "Surgical Gown" }
        ];
        setScannedNewLinenWashing(null)
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (i === 0) {
                setScannedNewLinenWashing([sample_add_new_linen[0]])
            } else {
                setScannedNewLinenWashing((prev) => (prev ? [...prev, sample_add_new_linen[i]] : [sample_add_new_linen[i]]));
            }
        }
    };
    

    const handleSaveAddNew = async () => {
        if (scannedNewLinenWashing == null) return;
        setContextLoading(true);
    
        try {
            const selected_scan_new_batch_linens: LinenWashingEntity[] = scannedNewLinenWashing.map(item => ({
                ...item,
                date_time_washed: new Date()
            }));
            setTableListLinenWashing(prev => [...(prev || []), ...selected_scan_new_batch_linens]);
            setScannedNewLinenWashing(null);
            setShowPopupScanNewWashedLinens(false);
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString(), level: 3 }));
        } finally {
            setContextLoading(false);
        }
    };
    

    const generateData = async () => {
        //todo get
        setContextLoading(true)
        try {
            const sample_data: LinenWashingEntity[] = [
                { id_linen: 1, id_rfid: "AD82A356F", ruangan: "MELATI 1", jenis: "Surgical Gown", date_time_washed: new Date() },
                { id_linen: 2, id_rfid: "AD82A3457", ruangan: "MELATI 1", jenis: "Surgical Gown", date_time_washed: new Date() },
                { id_linen: 3, id_rfid: "AD82A246D", ruangan: "MELATI 1", jenis: "Surgical Gown", date_time_washed: new Date() }
            ]
            setTableListLinenWashing(sample_data)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const filtering = (val: LinenWashingEntity) => {
        if (!filterSearch || filterSearch.trim() === "") {
            return true;
        }
        const searchTerm = filterSearch.toLowerCase();
        return (
            val.id_linen?.toString().includes(searchTerm) || val.id_rfid?.toLowerCase().includes(searchTerm) ||
            val.jenis?.toString().includes(searchTerm) || val.ruangan?.toLowerCase().includes(searchTerm)
        );

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
                <div style={{ position: "absolute", fontWeight: "500", color: "var(--skyblue-50)" }}>Linen Washing</div>
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
                    <RiRfidFill /> Scan Linen Done Washed
                </button>

            </div>

            {/* Table Area */}
            <div style={{ height: "70dvh", padding: "2vh 4vw 1vh 4vw" }}>
                <div style={{ backgroundColor: "white", boxShadow: "0 0 6px rgba(0.2, 0.2, 0.2, 0.2)", borderRadius: "5px", height: "70vh" }}>
                    <div style={{ height: "100%", maxWidth: "92dvw", position: "relative", }}>
                        <div>&nbsp;</div>
                        <div style={{position: "relative", overflow: "auto", height: "90%"}}>
                        <table className="normalTable">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>ID LINEN</th>
                                    <th>ID RFID</th>
                                    <th>JENIS</th>
                                    <th>RUANGAN</th>
                                    <th>DATE TIME WASHED</th>
                                </tr>
                            </thead>
                            {tableListLinenWashing != null &&
                                <tbody>
                                    {tableListLinenWashing?.filter((val) => filtering(val)).slice(paginationTableListLinenWashing.start, paginationTableListLinenWashing.end).map((row, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1 + paginationTableListLinenWashing.start}</td>
                                                <td>{row.id_linen}</td>
                                                <td>{row.id_rfid}</td>
                                                <td>{row.jenis}</td>
                                                <td>{row.ruangan}</td>
                                                <td>{format(row.date_time_washed, 'yyyy-MM-dd hh:mm:ss')}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            }
                        </table>
                        </div>
                        <div className={css[`pagination-container`]}>
                            {tableListLinenWashing != null &&
                                <div>{paginationTableListLinenWashing.start + 1}-{paginationTableListLinenWashing.end > tableListLinenWashing.length ? tableListLinenWashing.length ?? 0 : paginationTableListLinenWashing.end ?? 0}</div>
                            }
                            <div>of</div>
                            <div>{tableListLinenWashing?.length ?? 0}</div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("left", tableListLinenWashing, paginationTableListLinenWashing, setPaginationTableListLinenWashing) }}><FaArrowLeft /></div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("right", tableListLinenWashing, paginationTableListLinenWashing, setPaginationTableListLinenWashing) }}><FaArrowRight /></div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Popup Scan Batch*/}
            <Popup
                setShowPopup={setShowPopupScanNewWashedLinens}
                showPopup={showPopupScanNewWashedLinens}
                popupTitle={`Scan Linen Done Washed`}
                popupContent={
                    <>
                        <div style={{ height: "100%", padding: "1vh 1vw", width: "100%", overflow: "auto", position: "relative", }}>
                            <table className="normalTable" style={{ textAlign: "center", marginTop: "2px" }}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID LINEN</th>
                                        <th>ID RFID</th>
                                        <th>JENIS</th>
                                        <th>RUANGAN</th>
                                    </tr>
                                </thead>
                                {scannedNewLinenWashing != null && scannedNewLinenWashing.length > 0 &&
                                    <tbody>
                                        {scannedNewLinenWashing?.map((row, idx) => {
                                            return (
                                                <tr key={idx} >
                                                    <td>{idx+1}</td>
                                                    <td>{row.id_linen ?? ""}</td>
                                                    <td>{row.id_rfid ?? ""}</td>
                                                    <td>{row.jenis ?? ""}</td>
                                                    <td>{row.ruangan ?? ""}</td>
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
                                Mark As Done Washed & Ready To Pack
                            </button>
                        </div>
                    </>
                }
            />

        </div>
    )
}

export default LinenWashing