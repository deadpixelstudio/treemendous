const Node = (data, config) => {
  const node = {
    ...data,
    id: data[config.id],
    parentId: data[config.parentId] || null,
    children: [],
  };

  if (config.id !== 'id') {
    node[config.id] = data[config.id];
    delete node.id;
  }

  if (config.parentId !== 'parentId') {
    node[config.parentId] = data[config.parentId];
    delete node.parentId;
  }

  return node;
};

const Tree = (data, options) => {
  const config = {};
  config.id = options?.id || 'id';
  config.parentId = options?.parentId || 'parentId';

  let root = null;

  const setRoot = (node) => (root = node);

  const getRoot = () => {
    return root;
  };

  const traverse = (startingNode, callback) => {
    const queue = [startingNode];

    while (queue.length) {
      const node = queue.shift();
      const complete = callback(node);

      if (complete) break;

      if (!node.children) return;

      node.children.map((child) => queue.push(child));
    }
  };

  const getAncestors = (node) => {
    const ancestors = [];

    const queue = [node];

    while (queue.length) {
      const node = queue.shift();

      const parent = findById(node[config.parentId]);

      if (!parent) break;

      queue.push(parent);
      ancestors.push(parent);
    }
    return ancestors;
  };

  const isAncestorOf = (node, nodeToCheck) => {
    return getAncestors(nodeToCheck).includes(node);
  };

  const getDescendants = (node) => {
    const descendants = [];

    traverse(node, (node) => {
      node.children.map((child) => {
        descendants.push(child);
      });
    });
    return descendants;
  };

  const isDescendantOf = (node, nodeToCheck) => {
    if (node === root) return false;
    return getDescendants(nodeToCheck).includes(node);
  };

  const getSiblings = (node) => {
    if (node === root) return false;
    return findById(node[config.parentId]).children.filter((child) => {
      return child[config.id] !== node[config.id];
    });
  };

  const isSiblingOf = (node, nodeToCheck) => {
    if (node === root) return false;
    return getSiblings(node).includes(nodeToCheck);
  };

  const isLeaf = (node) => {
    return node.children.length === 0;
  };

  const getDepth = (node) => getAncestors(node).length;

  const getHeight = (node) => {
    if (node.children.length === 0) return 0;

    let height = 0;
    let startingDepth = getDepth(node);
    let currentParent = null;

    traverse(node, (node) => {
      let currentDepth = getDepth(node);

      const parent = findById(node[config.parentId]);

      if (parent !== currentParent && currentDepth > startingDepth) {
        currentParent = parent;
        height++;
      }
    });
    return height;
  };

  const findById = (id) => {
    let matchingNode = null;

    traverse(root, (node) => {
      if (node[config.id] === id) {
        matchingNode = node;
        return true;
      }
    });

    return matchingNode;
  };

  const addNodeToParent = (node) => {
    const parentNode = findById(node[config.parentId]);

    if (!parentNode) throw new Error('The parent node could not be found');

    parentNode.children.push(node);
  };

  const removeNodeFromParent = (node) => {
    const parent = findById(node[config.parentId]);

    parent.children.map((child, index) => {
      if (child === node) parent.children.splice(index, 1);
    });
  };

  const insert = (node) => {
    if (!node) throw new Error('A new node must contain some data');
    if (!node.hasOwnProperty(config.id))
      throw new Error(
        'A new node must contain an id property (or equivalent from config)'
      );

    const newNode = Node(node, config);

    if (root === null) {
      setRoot(newNode);
      return newNode;
    }

    if (newNode[config.parentId] === null) {
      if (root === null) {
        setRoot(newNode);
        return;
      }
      throw new Error(
        'A new node must contain a parentId property (or equivalent from config) if root already set'
      );
    }

    addNodeToParent(newNode);

    return newNode;
  };

  const move = (node, newParentNode) => {
    removeNodeFromParent(node);
    node[config.parentId] = newParentNode[config.id];
    addNodeToParent(node);
    return node;
  };

  const clearNode = (node) => {
    for (let member in node) delete node[member];
    return node;
  };

  const remove = (node, options) => {
    const retainedDescendants = node.children;

    removeNodeFromParent(node);

    if (options?.retainDescendants) {
      retainedDescendants.map((retainedNode) => {
        retainedNode[config.parentId] = node[config.parentId];
        addNodeToParent(retainedNode);
      });
    } else {
      node.children.map((child) => {
        clearNode(child);
      });
    }

    return clearNode(node);
  };

  const removeDescendants = (node) => {
    getDescendants(node).map((child) => {
      clearNode(child);
    });
    node.children = [];

    return node;
  };

  const buildFromData = (data) => {
    data.map((item) => {
      insert(item);
      buildFromData(item.children);
    });
    return root;
  };

  const exportJson = () => {
    return JSON.stringify([root]);
  };

  if (data) {
    buildFromData(data);
  }

  return {
    getRoot,
    getDepth,
    getHeight,
    findById,
    traverse,
    insert,
    move,
    remove,
    removeDescendants,
    getAncestors,
    isAncestorOf,
    getDescendants,
    isDescendantOf,
    getSiblings,
    isSiblingOf,
    isLeaf,
    exportJson,
  };
};

export default Tree;
