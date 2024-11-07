class LinenWashingEntity {
    id_rfid : string;
    id_linen : number;
    ruangan : string;
    jenis : string;
    date_time_washed : Date
    
    constructor(object: LinenWashingEntity) {
        this.id_rfid = object.id_rfid;
        this.id_linen = object.id_linen;
        this.ruangan = object.ruangan;
        this.jenis = object.jenis;
        this.date_time_washed = object.date_time_washed;
    }
}

class AddLinenWashingEntity {
    id_rfid : string;
    id_linen : number;
    ruangan : string;
    jenis : string;
    
    constructor(object: AddLinenWashingEntity) {
        this.id_rfid = object.id_rfid;
        this.id_linen = object.id_linen;
        this.ruangan = object.ruangan;
        this.jenis = object.jenis;
    }
}

export { LinenWashingEntity, AddLinenWashingEntity};