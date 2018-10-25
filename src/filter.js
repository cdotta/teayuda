class Filter {
    constructor() {
        this.alpha  = 0.7;
        this.yk     = 45;
        this.k      = 0;
    }

    update(uk) {
        this.k = this.k + 1;
        return this.k;
    }

    getEstimation() {
        return this.yk;
    }
}

class KalmanFilter extends Filter {
    constructor() {
        super();
        this.Qk     = 140;
        this.Rk     = 10;
        this.Pkp1   = 0;
        this.Kkp1   = 0;
    }

    update(uk) {
        this.ykp1m  = this.alpha * this.yk + (1 - this.alpha) * uk;
        this.Pkp1   = this.alpha * this.Pkp1 * this.alpha + this.Qk;
        this.Kkp1   = this.Pkp1 * (1 / (this.Pkp1 + this.Rk));
        this.yk     = this.ykp1m + this.Kkp1 * (uk - this.ykp1m);
        return super.update(uk);
    }
}

class ExpFilter extends Filter {
    constructor() {
        super();
    }

    update(uk) {
        this.yk = this.alpha * this.yk + (1 - this.alpha) * uk;
        return super.update(uk);
    }
}

module.exports = {
    KalmanFilter,
    ExpFilter,
}