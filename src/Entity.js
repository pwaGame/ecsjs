module.exports = class Entity {
    static create(declaration = {}) {
        let entity = new Entity();
        entity.generateId();
        Object.keys(declaration).forEach((componentName) => {
            entity.registerComponent(componentName, declaration[componentName]);
        });
        return entity;
    }

    static deserialize(json) {
        try {
            let obj = JSON.parse(json);
            let entity = new Entity();
            Object.keys(obj).forEach((key) => {
                entity[key] = obj[key];
            });
            return entity
        } catch (e) {
            return null;
        }
    }

    constructor() {
    }

    registerComponent(name, values) {
        this[name] = {};
        Object.keys(values).forEach((key) => {
            this[name][key] = values[key];
        });
    }

    generateId() {
        this.id = Math.random().toString(36).substr(2, 9);
    }

    serialize() {
        return JSON.stringify(this);
    }
};
