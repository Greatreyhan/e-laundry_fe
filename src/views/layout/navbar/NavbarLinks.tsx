import { GoDotFill } from "react-icons/go";
import { MdDashboard } from "react-icons/md";
import { RiInboxArchiveFill } from "react-icons/ri";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import { FaRegListAlt } from "react-icons/fa";
import { BiSolidWasher } from "react-icons/bi";
import { BiSolidPackage } from "react-icons/bi";


const NavBarLinks : any = [
    {
        title : "Dashboard",
        link : "/dashboard",
        icon : <MdDashboard />,
        child : []
    },
    {
        title : "Batch Check In",
        link : "/batch_check_in",
        icon : <RiInboxArchiveFill />,
        child : []
    },
    {
        title : "Linen Washing",
        link : "/linen_washing",
        icon : <BiSolidWasher />,
        child : []
    },
    {
        title : "Linen Packing",
        link : "/linen_packing",
        icon : <BiSolidPackage />,
        child : []
    },
    {
        title : "Batch Check Out",
        link : "/batch_check_out",
        icon : <RiInboxUnarchiveFill />,
        child : []
    },
    {
        title : "Master",
        link : null,
        icon : <FaRegListAlt />,
        child : [
            {
                title : "User",
                link : "/master/user",
                icon : <GoDotFill />,
            },
            {
                title : "Linen",
                link : "/master/linen",
                icon : <GoDotFill />,
            },
        ]
    },
]

export default NavBarLinks