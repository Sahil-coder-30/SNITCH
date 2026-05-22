/**
 * A Node representing an item in the circular linked list.
 */
export class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * A Doubly Circular Linked List implementation optimized for UI Carousels.
 */
export class DoublyCircularLinkedList {
  constructor(items = []) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    if (Array.isArray(items)) {
      items.forEach(item => this.append(item));
    }
  }

  /**
   * Appends a new item to the end of the circular linked list.
   * @param {*} value The value to store in the node.
   * @returns {Node} The newly created Node.
   */
  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
    } else {
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.tail.next = newNode;
      this.head.prev = newNode;
      this.tail = newNode;
    }

    this.size++;
    return newNode;
  }

  /**
   * Converts the circular linked list nodes into a standard array.
   * Useful for map rendering (e.g. dots indicator or list lists).
   * @returns {Array<Node>}
   */
  toNodeArray() {
    const nodes = [];
    if (!this.head) return nodes;

    let current = this.head;
    do {
      nodes.push(current);
      current = current.next;
    } while (current !== this.head);

    return nodes;
  }

  /**
   * Converts the circular linked list node values into a standard array.
   * @returns {Array<*>}
   */
  toArray() {
    const values = [];
    if (!this.head) return values;

    let current = this.head;
    do {
      values.push(current.value);
      current = current.next;
    } while (current !== this.head);

    return values;
  }

  /**
   * Finds the node that holds a specific value.
   * @param {*} value
   * @returns {Node|null}
   */
  find(value) {
    if (!this.head) return null;

    let current = this.head;
    do {
      if (current.value === value) return current;
      current = current.next;
    } while (current !== this.head);

    return null;
  }

  /**
   * Retrieves the node at a specific index.
   * @param {number} index
   * @returns {Node|null}
   */
  getNodeAtIndex(index) {
    if (!this.head || index < 0 || index >= this.size) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }

  /**
   * Gets the index of a given node in the list.
   * @param {Node} node
   * @returns {number} The index or -1 if not found.
   */
  indexOfNode(node) {
    if (!this.head || !node) return -1;

    let current = this.head;
    let index = 0;
    do {
      if (current === node) return index;
      current = current.next;
      index++;
    } while (current !== this.head);

    return -1;
  }
}
