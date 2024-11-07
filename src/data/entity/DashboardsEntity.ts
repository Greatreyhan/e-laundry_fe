class DashboardLinenEntity {
    bersih: number;
    kotor: number;
    kadaluarsa: number;

    constructor(object: DashboardLinenEntity) {
        this.bersih = object.bersih;
        this.kotor = object.kotor;
        this.kadaluarsa = object.kadaluarsa;
    }
}

export { DashboardLinenEntity };