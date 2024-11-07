class BatchCheckOutEntity {
    id: number;
    batch: number;
    qty: number;
    linens: LinenCheckOutEntity[]

    constructor(object: BatchCheckOutEntity) {
        this.id = object.id;
        this.batch = object.batch;
        this.qty = object.qty;
        this.linens = object.linens;
    }
}

class LinenCheckOutEntity {
    id_rfid : string;
    id_linen : number;
    ruangan : string;
    jenis : string;
    status : "AKTIF" | "NONAKTIF";
    total_wash : number
    date_last_wash : Date
    
    constructor(object: LinenCheckOutEntity) {
        this.id_rfid = object.id_rfid;
        this.id_linen = object.id_linen;
        this.ruangan = object.ruangan;
        this.jenis = object.jenis;
        this.status = object.status;
        this.total_wash = object.total_wash;
        this.date_last_wash = object.date_last_wash;
    }
}

export { BatchCheckOutEntity, LinenCheckOutEntity};