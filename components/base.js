const PropTypes = {
  STRING: "STRING",
  BOOLEAN: "BOOLEAN",
  INTEGER: "INTEGER"
};

class BaseComponent extends HTMLElement {
  static get PropTypes() {
    return PropTypes;
  }

  #state = {};
  #logRenders = false;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this._shadow = shadow;
    this.render = this.render.bind(this);

    const logRenders = this.getAttribute("log-renders");
    this.#logRenders = logRenders === null ? false : true;

    this.#generateContents();
  }

  #generateContents = () => {
    if (this.#logRenders) {
      console.info(`Render log for ${this.constructor.name}:`);
      console.table({ state: this.state });
    }
    this._shadow.innerHTML = this.render();
  };

  setState = (newState) => {
    this.#state = newState;
    this.#generateContents();
  };

  get state() {
    return this.#state || {};
  }

  render() {
    // implement in inheriting classes
    throw new Error(
      `You must implement a 'render' method on class ${this.constructor.name}`
    );
  }

  registerProps = (...propDefs) => {
    propDefs.forEach((propDef) => {
      const {
        propName,
        propType,
        optional = false,
        defaultGetter = undefined
      } = propDef;

      Object.defineProperty(this, propName, {
        get() {
          const prop = this.getAttribute(propName);
          if (!prop) {
            if (!optional) {
              throw new Error(
                `${propName} must be provided to this component!`
              );
            }

            if (defaultGetter) {
              return defaultGetter();
            }

            return null;
          }

          switch (propType) {
            case PropTypes.STRING:
              return prop;
            case PropTypes.INTEGER:
              const intAttr = parseInt(prop, 10);
              if (isNaN(intAttr)) {
                throw new Error(`${prop} is not a valid integer!`);
              }
              return intAttr;
            case PropTypes.BOOLEAN:
              return prop.toLowerCase() === "true" ? true : false;
            default:
              throw new Error(
                `This method does not support props for the type ${propType}`
              );
          }
        }
      });
    });

    this.#generateContents();
  };
}
