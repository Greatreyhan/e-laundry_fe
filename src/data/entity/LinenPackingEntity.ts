class LinenPackingEntity {
    id_rfid : string;
    id_linen : number;
    ruangan : string;
    jenis : string;
    date_time_packed : Date
    
    constructor(object: LinenPackingEntity) {
        this.id_rfid = object.id_rfid;
        this.id_linen = object.id_linen;
        this.ruangan = object.ruangan;
        this.jenis = object.jenis;
        this.date_time_packed = object.date_time_packed;
    }
}

class AddLinenPackingEntity {
    id_rfid : string;
    id_linen : number;
    ruangan : string;
    jenis : string;
    
    constructor(object: AddLinenPackingEntity) {
        this.id_rfid = object.id_rfid;
        this.id_linen = object.id_linen;
        this.ruangan = object.ruangan;
        this.jenis = object.jenis;
    }
}

export { LinenPackingEntity, AddLinenPackingEntity};