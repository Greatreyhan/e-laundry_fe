class LinenCheckOvertime {
  id_rfid: string;
  id_linen: number;
  status: string;
  total_wash: number;
  date_last_wash: Date;

  constructor(object: LinenCheckOvertime) {
    this.id_rfid = object.id_rfid;
    this.id_linen = object.id_linen;
    this.status = object.status;
    this.total_wash = object.total_wash;
    this.date_last_wash = object.date_last_wash;
  }
}

export { LinenCheckOvertime };
