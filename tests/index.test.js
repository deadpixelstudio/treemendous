import Tree from '..';
const treeData = require('./data/treeData.json');

describe('creating a tree and nodes', () => {
  let newTree;

  beforeEach(() => {
    newTree = Tree();
  });

  test('a tree can be created', () => {
    expect(newTree.getRoot).toBeInstanceOf(Function);
  });

  test('a tree can insert a node', () => {
    const newNode1 = newTree.insert({ id: 1, name: 'Test Node' });

    expect(newNode1).toEqual({
      id: 1,
      name: 'Test Node',
      children: [],
      parentId: null,
    });
  });

  test('inserting a node without data fails', () => {
    expect(() => {
      newTree.insert();
    }).toThrowError('A new node must contain some data');
  });

  test('inserting a node without an id property (or equivalent from config) fails', () => {
    expect(() => {
      newTree.insert({ data: 'object_with_no_id_property' });
    }).toThrowError(
      'A new node must contain an id property (or equivalent from config)'
    );
  });

  test('the first node inserted into a tree becomes its root', () => {
    const newNode1 = newTree.insert({
      id: 1,
      name: 'Test Node',
    });

    expect(newTree.getRoot()).toBe(newNode1);
  });

  test('adding an additional node without a parentId property (or equivalent from config) fails', () => {
    const newNode1 = newTree.insert({ id: 1, name: 'Test Node' });
    expect(() => {
      newTree.insert({ id: 2, name: 'Test Node' });
    }).toThrowError(
      'A new node must contain a parentId property (or equivalent from config) if root already set'
    );
    expect(newTree.getRoot()).toBe(newNode1);
  });

  test('a node can be added as a child of an existing node', () => {
    const newNode1 = newTree.insert({ id: 1, name: 'Test Node' });
    const newNode2 = newTree.insert({
      id: 2,
      name: 'Test Node 2',
      parentId: 1,
    });

    expect(newNode2.name).toBe('Test Node 2');
    expect(newNode1.children).toEqual(expect.arrayContaining([newNode2]));
  });

  test('an error is thrown if the parent node cannot be found', () => {
    newTree.insert({
      id: 1,
      name: 'Test Node 1',
    });

    expect(() => {
      newTree.insert({
        id: 2,
        name: 'Test Node 2',
        parentId: 'NonExistantId',
      });
    }).toThrowError('The parent node could not be found');
  });
});

describe('searching a tree', () => {
  let newTree;
  let newNode1;
  let newNode1_1;
  let newNode1_2;
  let newNode2;
  let newNode3;
  let newNode3_1;
  let newNode3_2;
  let newNode3_2_1;
  let newNode4;

  beforeEach(() => {
    newTree = Tree();
    newNode1 = newTree.insert({
      id: '1',
      name: 'New Node 1',
    });
    newNode1_1 = newTree.insert({
      id: '1_1',
      name: 'New Node 1_1',
      parentId: '1',
    });
    newNode1_2 = newTree.insert({
      id: '1_2',
      name: 'New Node 1_2',
      parentId: '1',
    });
    newNode2 = newTree.insert({ id: '2', name: 'New Node 2', parentId: '1' });
    newNode3 = newTree.insert({ id: '3', name: 'New Node 3', parentId: '2' });
    newNode3_1 = newTree.insert({
      id: '3_1',
      name: 'New Node 3_1',
      parentId: '3',
    });
    newNode3_2 = newTree.insert({
      id: '3_2',
      name: 'New Node 3_2',
      parentId: '3',
    });
    newNode3_2_1 = newTree.insert(
      { id: '3_2_1', name: 'New Node 3_2_1', parentId: '3_2' },
      newNode3_2
    );
    newNode4 = newTree.insert({ id: '4', name: 'New Node 4', parentId: '3' });
  });

  test('a node knows its parent', () => {
    expect(newNode2.parentId).toBe(newNode1.id);
  });

  test('a node knows its children', () => {
    expect(newNode2.children).toEqual(expect.arrayContaining([newNode3]));
  });

  test('all ancestors of a node can be found', () => {
    expect(newTree.getAncestors(newNode4)).toEqual(
      expect.arrayContaining([newNode3, newNode2, newNode1])
    );
  });

  test('check whether a node is an acestor of another', () => {
    expect(newTree.isAncestorOf(newNode1, newNode2)).toBe(true);
    expect(newTree.isAncestorOf(newNode3_1, newNode3_2)).toBe(false);
  });

  test('all descendants of a node can be found', () => {
    expect(newTree.getDescendants(newNode1)).toEqual(
      expect.arrayContaining([
        newNode1_1,
        newNode1_2,
        newNode2,
        newNode3,
        newNode3_1,
        newNode3_2,
        newNode4,
      ])
    );
  });

  test('check whether a node is an descendant of another', () => {
    expect(newTree.isDescendantOf(newNode2, newNode1)).toBe(true);
    expect(newTree.isDescendantOf(newNode3_1, newNode3_2)).toBe(false);
  });

  test('all siblings of a node can be found', () => {
    expect(newTree.getSiblings(newNode4)).toEqual(
      expect.arrayContaining([newNode3_1, newNode3_2])
    );
  });

  test('check whether two nodes are siblings', () => {
    expect(newTree.isSiblingOf(newNode1, newNode2)).toBe(false);
    expect(newTree.isSiblingOf(newNode3_1, newNode3_2)).toBe(true);
  });

  test('check if a node is a leaf', () => {
    expect(newTree.isLeaf(newNode1)).toBe(false);
    expect(newTree.isLeaf(newNode4)).toBe(true);
  });

  test('the height of a node can be found', () => {
    expect(newTree.getHeight(newTree.getRoot())).toBe(4);
    expect(newTree.getHeight(newNode3)).toBe(2);
  });

  test('the depth a node can be found', () => {
    expect(newTree.getDepth(newNode1)).toBe(0);
    expect(newTree.getDepth(newNode4)).toBe(3);
  });

  test('a node can be found by its id', () => {
    const searchForNode3_1 = newTree.findById('3_1');
    const searchForNode3_2 = newTree.findById(newNode3_2.id);
    expect(searchForNode3_1).toBe(newNode3_1);
    expect(searchForNode3_2).toBe(newNode3_2);
  });
});

