let instance = null;
module.exports = class EntityStore {
    static getInstance() {
        if (!instance) {
            instance = new EntityStore();
        }
        return instance;
    }

    constructor() {
        this.entityMap = {};
        this.entityByComponentNameMap = {};
        this.entityByComponentsNameMap = {};
    }

    registerEntity(entity) {
        while (this.entityMap[entity.id]) {
            entity.generateId();
        }
        this.entityMap[entity.id] = entity;
        let components = '';
        Object.keys(entity).forEach((key) => {
            if (key !== 'id') {
                if (components === '') {
                    components = key;
                } else {
                    components += '&' + key;
                }
                if (!this.entityByComponentNameMap[key]) {
                    this.entityByComponentNameMap[key] = [];
                }
                this.entityByComponentNameMap[key].push(entity.id);

            }
        });
        if (components !== '') {
            this.__saveComponents(entity.id, components);
        }
    }

    __getAllCombinations(str) {
        let combinations = [];
        let split = str.split('&');
        split.forEach((name) => {
            combinations.forEach((combination) => {
                combinations.push(combination + '&' + name);
                combinations.push(name + '&' + combination);
            });
            combinations.push(name);
        });
        return combinations;
    }

    __saveComponents(entityId, components) {
        let combinations = this.__getAllCombinations(components);
        combinations.forEach((combination) => {
            if (!this.entityByComponentsNameMap[combination]) {
                this.entityByComponentsNameMap[combination] = [];
            }
            this.entityByComponentsNameMap[combination].push(entityId);
        });
    }

    getEntitiesByComponents(components) {
        if (components instanceof Array) {
            let str;
            components.forEach((component) => {
                if (!str) {
                    str = component;
                } else {
                    str += '&' + component;
                }
            });
            if (!str) {
                return [];
            }
            return this.entityByComponentsNameMap[str] || [];
        } else {
            return this.getEntitiesByComponent(components);
        }
    }

    getEntitiesByComponent(component) {
        return this.entityByComponentNameMap[component];
    }

    getEntitiesById(id) {
        return this.entityMap[id];
    }
};