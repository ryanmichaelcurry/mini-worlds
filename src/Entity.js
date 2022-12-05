
export default class Entity {
    constructor(name = "Entity")
    {
        this.name = name;
        this.components = {};
    }

    addComponent(component, name) {
        this.components[name] = component;
    }

    removeComponent(name) {
        delete this.components[name];
    }
}