describe('traversing, removing and moving nodes', () => {
  let newTree;
  let newNode1;
  let newNode1_1;
  let newNode1_2;
  let newNode2;
  let newNode3;
  let newNode3_1;
  let newNode3_2;
  let newNode3_2_1;
  let newNode4;

  beforeEach(() => {
    newTree = Tree();
    newNode1 = newTree.insert({
      id: '1',
      name: 'New Node 1',
    });
    newNode1_1 = newTree.insert({
      id: '1_1',
      name: 'New Node 1_1',
      parentId: '1',
    });
    newNode1_2 = newTree.insert({
      id: '1_2',
      name: 'New Node 1_2',
      parentId: '1',
    });
    newNode2 = newTree.insert({ id: '2', name: 'New Node 2', parentId: '1' });
    newNode3 = newTree.insert({ id: '3', name: 'New Node 3', parentId: '2' });
    newNode3_1 = newTree.insert({
      id: '3_1',
      name: 'New Node 3_1',
      parentId: '3',
    });
    newNode3_2 = newTree.insert({
      id: '3_2',
      name: 'New Node 3_2',
      parentId: '3',
    });
    newNode3_2_1 = newTree.insert(
      { id: '3_2_1', name: 'New Node 3_2_1', parentId: '3_2' },
      newNode3_2
    );
    newNode4 = newTree.insert({ id: '4', name: 'New Node 4', parentId: '3' });
  });

  test('a tree can be traversed from a given node and all descendant nodes are visited', () => {
    const visitedNodes = [];

    newTree.traverse(newTree.getRoot(), (node) => {
      visitedNodes.push(node.name);
    });

    expect(visitedNodes).toContain('New Node 1');
    expect(visitedNodes).toContain('New Node 1_1');
    expect(visitedNodes).toContain('New Node 1_2');
    expect(visitedNodes).toContain('New Node 2');
    expect(visitedNodes).toContain('New Node 3');
    expect(visitedNodes).toContain('New Node 3_1');
    expect(visitedNodes).toContain('New Node 3_2');
    expect(visitedNodes).toContain('New Node 3_2_1');
    expect(visitedNodes).toContain('New Node 4');
    expect(visitedNodes.length).toBe(9);
  });

  test('a node and all its descendants can be removed)', () => {
    newTree.remove(newNode3);
    const descendants = newTree.getDescendants(newNode1);

    expect(newNode3).toEqual({});
    expect(newNode3_1).toEqual({});
    expect(newNode3_2).toEqual({});
    expect(descendants).toEqual(
      expect.arrayContaining([newNode1_1, newNode1_2, newNode2])
    );
    expect(descendants).toEqual(expect.not.arrayContaining([newNode3]));
    expect(descendants).toEqual(expect.not.arrayContaining([newNode3_1]));
  });

  test('a node can be removed (descendants retained to new parent)', () => {
    const retainedDescendants = newTree.getDescendants(newNode3);
    newTree.remove(newNode3, { retainDescendants: true });
    const newNode1Descendants = newTree.getDescendants(newNode1);
    const newNode2Descendants = newTree.getDescendants(newNode2);

    expect(newNode3).toEqual({});
    expect(newNode1Descendants).toEqual(
      expect.arrayContaining([
        newNode1_1,
        newNode1_2,
        newNode2,
        ...retainedDescendants,
      ])
    );
    expect(newNode2Descendants).toEqual(
      expect.arrayContaining([...retainedDescendants])
    );
    expect(newNode1Descendants).toEqual(expect.not.arrayContaining([newNode3]));
    expect(newNode2Descendants).toEqual(expect.not.arrayContaining([newNode3]));
  });

  test('all descendants of a node can be removed', () => {
    newTree.removeDescendants(newNode3);
    const descendants = newTree.getDescendants(newNode1);

    expect(newNode3.name).toEqual('New Node 3');
    expect(newNode3.children).toEqual([]);
    expect(newTree.getDescendants(newNode3)).toEqual([]);
    expect(newNode3_1).toEqual({});
    expect(newNode3_2).toEqual({});
    expect(newNode3_2_1).toEqual({});
    expect(newNode4).toEqual({});
    expect(descendants).toEqual(
      expect.arrayContaining([newNode1_1, newNode1_2, newNode2, newNode3])
    );
  });

  test('a node can be moved', () => {
    expect(newNode4.parentId).toBe(newNode3.id);
    expect(newNode2.children).toEqual(expect.not.arrayContaining([newNode4]));
    expect(newNode3.children).toEqual(expect.arrayContaining([newNode4]));

    newTree.move(newNode4, newNode2);

    expect(newNode4.parentId).toBe(newNode2.id);
    expect(newNode2.children).toEqual(expect.arrayContaining([newNode4]));
    expect(newNode3.children).toEqual(expect.not.arrayContaining([newNode4]));
  });
});

