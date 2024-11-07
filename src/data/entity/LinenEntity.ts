class LinensEntity {
    id_rfid : string;
    id_linen : number;
    ruangan : string;
    jenis : string;
    status : "AKTIF" | "NONAKTIF";
    total_wash : number
    date_last_wash : Date | null

    constructor(object: LinensEntity) {
        this.id_rfid = object.id_rfid;
        this.id_linen = object.id_linen;
        this.ruangan = object.ruangan;
        this.jenis = object.jenis;
        this.status = object.status;
        this.total_wash = object.total_wash;
        this.date_last_wash = object.date_last_wash;
    }
}

class AddLinensEntity {
    id_rfid? : string;
    ruangan? : string;
    jenis? : string;

    constructor(object: AddLinensEntity) {
        this.id_rfid = object.id_rfid;
        this.ruangan = object.ruangan;
        this.jenis = object.jenis;
    }
}

export { LinensEntity, AddLinensEntity };