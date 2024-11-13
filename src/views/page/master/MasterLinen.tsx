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
    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------//


    const handlePopupAddNew = async () => {
        setShowPopupAddNewLinen(true)
        setSelectedAddNewLinen(null)
    }

    const handleSaveAddNew = async () => {
        if (!selectedAddNewLinen?.jenis || !selectedAddNewLinen?.id_rfid || !selectedAddNewLinen?.ruangan) {
            return;
        }

        setContextLoading(true);

        try {
            const maxId = tableListLinen?.reduce((max, item) => item.id_linen > max ? item.id_linen : max, 0) ?? 0;
            const newLinen: LinensEntity = {
                id_linen: maxId + 1,
                id_rfid: selectedAddNewLinen.id_rfid,
                jenis: selectedAddNewLinen.jenis,
                ruangan: selectedAddNewLinen.ruangan,
                status: "AKTIF",
                date_last_wash: null,
                total_wash: 0
            };
            setTableListLinen(prevList => prevList ? [...prevList, newLinen] : [newLinen]);
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: "Success Add New" }));
            setShowPopupAddNewLinen(false);
        } catch (error: any) {
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString(), level: 3 }));
        } finally {
            setContextLoading(false);
            console.log(tableListLinen)
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
                { id_linen: 15, id_rfid: "AD82A3345", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 1 },
                { id_linen: 16, id_rfid: "AD82A223C", ruangan: "ANGGREK 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 23 },
                { id_linen: 17, id_rfid: "AD82A356F", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 12 },
                { id_linen: 18, id_rfid: "AD82A3457", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 45 },
                { id_linen: 19, id_rfid: "AD82A246D", ruangan: "MELATI 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 17 },
                { id_linen: 20, id_rfid: "AD8223EDD", ruangan: "MAWAR 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 2 },
                { id_linen: 21, id_rfid: "AD8223EAD", ruangan: "MAWAR 1", jenis: "Surgical Gown", status: "AKTIF", date_last_wash: new Date(), total_wash: 47 }
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
            val.status?.toLowerCase().includes(searchTerm)
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
            <div style={{ height: "10dvh", backgroundColor: "var(--skyblue-600)", padding: "1vh 4vw 1vh 4vw", position: "relative", zIndex: "1" }}>
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
                    Add New +
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
                                <div>{paginationTableListLinen.start + 1}-{paginationTableListLinen.end > tableListLinen.length ? tableListLinen.length ?? 0 : paginationTableListLinen.end ?? 0}</div>
                            }
                            <div>of</div>
                            <div>{tableListLinen?.length ?? 0}</div>
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
                            <div className={css['popup-input-container']}>
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
                            </div>
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
                            <button
                                className={selectedAddNewLinen?.id_rfid && selectedAddNewLinen?.ruangan && selectedAddNewLinen?.jenis ? css['button-enabled'] : css['button-disabled']}
                                onClick={() => handleSaveAddNew()}
                            >
                                Save
                            </button>
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