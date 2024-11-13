import { useState } from "react";
import css from "./RunningText.module.css";
import Popup from "../popup/Popup";
import { format } from "date-fns";
import { LinenCheckOvertime } from "../../../data/entity/LinenOvertime";

const RunningText = () => {
  const [showPopupScanLinensOvertime, setShowPopupScanLinensOvertime] =
    useState<boolean>(false);
  const [scannedLinensOvertime, setScannedLinensOvertime] = useState<
    LinenCheckOvertime[] | null
  >(null);

  const handlePopupAddNew = async () => {
    setShowPopupScanLinensOvertime(true);
    setScannedLinensOvertime(null);

    const sample_add_new_linen: LinenCheckOvertime[] = [
      {
        id_linen: 7,
        id_rfid: "AD82232DD",
        status: "Ready To Pack",
        date_last_wash: new Date(),
        total_wash: 13,
      },
      {
        id_linen: 8,
        id_rfid: "AD82A3234",
        status: "Ready To Pack",
        date_last_wash: new Date(),
        total_wash: 16,
      },
      {
        id_linen: 9,
        id_rfid: "AD82A335D",
        status: "Check In Laundry",
        date_last_wash: new Date(),
        total_wash: 26,
      },
      {
        id_linen: 10,
        id_rfid: "AD82A3345",
        status: "Ready To Pack",
        date_last_wash: new Date(),
        total_wash: 11,
      },
      {
        id_linen: 11,
        id_rfid: "AD82A223C",
        status: "Check In Laundry",
        date_last_wash: new Date(),
        total_wash: 23,
      },
    ];
    setScannedLinensOvertime(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (i === 0) {
        setScannedLinensOvertime([sample_add_new_linen[0]]);
      } else {
        setScannedLinensOvertime((prev) =>
          prev ? [...prev, sample_add_new_linen[i]] : [sample_add_new_linen[i]]
        );
      }
    }
  };

  return (
    <>
      <a
        className={css["running-text"]}
        onClick={() => {
          handlePopupAddNew();
        }}
      >
        <span>Terdapat {scannedLinensOvertime?.length} Linen Yang Tidak Dicuci Lebih Dari 3 Hari</span>
      </a>

      <Popup
        setShowPopup={setShowPopupScanLinensOvertime}
        showPopup={showPopupScanLinensOvertime}
        popupTitle={`Linen Yang Tidak Dicuci Lebih Dari 3 Hari`}
        popupContent={
          <>
            <div
              style={{
                height: "100%",
                padding: "1vh 1vw",
                width: "100%",
                overflow: "auto",
                position: "relative",
              }}
            >
              <table
                className="normalTable"
                style={{ textAlign: "center", marginTop: "2px" }}
              >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>ID LINEN</th>
                    <th>Status</th>
                    <th>Total Wash</th>
                    <th>Date Last Wash</th>
                  </tr>
                </thead>
                {scannedLinensOvertime != null &&
                  scannedLinensOvertime.length > 0 && (
                    <tbody>
                      {scannedLinensOvertime?.map((row, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{row.id_linen ?? ""}</td>
                            <td>{row.status ?? ""}</td>
                            <td>{row.total_wash ?? ""}</td>
                            <td>{format(row.date_last_wash, 'yyyy-MM-dd') ?? ""}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
              </table>
            </div>
          </>
        }
      />
    </>
  );
};

export default RunningText;
