import { useContext, useEffect, useState } from "react";
import css from './Master.module.css'
import { HiDotsVertical } from "react-icons/hi";
import Popup from "../../component/popup/Popup";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import AppContext from "../../../Context";
import { ConfirmationAlertEntity, MiniAlertEntity } from "../../layout/alert/AlertEntity";
import TablePaginationUtils from "../../../utility/TablePagination";
import { LiaWindowMaximize } from "react-icons/lia";
import { PiBarcodeBold } from "react-icons/pi";
import { AddLinensEntity, LinensEntity } from "../../../data/entity/LinenEntity";
import { format } from "date-fns";
import { FaDoorOpen } from "react-icons/fa";
import axios from 'axios';

const MasterLinen = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    // const contextUserEntity = context.contextUserEntity;
    const setContextLoading = context.setContextLoading;
    const contextShowConfirmationAlertFunc = context.contextShowConfirmationAlertFunc
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const [tableListLinen, setTableListLinen] = useState<LinensEntity[] | null>(null)
    const [paginationTableListLinen, setPaginationTableListLinen] = useState({
        start: 0,
        end: 15
    })
    const [showTooltip, setShowTooltip] = useState<{ [key: number]: boolean }>({});
    const [showPopupAddNewLinen, setShowPopupAddNewLinen] = useState<boolean>(false);
    const [showPopupEditLinen, setShowPopupEditLinen] = useState<boolean>(false);
    const [selectedAddNewLinen, setSelectedAddNewLinen] = useState<AddLinensEntity | null>(null)
    const [selectedEditLinen, setSelectedEditLinen] = useState<LinensEntity | null>(null)
    const [selectedDefaultEditLinen, setSelectedDefaultEditLinen] = useState<LinensEntity | null>(null)
    const [filterSearch, setFilterSearch] = useState<string>()
    const [inputFilterSearch, setInputFilterSearch] = useState<string>()

    const [dataRFID, setDataRFID] = useState<any>([])

    const [showPopupAddNewLinenBatch, setShowPopupAddNewLinenBatch] = useState<boolean>(false);
    const [selectedAddNewLinenBatch, setSelectedAddNewLinenBatch] = useState<AddLinensEntity | null>(null)

    //----------------------- SCAN ID_RFID -----------------------//

    const handleScanRFID = async (e: any) => {
        e.preventDefault()

        try {
            const response = await axios.get('https://elaundry-demo.vercel.app/api/scan');
            const data = response.data; // Assuming the response contains the JSON provided
            if (data.length > 0 && data[0].rfid) {
                setDataRFID(data[0].rfid); // Extract the rfid array
            } else {
                console.log('No RFID data found.');
            }
        } catch (err: any) {
            console.log(err.message || 'Something went wrong!');
        }

    }

    //------------------------FUNCTIONS------------------------//


    const handlePopupAddNew = async () => {
        setShowPopupAddNewLinen(true)
        setSelectedAddNewLinen(null)
    }

    const handlePopupAddNewBatch = async () => {
        setShowPopupAddNewLinen(true)
        setSelectedAddNewLinen(null)
    }
    const handleSaveAddNew = async () => {
        if (!selectedAddNewLinen?.jenis || dataRFID.length === 0 || !selectedAddNewLinen?.ruangan) {
            return;
        }
    
        setContextLoading(true);
    
        try {
            const maxId = tableListLinen?.reduce((max, item) => item.id_linen > max ? item.id_linen : max, 0) ?? 0;
    
            // Process all linens sequentially to ensure error handling
            const newLinens:any = [];
            for (const [i, data] of dataRFID.entries()) {
                const newLinen: LinensEntity = {
                    id_linen: maxId + 1 + i,
                    id_rfid: data,
                    jenis: selectedAddNewLinen.jenis ?? '',
                    ruangan: selectedAddNewLinen.ruangan ?? '',
                    status: "AKTIF",
                    date_last_wash: new Date(),
                    total_wash: 0,
                };
    
                // Add data to server
                await axios.post("https://elaundry-demo.vercel.app/api/data", newLinen, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                // Add data to local list
                newLinens.push(newLinen);
            }
    
            // Update the local state once all linens are added
            setTableListLinen(prevList => prevList ? [...prevList, ...newLinens] : newLinens);
    
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: "Success Add New" }));
            setShowPopupAddNewLinen(false);
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString(), level: 3 }));
        } finally {
            setContextLoading(false);
            console.log(tableListLinen);
        }
    };
    

    const handlePopupUpdate = async (data: LinensEntity) => {
        setSelectedEditLinen(data)
        setSelectedDefaultEditLinen(data)
        setShowPopupEditLinen(true)
    }

    const handleSaveUpdate = async () => {
        if (selectedEditLinen == null) return;
        setContextLoading(true);
        try {
            await generateData();
            setTableListLinen((prevList) =>
                (prevList ?? []).map((linen) =>
                    linen.id_linen === selectedEditLinen.id_linen ? selectedEditLinen : linen
                )
            );

            setShowPopupEditLinen(false);
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: "Success Update" }));
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }));
        } finally {
            setContextLoading(false);
        }
    };

    const handleDelete = async (data: LinensEntity) => {
        if (data == null) return;
        contextShowConfirmationAlertFunc(new ConfirmationAlertEntity({
            alertQuestion: `Are you sure you want delete ${data.id_rfid}?`,
            onClickYes: async () => {
                setContextLoading(true);
                try {
                    setTableListLinen((prevList) =>
                        (prevList ?? []).filter((linen) => linen.id_linen !== data.id_linen)
                    );
                    setShowPopupEditLinen(false);
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: "Success Delete" }));
                } catch (error: any) {
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }));
                } finally {
                    setContextLoading(false);
                }
            },
        }));
    };


    const generateData = async () => {
        //todo get
        setContextLoading(true)
        try {
            const sample_data: LinensEntity[] = [
                { id_linen: 12, id_rfid: "AD82232DD", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 12 },
                { id_linen: 13, id_rfid: "AD82A3234", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 45 },
                { id_linen: 14, id_rfid: "AD82A335D", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 32 },

            ]
            setTableListLinen(sample_data)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const filtering = (val: LinensEntity) => {
        if (!filterSearch || filterSearch.trim() === "") {
            return true;
        }
        const searchTerm = filterSearch.toLowerCase();
        return (
            val.status?.toLowerCase().includes(searchTerm) || val.ruangan?.toLowerCase().includes(searchTerm) ||
            val.id_linen?.toString().includes(searchTerm) || val.id_rfid?.toLowerCase().includes(searchTerm) ||
            val.jenis?.toString().includes(searchTerm) || val.total_wash?.toString().includes(searchTerm) ||
            format(val.date_last_wash ?? 0, "yyyy-MM-dd").toString().includes(searchTerm)
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
                            Add New Single
                        </button>
                        <button className={css['add-new-button']} onClick={() => { handlePopupAddNewBatch() }}>
                            Add New Batch
                        </button>
                        {/* <button className={css['add-new-button']} onClick={() => { handlePopupAddNew() }}>
                            Button Lain 2
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div style={{ height: "75dvh", padding: "2vh 4vw 1vh 4vw" }}>
                <div style={{ backgroundColor: "white", boxShadow: "0 0 6px rgba(0.2, 0.2, 0.2, 0.2)", borderRadius: "5px", height: "75dvh" }}>
                    <div style={{ height: "100%", maxWidth: "92dvw", position: "relative", }}>
                        <div>&nbsp;</div>
                        <div style={{ position: "relative", overflow: "auto", height: "90%" }}>
                            <table className="normalTable">
                                <thead>
                                    <tr>
                                        <th>NO</th>
                                        <th>ID Linen</th>
                                        <th>ID RFID</th>
                                        <th>Jenis</th>
                                        <th>Ruangan</th>
                                        <th>Status</th>
                                        <th>Total Wash</th>
                                        <th>Date Last Wash</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                {tableListLinen != null &&
                                    <tbody>
                                        {tableListLinen?.filter((val) => filtering(val)).slice(paginationTableListLinen.start, paginationTableListLinen.end).map((row, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td>{idx + 1 + paginationTableListLinen.start}</td>
                                                    <td>{row.id_linen}</td>
                                                    <td>{row.id_rfid}</td>
                                                    <td>{row.jenis}</td>
                                                    <td>{row.ruangan}</td>
                                                    <td>{row.status}</td>
                                                    <td>{row.total_wash}</td>
                                                    <td>{row.date_last_wash == null ? "" : format(row.date_last_wash, "yyyy-MM-dd")}</td>
                                                    <th>
                                                        <div className="can-hover" onClick={() => toggleTooltip(idx)}>
                                                            <HiDotsVertical />
                                                            {showTooltip[idx] &&
                                                                <div className="tooltip" >
                                                                    <div className="button-tooltip" onClick={() => { handlePopupUpdate(row) }}>Edit</div>
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
                        </div>
                        <div className={css[`pagination-container`]}>
                            {tableListLinen != null &&
                                <div>{paginationTableListLinen.start + 1}-{paginationTableListLinen.end > tableListLinen.filter((val) => filtering(val)).length ? tableListLinen.filter((val) => filtering(val)).length ?? 0 : paginationTableListLinen.end ?? 0}</div>
                            }
                            <div>of</div>
                            <div>{tableListLinen?.filter((val) => filtering(val)).length ?? 0}</div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("left", tableListLinen, paginationTableListLinen, setPaginationTableListLinen) }}><FaArrowLeft /></div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("right", tableListLinen, paginationTableListLinen, setPaginationTableListLinen) }}><FaArrowRight /></div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Popup Add New*/}
            <Popup
                setShowPopup={setShowPopupAddNewLinen}
                showPopup={showPopupAddNewLinen}
                popupTitle={`Add New Linen`}
                popupContent={
                    <>
                        <div className={css['popup-container']}>
                            <label className={css['popup-label']} htmlFor="inbound_number">ID RFID</label>

                            {/* Data From Scanning */}
                            <ul className="mb-4">
                                {dataRFID.map((rfid:any, index:any) => (
                                    <li className="text-xs" key={index}>{index+1}. {rfid}</li>
                                ))}
                            </ul>

                            {/* <div className={css['popup-input-container']}>
                                <span className={css['popup-icon']}><PiBarcodeBold className={css['popup-icon-color']} /></span>
                                <input
                                    className={css['popup-input']}
                                    id="id_rfid"
                                    type="text"
                                    placeholder="AD8223EDD"
                                    value={selectedAddNewLinen?.id_rfid ?? ""}
                                    onChange={(event) => {
                                        setSelectedAddNewLinen((prevState: (AddLinensEntity | null)) => {
                                            return new AddLinensEntity({
                                                ...prevState,
                                                id_rfid: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div> */}
                            <label className={css['popup-label']} htmlFor="vehicle_number">Jenis</label>
                            <div className={css['popup-input-container']}>
                                <span className={css['popup-icon']}><LiaWindowMaximize className={css['popup-icon-color']} /></span>
                                <input
                                    className={css['popup-input']}
                                    id="jenis"
                                    type="text"
                                    placeholder="Surgical Gown"
                                    value={selectedAddNewLinen?.jenis ?? ""}
                                    onChange={(event) => {
                                        setSelectedAddNewLinen((prevState: (AddLinensEntity | null)) => {
                                            return new AddLinensEntity({
                                                ...prevState,
                                                jenis: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="inbound_number">Ruangan</label>
                            <div className={css['popup-input-container']}>
                                <span className={css['popup-icon']}><FaDoorOpen className={css['popup-icon-color']} /></span>
                                <input
                                    className={css['popup-input']}
                                    id="ruangan"
                                    type="text"
                                    placeholder="MELATI 1"
                                    value={selectedAddNewLinen?.ruangan ?? ""}
                                    onChange={(event) => {
                                        setSelectedAddNewLinen((prevState: (AddLinensEntity | null)) => {
                                            return new AddLinensEntity({
                                                ...prevState,
                                                ruangan: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-end w-full gap-x-5">
                                <button
                                    className='button px-6 py-1.5 text-sky-800 rounded-lg'
                                    onClick={(e) => handleScanRFID(e)}
                                >
                                    Scan
                                </button>
                                <button
                                    className={selectedAddNewLinen?.id_rfid && selectedAddNewLinen?.ruangan && selectedAddNewLinen?.jenis ? 'button px-6 py-1.5 bg-sky-700 text-white rounded-lg' : 'button px-6 py-1.5 bg-slate-700 text-white rounded-lg disabled'}
                                    onClick={() => handleSaveAddNew()}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </>
                }
            />

            {/* Popup Update*/}
            <Popup
                setShowPopup={setShowPopupEditLinen}
                showPopup={showPopupEditLinen}
                popupTitle={`Edit Linen`}
                popupContent={
                    <>
                        <div className={css['popup-container']}>
                            <label className={css['popup-label']} htmlFor="inbound_number">ID Linen</label>
                            <div className={css['popup-input-container']} style={{ backgroundColor: "#ebebeb" }}>
                                <span className={css['popup-icon']}><PiBarcodeBold className={css['popup-icon-color']} /></span>
                                <input
                                    className={css['popup-input']} style={{ backgroundColor: "#ebebeb" }}
                                    id="id_linen"
                                    type="text"
                                    placeholder="10A-3"
                                    value={selectedEditLinen?.id_linen ?? ""} readOnly
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                <div style={{ flex: "1" }}>
                                    <label className={css['popup-label']} htmlFor="vehicle_number">ID RFID</label>
                                    <div className={css['popup-input-container']}>
                                        <span className={css['popup-icon']}><LiaWindowMaximize className={css['popup-icon-color']} /></span>
                                        <input
                                            className={css['popup-input']}
                                            id="id_rfid"
                                            type="text"
                                            value={selectedEditLinen?.id_rfid ?? ""}
                                            onChange={(event) => {
                                                setSelectedEditLinen((prevState: (LinensEntity | null)) => {
                                                    if (prevState != null) {
                                                        return new LinensEntity({
                                                            ...prevState,
                                                            id_rfid: event.target.value
                                                        })
                                                    } else { return null }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: "1" }}>
                                    <label className={css['popup-label']} htmlFor="vehicle_number">Jenis</label>
                                    <div className={css['popup-input-container']}>
                                        <span className={css['popup-icon']}><LiaWindowMaximize className={css['popup-icon-color']} /></span>
                                        <input
                                            className={css['popup-input']}
                                            id="jenis"
                                            type="text"
                                            value={selectedEditLinen?.jenis ?? 0}
                                            onChange={(event) => {
                                                setSelectedEditLinen((prevState: (LinensEntity | null)) => {
                                                    if (prevState != null) {
                                                        return new LinensEntity({
                                                            ...prevState,
                                                            jenis: event.target.value
                                                        })
                                                    } else { return null }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                <div style={{ flex: "1" }}>
                                    <label className={css['popup-label']} htmlFor="vehicle_number">Ruangan</label>
                                    <div className={css['popup-input-container']}>
                                        <span className={css['popup-icon']}><LiaWindowMaximize className={css['popup-icon-color']} /></span>
                                        <input
                                            className={css['popup-input']}
                                            id="ruangan"
                                            type="text"
                                            value={selectedEditLinen?.ruangan ?? 0}
                                            onChange={(event) => {
                                                setSelectedEditLinen((prevState: (LinensEntity | null)) => {
                                                    if (prevState != null) {
                                                        return new LinensEntity({
                                                            ...prevState,
                                                            ruangan: event.target.value
                                                        })
                                                    } else { return null }
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: "1" }}>
                                    <label className={css['popup-label']} htmlFor="vehicle_number">Status</label>
                                    <div className={css['popup-input-container']}>
                                        <span className={css['popup-icon']}><LiaWindowMaximize className={css['popup-icon-color']} /></span>
                                        <select
                                            className={css['popup-input']}
                                            id="status"
                                            value={selectedEditLinen?.status ?? 'AKTIF'}
                                            onChange={(event) => {
                                                setSelectedEditLinen((prevState: (LinensEntity | null)) => {
                                                    if (prevState != null) {
                                                        return new LinensEntity({
                                                            ...prevState,
                                                            status: event.target.value as 'AKTIF' || 'NONAKTIF'
                                                        });
                                                    } else {
                                                        return null;
                                                    }
                                                });
                                            }}
                                        >
                                            <option value="AKTIF">AKTIF</option>
                                            <option value="NONAKTIF">NON AKTIF</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                <div style={{ flex: "1" }}>
                                    <label className={css['popup-label']} htmlFor="inbound_number">Total Wash</label>
                                    <div className={css['popup-input-container']} style={{ backgroundColor: "#ebebeb" }}>
                                        <span className={css['popup-icon']}><PiBarcodeBold className={css['popup-icon-color']} /></span>
                                        <input
                                            className={css['popup-input']} style={{ backgroundColor: "#ebebeb" }}
                                            id="total_wash"
                                            type="text"
                                            value={selectedEditLinen?.total_wash ?? ""} readOnly
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: "1" }}>
                                    <label className={css['popup-label']} htmlFor="inbound_number">Date Last Wash</label>
                                    <div className={css['popup-input-container']} style={{ backgroundColor: "#ebebeb" }}>
                                        <span className={css['popup-icon']}><PiBarcodeBold className={css['popup-icon-color']} /></span>
                                        <input
                                            className={css['popup-input']} style={{ backgroundColor: "#ebebeb" }}
                                            id="date_last_wash"
                                            type="text"
                                            value={selectedEditLinen?.date_last_wash == null ? "" : format(selectedEditLinen?.date_last_wash, 'yyyy-MM-dd')} readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                className={css['button-enabled']}
                                onClick={() => handleSaveUpdate()}
                            >
                                Save
                            </button>
                        </div>
                    </>
                }
            />

        </div>
    )
}

export default MasterLinen