describe('building a tree from existing json data', () => {
  test('a tree can be built from existing data', () => {
    const newTree = Tree(treeData);
    const root = newTree.getRoot();

    expect(root.id).toEqual('64ce24c7-3054-42f2-b49f-4cdb52cf1bc7');
    expect(root.name).toEqual('users');
  });
});

describe('exporting json from a tree', () => {
  test('a tree can be exported to json', () => {
    const newTree = Tree(treeData);
    const json = newTree.exportJson();

    expect(JSON.parse(json)).toEqual(treeData);
  });
});

describe('creating a tree with a custom config', () => {
  let newTree;
  let newNode1;
  let newNode1_1;
  let newNode1_2;
  let newNode2;
  let newNode3;
  let newNode3_1;
  let newNode3_2;
  let newNode3_2_1;
  let newNode4;

  const config = {
    id: 'custom_id',
    parentId: 'custom_parent_id',
  };

  beforeEach(() => {
    newTree = Tree(null, config);
    newNode1 = newTree.insert({
      custom_id: '1',
      name: 'New Node 1',
    });
    newNode1_1 = newTree.insert({
      custom_id: '1_1',
      name: 'New Node 1_1',
      custom_parent_id: '1',
    });
    newNode1_2 = newTree.insert({
      custom_id: '1_2',
      name: 'New Node 1_2',
      custom_parent_id: '1',
    });
    newNode2 = newTree.insert({
      custom_id: '2',
      name: 'New Node 2',
      custom_parent_id: '1',
    });
    newNode3 = newTree.insert({
      custom_id: '3',
      name: 'New Node 3',
      custom_parent_id: '2',
    });
    newNode3_1 = newTree.insert({
      custom_id: '3_1',
      name: 'New Node 3_1',
      custom_parent_id: '3',
    });
    newNode3_2 = newTree.insert({
      custom_id: '3_2',
      name: 'New Node 3_2',
      custom_parent_id: '3',
    });
    newNode3_2_1 = newTree.insert(
      { custom_id: '3_2_1', name: 'New Node 3_2_1', custom_parent_id: '3_2' },
      newNode3_2
    );
    newNode4 = newTree.insert({
      custom_id: '4',
      name: 'New Node 4',
      custom_parent_id: '3',
    });
  });
  test('a tree can be created with a custom config', () => {
    const searchForNode3_1 = newTree.findById('3_1');
    const searchForNode3_2 = newTree.findById(newNode3_2.custom_id);
    expect(searchForNode3_1).toBe(newNode3_1);
    expect(searchForNode3_2).toBe(newNode3_2);
  });
});
