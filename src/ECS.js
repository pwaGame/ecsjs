let instance = null;
module.exports = class EntityStore {
    static getInstance() {
        if (!instance) {
            instance = new EntityStore();
        }
        return instance;
    }

    constructor() {
        this.systems = [];
        this.entityMap = {};
        this.entityByComponentNameMap = {};
        this.entityByComponentsNameMap = {};

        this.lastTime = 0;
        this.firstTime = 0;
    }

    init(time) {
        this.lastTime = time;
        this.firstTime = time;
        this.now = time;
        this.dt = 0;
        this.updateTime = 0;
    }

    registerSystem(system) {
        this.systems.push(system);
    }

    update(first) {
        if (first) {
            this.lastTime = Date.now();
            this.firstTime = Date.now();
            this.now = Date.now();
            this.dt = 0;
            this.updateTime = 0;
            this.ticks = 0;
            return;
        }
        this.ticks++;
        this.now = Date.now();
        this.dt = this.now - this.lastTime;
        this.systems.forEach((system) => {
            let entitiesIds = this.getEntitiesByComponents(system.components);
            entitiesIds.forEach((id) => {
                let entity = this.getEntityById(id);
                system.update(this.dt, entity);
            });
        });
        this.__resetUpdatedFlag();
        this.updateTime = Date.now() - this.now;
        this.lastTime = this.now;
    }

    __resetUpdatedFlag() {
        Object.keys(this.entityMap).forEach((id) => {
            this.entityMap[id].updated = false;
        });
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

    getEntitiesByComponents(...components) {
        let str;
        components.forEach((component) => {
            if (!str) {
                str = component;
            } else {
                str += '&' + component;
            }
        });
        if (!str) {
            return Object.keys(this.entityMap);
        } else {
            return this.entityByComponentsNameMap[str] || [];
        }
    }

    getEntityById(id) {
        return this.entityMap[id];
    }
};
