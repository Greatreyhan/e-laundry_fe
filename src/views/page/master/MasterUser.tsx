import { useContext, useEffect, useState } from "react";
import css from './Master.module.css'
import { HiDotsVertical } from "react-icons/hi";
import Popup from "../../component/popup/Popup";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import AppContext from "../../../Context";
import { ConfirmationAlertEntity, MiniAlertEntity } from "../../layout/alert/AlertEntity";
import { UserService } from "../../../data/service/UserService";
import TablePaginationUtils from "../../../utility/TablePagination";
import { LiaWindowMaximize } from "react-icons/lia";
import { PiBarcodeBold } from "react-icons/pi";
import { AddUserEntity, RoleEntity, UserEntity } from "../../../data/entity/UserEntity";


const MasterUser = () => {
    //-----------------------STATE VIEWS-----------------------//
    const context = useContext(AppContext);
    // const contextUserEntity = context.contextUserEntity;
    const setContextLoading = context.setContextLoading;
    const contextShowConfirmationAlertFunc = context.contextShowConfirmationAlertFunc
    const contextShowMiniAlertFunc = context.contextShowMiniAlertFunc;
    const [tableListUser, setTableListUser] = useState<UserEntity[] | null>(null)
    const [ListRoles, setListRoles] = useState<RoleEntity[] | null>(null)
    const [paginationTableListUser, setPaginationTableListUser] = useState({
        start: 0,
        end: 15
    })
    const [showTooltip, setShowTooltip] = useState<{ [key: number]: boolean }>({});
    const [showPopupAddNewUser, setShowPopupAddNewUser] = useState<boolean>(false);
    const [showPopupEditUser, setShowPopupEditUser] = useState<boolean>(false);
    const [selectedAddNewUser, setSelectedAddNewUser] = useState<AddUserEntity | null>(null)
    const [selectedEditUser, setSelectedEditUser] = useState<AddUserEntity | null>(null)
    const [selectedDefaultEditUser, setSelectedDefaultEditUser] = useState<UserEntity | null>(null)
    const [filterSearch, setFilterSearch] = useState<string>()
    const [inputFilterSearch, setInputFilterSearch] = useState<string>()
    //-----------------------STATE VIEWS-----------------------//

    //------------------------FUNCTIONS------------------------//


    const handlePopupAddNew = async () => {
        setShowPopupAddNewUser(true)
        setSelectedAddNewUser(null)
    }

    const handleSaveAddNew = async () => {
        if (selectedAddNewUser == null) return
        setContextLoading(true)
        try {
            const resp = await UserService.createUser(selectedAddNewUser)
            await generateData()
            setShowPopupAddNewUser(false)
            setSelectedAddNewUser(null)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString(), level: 3 }))
        }
    }

    const handlePopupUpdate = async (data: UserEntity) => {
        setSelectedEditUser(data)
        setSelectedDefaultEditUser(data)
        setShowPopupEditUser(true)
    }

    const handleSaveUpdate = async () => {
        if (selectedDefaultEditUser == null || selectedEditUser == null) return
        setContextLoading(true)
        try {
            const resp = await UserService.updateUser(
                selectedDefaultEditUser,
                { id_role: selectedEditUser.id_role, username: selectedEditUser.username })
            await generateData()
            setShowPopupEditUser(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const handleDelete = async (data: UserEntity) => {
        if (data == null) return
        contextShowConfirmationAlertFunc(new ConfirmationAlertEntity({
            alertQuestion: `Are you sure you want delete ${data.username}?`,
            onClickYes: async () => {
                setContextLoading(true)
                try {
                    const resp = await UserService.deleteUser(data);
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: resp.message }))
                    await generateData()
                    setShowPopupEditUser(false)
                    setContextLoading(false)
                } catch (error: any) {
                    setContextLoading(false)
                    contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
                }
            },
        }));

    }

    const generateData = async () => {
        setContextLoading(true)
        try {
            const resp = await UserService.getUser();
            setTableListUser(resp.data)
            const respRoles = await UserService.getRoles();
            setListRoles(respRoles.data)
            setContextLoading(false)
        } catch (error: any) {
            setContextLoading(false)
            contextShowMiniAlertFunc(new MiniAlertEntity({ messages: error.toString() }))
        }
    }

    const filtering = (val: UserEntity) => {
        if (!filterSearch || filterSearch.trim() === "") {
            return true;
        }
        const searchTerm = filterSearch.toLowerCase();
        return (
            val.username?.toLowerCase().includes(searchTerm) ||
            val.role?.toLowerCase().includes(searchTerm)
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
                            Add New + 1
                        </button>
                        <button className={css['add-new-button']} onClick={() => { handlePopupAddNew() }}>
                            Button Lain 1
                        </button>
                        <button className={css['add-new-button']} onClick={() => { handlePopupAddNew() }}>
                            Button Lain 2
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div style={{ height: "75dvh", padding: "2vh 4vw 1vh 4vw" }}>
                <div style={{ backgroundColor: "white", boxShadow: "0 0 6px rgba(0.2, 0.2, 0.2, 0.2)", borderRadius: "5px", height: "75vh" }}>
                    <div style={{ height: "100%", maxWidth: "92dvw", position: "relative", }}>
                        <div>&nbsp;</div>
                        <div style={{position: "relative", overflow: "auto", height: "90%"}}>
                        <table className="normalTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            {tableListUser != null &&
                                <tbody>
                                    {tableListUser?.filter((val) => filtering(val)).slice(paginationTableListUser.start, paginationTableListUser.end).map((row, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>{idx + 1 + paginationTableListUser.start}</td>
                                                <td>{row.username}</td>
                                                <td>{row.role}</td>
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
                            {tableListUser != null &&
                                <div>{paginationTableListUser.start + 1}-{paginationTableListUser.end > tableListUser.filter((val) => filtering(val)).length ? tableListUser.filter((val) => filtering(val)).length ?? 0 : paginationTableListUser.end ?? 0}</div>
                            }
                            <div>of</div>
                            <div>{tableListUser?.filter((val) => filtering(val)).length ?? 0}</div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("left", tableListUser, paginationTableListUser, setPaginationTableListUser) }}><FaArrowLeft /></div>
                            <div className={css["arrow"]} onClick={() => { TablePaginationUtils.handlePagination("right", tableListUser, paginationTableListUser, setPaginationTableListUser) }}><FaArrowRight /></div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Popup Add New*/}
            <Popup
                setShowPopup={setShowPopupAddNewUser}
                showPopup={showPopupAddNewUser}
                popupTitle={`Add New User`}
                popupContent={
                    <>
                        <div className={css['popup-container']}>
                            <label className={css['popup-label']} htmlFor="vehicle_number">Username</label>
                            <div className={css['popup-input-container']}>
                                <span className={css['popup-icon']}><LiaWindowMaximize className={css['popup-icon-color']} /></span>
                                <input
                                    className={css['popup-input']}
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={selectedAddNewUser?.username ?? ""}
                                    onChange={(event) => {
                                        setSelectedAddNewUser((prevState: (AddUserEntity | null)) => {
                                            return new AddUserEntity({
                                                ...prevState,
                                                username: event.target.value
                                            });
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="vehicle_number">Role</label>
                            <select
                                name="role"
                                id="role"
                                style={{ borderRadius: "0px 5px 5px 0px", width: "100%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)" }}
                                value={selectedAddNewUser?.id_role || ""}
                                onChange={(event) => {
                                    const selectedRole = ListRoles?.find(role => role.id === parseInt(event.target.value));
                                    if (selectedRole) {
                                        setSelectedAddNewUser((prevState: AddUserEntity | null) => {
                                            return new AddUserEntity({
                                                ...prevState,
                                                id_role: selectedRole.id,
                                                role: selectedRole.role
                                            });
                                        });
                                    }
                                }}
                            >
                                <option value="">Choose Role</option>
                                {ListRoles?.map((row_roles, idx) => (
                                    <option value={row_roles.id} key={idx}>
                                        {row_roles.role}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={selectedAddNewUser?.role && selectedAddNewUser?.username ? css['button-enabled'] : css['button-disabled']}
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
                setShowPopup={setShowPopupEditUser}
                showPopup={showPopupEditUser}
                popupTitle={`Edit User`}
                popupContent={
                    <>
                        <div className={css['popup-container']}>

                            <label className={css['popup-label']} htmlFor="inbound_number">Username</label>
                            <div className={css['popup-input-container']}>
                                <span className={css['popup-icon']}><PiBarcodeBold className={css['popup-icon-color']} /></span>
                                <input
                                    className={css['popup-input']}
                                    id="username"
                                    type="text"
                                    placeholder="10A-3"
                                    value={selectedEditUser?.username ?? ""}
                                    onChange={(event) => {
                                        setSelectedEditUser((prevState: (UserEntity | null)) => {
                                            if (prevState != null) {
                                                return new UserEntity({
                                                    ...prevState,
                                                    username: event.target.value
                                                })
                                            } else { return null }
                                        });
                                    }}
                                />
                            </div>
                            <label className={css['popup-label']} htmlFor="inbound_number">Role</label>
                            <select
                                name="role"
                                id="role"
                                style={{ borderRadius: "0px 5px 5px 0px", width: "100%", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)" }}
                                value={selectedEditUser?.role || ""}
                                onChange={(event) => {
                                    const selectedRole = ListRoles?.find(role => role.role === event.target.value);
                                    if (selectedRole) {
                                        setSelectedEditUser((prevState: AddUserEntity | null) => {
                                            return new AddUserEntity({
                                                ...prevState,
                                                id_role: selectedRole.id,
                                                role: selectedRole.role
                                            });
                                        });
                                    }
                                }}
                            >
                                <option value="">Choose Role</option>
                                {ListRoles?.map((row_roles, idx) => (
                                    <option value={row_roles.role} key={idx}>
                                        {row_roles.role}
                                    </option>
                                ))}
                            </select>
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

export default MasterUser