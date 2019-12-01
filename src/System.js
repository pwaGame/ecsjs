module.exports = class System {
    constructor(...components) {
        this.components = '';
        components.forEach((component) => {
            if (!this.components) {
                this.components += component;
            } else {
                this.components += '&' + component;
            }
        });
    }

    update(dt, entity) {
    }
};
