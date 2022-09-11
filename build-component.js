/**
 * @param {Record<"tagName" | "attributes" | "className" | "children", any>} data 
 * @returns {Element}
 */
function buildComponent(data) {
    if (!data || typeof data !== "object") {
        return data;
    }

    const node = _compose(
        _withComponentChildren(data.children),
        _withComponentAttributes(data.attributes),
        _withComponentClassName(data.className),
        _createElement
    )(data.tagName);

    return node;
}
/**
 * @returns {(data: any) => data}
 */
function _compose() {
    const fns = Array.from(arguments);
    return function (data) {
        return fns.reduceRight(function (acc, fn) {
            return fn(acc);
        }, data);
    }
}
/**
 * @param {String} tagName 
 * @returns {Element}
 */
function _createElement(tagName) {
    return document.createElement(tagName);
}
/**
 * @param {attributes: Record<String, String>} attributes
 * @returns {(node: Element) => Element}
 */
function _withComponentAttributes(attributes) {
    return function setElementAttributes(node) {
        if (attributes) {
            const keylist = Object.keys(attributes);
            while (keylist.length > 0) {
                const key = keylist.shift();
                node.setAttribute(key, attributes[key]);
            }
        }
        return node;
    }
}
/**
 * @param {String | String[]} classlist 
 * @returns {(node: Element) => Element}
 */
function _withComponentClassName(className) {
    return function setElementClassName(node) {
        if (className && Array.isArray(className)) {
            node.classList = className.join(" ");
        } else if (className && typeof className === "string") {
            node.classList = className;
        }
        return node;
    }
}
/** 
 * @param {String | Record<String, any> | Array<String | Record<String, any>} children
 * @returns {(node: Element) => Element}
 * * Will cause recursion if called inside "buildComponent"
 */
function _withComponentChildren(children) {
    return function (node) {
        if (children) {
            if (Array.isArray(children)) {
                const childArray = children.slice();
                while (childArray.length > 0) {
                    const data = childArray.shift();
                    const child = buildComponent(data);

                    if (child instanceof Element) {
                        node.appendChild(child);
                    } else if (typeof child === "string") {
                        node.textContent = child;
                    }
                }
            } else {
                const child = buildComponent(children);

                if (child instanceof Element) {
                    node.appendChild(child);
                } else if (typeof child === "string") {
                    node.textContent = child;
                }
            }
        }

        return node;
    }
}
