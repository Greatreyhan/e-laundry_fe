import { useContext, useEffect, useState } from "react";
import css from './LinenPacking.module.css'
import Popup from "../../component/popup/Popup";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import AppContext from "../../../Context";
import { MiniAlertEntity } from "../../layout/alert/AlertEntity";
import TablePaginationUtils from "../../../utility/TablePagination";
import { format } from "date-fns";
import { RiRfidFill } from "react-icons/ri";
import { AddLinenPackingEntity, LinenPackingEntity } from "../../../data/entity/LinenPackingEntity";
import axios from 'axios';

const LinenPacking = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    // const contextUserEntity = context.contextUserEntity;
    const setContextLoading = context.setContextLoading;
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const [tableListLinenPacking, setTableListLinenPacking] = useState<LinenPackingEntity[] | null>(null)
    const [paginationTableListLinenPacking, setPaginationTableListLinenPacking] = useState({
        start: 0,
        end: 15
    })
    const [showPopupScanNewPackedLinens, setShowPopupScanNewPackedLinens] = useState<boolean>(false);
    const [scannedNewLinenPacking, setScannedNewLinenPacking] = useState<AddLinenPackingEntity[] | null>(null)
    const [filterSearch, setFilterSearch] = useState<string>()
    const [inputFilterSearch, setInputFilterSearch] = useState<string>()

    const [dataRFID, setDataRFID] = useState<any>([])

    //-----------------------STATE VIEWS-----------------------//

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

    //------------------------FUNCTIONS------------------------//


    const handlePopupAddNew = async () => {
        const sample_add_new_linen = await handleScanBatch()

        setShowPopupScanNewPackedLinens(true);
        setScannedNewLinenPacking(null);
        if(sample_add_new_linen){
    
            // const sample_add_new_linen: AddLinenPackingEntity[] = [
            //     { id_linen: 7, id_rfid: "AD82232DD", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            //     { id_linen: 8, id_rfid: "AD82A3234", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            //     { id_linen: 9, id_rfid: "AD82A335D", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            //     { id_linen: 10, id_rfid: "AD82A3345", ruangan: "ANGGREK 1", jenis: "Surgical Gown" },
            //     { id_linen: 11, id_rfid: "AD82A223C", ruangan: "ANGGREK 1", jenis: "Surgical Gown" }
            // ];
            setScannedNewLinenPacking(null)
            for (let i = 0; i < sample_add_new_linen.length; i++) {
                if (i == 0) {
                    setScannedNewLinenPacking([sample_add_new_linen[0]])
                } else {
                    setScannedNewLinenPacking((prev) => (prev ? [...prev, sample_add_new_linen[i]] : [sample_add_new_linen[i]]));
                }
            }
        }
    };
    

    const handleSaveAddNew = async () => {
        if (scannedNewLinenPacking == null) return;
        setContextLoading(true);
    
        try {
            const selected_scan_new_batch_linens: LinenPackingEntity[] = scannedNewLinenPacking.map(item => ({
                ...item,
                date_time_packed: new Date()
            }));
            setTableListLinenPacking(prev => [...(prev || []), ...selected_scan_new_batch_linens]);
            setScannedNewLinenPacking(null);
            setShowPopupScanNewPackedLinens(false);
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
            const sample_data: LinenPackingEntity[] = [
                { id_linen: 1, id_rfid: "AD82A356F", ruangan: "MELATI 1", jenis: "Surgical Gown", date_time_packed: new Date() },
                { id_linen: 2, id_rfid: "AD82A3457", ruangan: "MELATI 1", jenis: "Surgical Gown", date_time_packed: new Date() },
                { id_linen: 3, id_rfid: "AD82A246D", ruangan: "MELATI 1", jenis: "Surgical Gown", date_time_packed: new Date() }
            ]
            setTableListLinenPacking(sample_data)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const filtering = (val: LinenPackingEntity) => {
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
                        <RiRfidFill /> Scan Linen Done Packed
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
                                    <th>DATE TIME PACKED</th>
                                </tr>
                            </thead>
                            {tableListLinenPacking != null &&
                                <tbody>
                                    {tableListLinenPacking?.filter((val) => filtering(val)).slice(paginationTableListLinenPacking.start, paginationTableListLinenPacking.end).map((row, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1 + paginationTableListLinenPacking.start}</td>
                                                <td>{row.id_linen}</td>
                                                <td>{row.id_rfid}</td>
                                                <td>{row.jenis}</td>
                                                <td>{row.ruangan}</td>
                                                <td>{format(row.date_time_packed, 'yyyy-MM-dd hh:mm:ss')}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            }
                        </table>
                        </div>
                        <div className={css[`pagination-container`]}>
                            {tableListLinenPacking != null &&
                                <div>{paginationTableListLinenPacking.start + 1}-{paginationTableListLinenPacking.end > tableListLinenPacking.filter((val) => filtering(val)).length ? tableListLinenPacking.filter((val) => filtering(val)).length ?? 0 : paginationTableListLinenPacking.end ?? 0}</div>
                            }
                            <div>of</div>
                            <div>{tableListLinenPacking?.filter((val) => filtering(val)).length ?? 0}</div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("left", tableListLinenPacking, paginationTableListLinenPacking, setPaginationTableListLinenPacking) }}><FaArrowLeft /></div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("right", tableListLinenPacking, paginationTableListLinenPacking, setPaginationTableListLinenPacking) }}><FaArrowRight /></div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Popup Scan Batch*/}
            <Popup
                setShowPopup={setShowPopupScanNewPackedLinens}
                showPopup={showPopupScanNewPackedLinens}
                popupTitle={`Scan Linen Done Packed`}
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
                                {scannedNewLinenPacking != null && scannedNewLinenPacking.length > 0 &&
                                    <tbody>
                                        {scannedNewLinenPacking?.map((row, idx) => {
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
                        <div className={'flex justify-end mt-8'}>
                            <button
                                className={css['button-enabled']}
                                onClick={() => handleSaveAddNew()}
                            >
                                Mark As Done Packed & Ready To Check Out
                            </button>
                        </div>
                    </>
                }
            />

        </div>
    )
}

export default LinenPacking