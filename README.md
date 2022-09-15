# Treemendous

A javascript package to build, create, traverse and manage tree data structures

## Features

- Create super easy and flexible tree structures manually or from existing data
- Find tree nodes by their id
- Find a nodes ancestors, descendants or siblings
- Traverse the tree from the root or any other node and interact with every node along the way with a callback
- Manipulate the tree by inserting, moving and/or removing them
- Export a tree to json
- Extensively tested

## Installation

### Node

Treemendous is available as an npm module so you can run this command in your project's root folder:

`npm install treemendous`

## Usage

### Basic Usage

It couldn't be easier to get started...

```js
import Tree from 'treemendous';

// Create a new tree
const tree = Tree();

// Make a new node to be added as the root node
// Only an 'id' property is required but, other properties can be added
// The root node does not need a 'parentId'
const rootNode = { id: '1', name: 'New Node 1' };

// Insert the node into the tree
// The first node inserted always becomes the root
tree.insert(rootNode);

// All future nodes require both an 'id' and an existing 'parentId' property
tree.insert({ id: '2', name: 'New Node 2', parentId: '1' });
```

### Using Existing Data

Already have some data you want to use? No problem, you can initialise the tree with your own json. You can even add a custom config to override the required default 'id' and 'parentId' property names if you need.

More on the custom config later, for now we'll just keep the default and simply pass in your data when you create the tree:

```js
import Tree from 'treemendous';
import data from './yourData.json';

// Create a new tree and pass in your json data
const tree = Tree(data);
```

### Using A Custom Config

Let's say your existing json data has objects that use property names other than the default 'id' and 'parentId' one's...maybe something like this:

```
[
    { "commentId": "1", "comment": "treemendous is awesome" },
    { "commentId": "2", "comment": "sure is", "parentCommentId": "1" },
    { "commentId": "3", "comment": "agreed", "parentCommentId": "2" }
]
```

That's no problem, just override them by passing in a custom config object mapping your own property names as the second argument like this:

```js
import Tree from 'treemendous';
import data from './yourData.json';

// Create a custom config
const customConfig = {
  id: 'commentId',
  parentId: 'parentCommentId',
};

// Create a new tree and pass in your json data and your custom config
const tree = Tree(data);

//  Tree Structure

//  treemendous is awesome
//      - sure is
//          - agreed
```

## API Reference

### Create A New Tree

```js
const tree = Tree(data, config);
```

#### **data** (optional)

Type: Array - Containing objects with an `id` and a `parentId` (can be configured below)

#### **config** (optional)

Type: Object

- `id` - A reference to the node's id. Default is `id`;
- `parentId` - A reference to the parent node's id. Default is `parentId`;

### getRoot

```js
tree.getRoot();
```

Return: Node Object | null - The root node of the tree

### getDepth

```js
tree.getDepth(node);
```

Return: Number - The depth of the node

### getHeight

```js
tree.getHeight(node);
```

Return: Number - The height of the node

### findById

```js
tree.findById(id);
```

#### **id**

Type: String - The id of the node to search for

Return: Node Object | null

### traverse

```js
tree.traverse(node, callback);
```

#### **node**

Type: Node Object - The node from which to start traversing

#### **callback**

Type: Function - The function to run for each node during the traversal

Return: Void

### insert

```js
tree.insert(node);
```

#### **node**

Type: Node Object

Return: Node Object

### move

```js
tree.move(node, newParentNode);
```

#### **node**

Type: Node Object - The node to be moved

#### **newParentNode**

Type: Node Object - The parent node to make it a child of

Return: Node Object

### remove

```js
tree.remove(node, options);
```

#### **node**

Type: Node Object - The node to be removed

#### **options** (optional)

Type: Object

- `retainDescendants` - If set to `true` the descendants of the node to be removed will be retained and moved to the oringal node's parent;

Return: Object (Empty)

### removeDescendants

```js
tree.removeDescendants(node);
```

#### **node**

Type: Node Object - The node from which to remove all descendants from

Return: Node Object

### getAncestors

```js
tree.getAncestors(node);
```

#### **node**

Type: Node Object

Return: Array - Containing all ancestors of the given node

### getDescendants

```js
tree.getDescendants(node);
```

#### **node**

Type: Node Object

Return: Array - Containing all descendants of the given node

### getSiblings

```js
tree.getSiblings(node);
```

#### **node**

Type: Node Object

Return: Array - Containing all siblings of the given node

### isAncestorOf

```js
tree.isAncestorOf(node, nodeToCheck);
```

#### **node**

Type: Node Object - The given node

#### **nodeToCheck**

Type: Node Object - The node to check is an ancestor of the given node

Return: Boolean

### isDescendantOf

```js
tree.isDescendantOf(node, nodeToCheck);
```

#### **node**

Type: Node Object - The given node

#### **nodeToCheck**

Type: Node Object - The node to check is a descendant of the given node

Return: Boolean

### isSiblingOf

```js
tree.isSiblingOf(node, nodeToCheck);
```

#### **node**

Type: Node Object - The given node

#### **nodeToCheck**

Type: Node Object - The node to check is a sibling of the given node

Return: Boolean

### isLeaf

```js
tree.isLeaf(node);
```

#### **node**

Type: Node Object

Return: Boolean

### exportJson

```js
tree.exportJson();
```

Return: String (json)
