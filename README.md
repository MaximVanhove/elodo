# Elodo

Communicate with any REST API in an elegant and object oriented way.

## TOC

[Installation](https://github.com/MaximVanhove/elodo#installation)

[Quick preview](https://github.com/MaximVanhove/elodo#quick-preview)

[Setup](https://github.com/MaximVanhove/elodo#setup)

[Fetching resources](https://github.com/MaximVanhove/elodo#fetching-resources)

[Persisting resources](https://github.com/MaximVanhove/elodo#persisting-resources)

[Cancel requests](https://github.com/MaximVanhove/elodo#cancel-requests)

[Cast attributes](https://github.com/MaximVanhove/elodo#cast-attributes)

[File uploads](https://github.com/MaximVanhove/elodo#file-uploads)

## Installation

`npm install elodo`

## Quick preview

```js
const post = Post.$create({
    title: 'What is Elodo?',
    body: 'Elodo is an easy way to use resource models in front-end applications!',
});

// POST request to "http://api.com/api/posts"
await post.$store();
```

```js
post.title = 'What is Elodo? Amazing!';

// PUT request to "http://api.com/api/posts/1"
await post.$update();
```

```js
// GET request to "http://api.com/api/posts?include=comments,author"
const posts = await Post
    .$request()
    .include('comments', 'author')
    .index();

// Each post is tranformed to an instance of Post
const post = posts[0];
await post.$update();
```

## Setup

### Structure

```
/src
├── /api
|   ├── /resources
|   |   ├── post.js
|   |   └── comment.js
|   └── client.js
|   └── resource.js
|   └── router.js
├── ...
└── app.js
```

### Resource

`api/resource.js`

```js
import { createResource } from 'elodo';
import { client } from './client';
import { router } from './router';

export const Resource = createResource({
    client,
    router,
});
```

`api/router.js`

```js
import { createRouter } from 'elodo';

const router = createRouter();

router.prefix('http://api.com/api/v1/', function (router) {
    // Register each crud action
    router.index('posts', () => `posts`);
    router.store('posts', () => `posts`);
    router.show('posts', (post) => `posts/${post.id}`);
    router.update('posts', (post) => `posts/${post.id}`);
    router.destroy('posts', (post) => `posts/${post.id}`);

    // Or register all crud actions at once
    router.resource('posts');
});

export {
    router,
};
```

`api/client.js`

```js
import Axios from 'axios';

export const client = Axios.create();
```

`api/resources/post.js`

```js
import { Resource } from '../resource';

/**
 * Post resource
 *
 * @class Post
 */
export class Post extends Resource {
    get _attributes () {
        return {
            id: null,
            title: null,
            body: null,
        };
    }

    get _route () {
        return 'posts'; // Used to create the route path
    }
}
```

Now you can use the post resource in `app.js` or any other file

```js
import { Post } from './api/resources/post';

const posts = await Post.$index(); // GET request to "/posts"

const post = await Post.$find(1); // GET request to "/posts/1"

await post.$show();  // GET request to "/posts/1"

await post.$store();  // POST request to "/posts"

await post.$update();  // PUT request to "/posts/1"

await post.$destroy();  // DELETE request to "/posts/1"
```

## Fetching resources

[Fetch list of resources](https://github.com/MaximVanhove/elodo#fetch-list-of-resources)

[Fetch single resource](https://github.com/MaximVanhove/elodo#fetch-single-resource)

[Fetch filtered list of resources](https://github.com/MaximVanhove/elodo#fetch-filtered-list-of-resources)

[Fetch list of resources sorted by an attribute](https://github.com/MaximVanhove/elodo#fetch-list-of-resources-sorted-by-an-attribute)

[Fetch list of resources with relationships](https://github.com/MaximVanhove/elodo#fetch-list-of-resources-with-relationships)

[Fetch list of resources with selected fields](https://github.com/MaximVanhove/elodo#fetch-list-of-resources-with-selected-fields)

[Fetch list of resources with appended fields](https://github.com/MaximVanhove/elodo#fetch-list-of-resources-with-appended-fields)

[Fetch list of resources with specific params](https://github.com/MaximVanhove/elodo#fetch-list-of-resources-with-specific-params)

[Fetch paginated list of resources](https://github.com/MaximVanhove/elodo#fetch-paginated-list-of-resources)

### Fetch list of resources

```js
// GET /posts
const posts = await Post.$index();
```

### Fetch single resource

Find a resource by primary id

```js
// GET /posts/1
const post = await Post.$find(1);
```

Show a resource by its attributes

```js
// GET /posts/1
const post = Post.$create({ id: 1 });
await post.$show();
```

You can also use the `$refresh` alias

```js
// GET /posts/1
const post = Post.$create({ id: 1 });
await post.$refresh();
```

### Fetch filtered list of resources

```js
// GET /posts?filter[title]=Hello
const posts = await Post
    .$request()
    .filter('title', 'Hello')
    .index();
```

You can also use the `where` alias

```js
// GET /posts?filter[title]=Hello
const posts = await Post
    .$request()
    .where('title', 'Hello')
    .index();
```

### Fetch list of resources sorted by an attribute

```js
// GET /posts?sort=title
const posts = await Post
    .$request()
    .sort('title')
    .index();
```

Sort descending

```js
// GET /posts?sort=-title
const posts = await Post
    .$request()
    .sortDesc('title')
    .index();
```

Combine multiple sorts

```js
// GET /posts?sort=id,-name
const posts = await Post
    .$request()
    .sort('id')
    .sortDesc('name')
    .index();
```

### Fetch list of resources with relationships

```js
// GET /posts?include=comments,author
const posts = await Post
    .$request()
    .include('comments', 'author')
    .index();
```

### Fetch list of resources with selected fields

```js
// GET /posts?fields[posts]=id,title
const posts = await Post
    .$request()
    .fields({ 'posts': ['id', 'title'] })
    .index();
```

### Fetch list of resources with appended fields

```js
// GET /posts?append=published_at
const posts = await Post
    .$request()
    .append('published_at')
    .index();
```

### Fetch list of resources with specific params

```js
// GET /posts?param=value
const posts = await Post
    .$request()
    .param('param', 'value')
    .index();
```

### Fetch paginated list of resources

```js
// GET /posts?page[size]=15&page[number]=1
const pagination = await Post
    .$request()
    .page({
        size: 15,
        number: 1,
    })
    .index();

// Pagination data is tranformed to instances of Post
const post = pagination.data[0];
await post.$update();
```

Set the page directly

```js
// GET /posts?page=1
await Post
    .$request()
    .page(1)
    .index();
```

## Persisting resources

[Store resource](https://github.com/MaximVanhove/elodo#store-resource)

[Update resource](https://github.com/MaximVanhove/elodo#update-resource)

[Delete resource](https://github.com/MaximVanhove/elodo#delete-resource)

### Store resource

```js
// POST /posts
const post = Post.$create({ title: 'Hello' });
await post.$store();
```

Or use the `$save` alias

```js
// POST /posts
const post = Post.$create({ title: 'Hello' });
await post.$save();
```

### Update resource

```js
// Put /posts/1
const post = await Post.$find(1);
post.title = 'Updated title';
await post.$update();
```

### Delete resource

```js
// DELETE /posts/1
const post = await Post.$find(1);
await post.$destroy();
```

Or use the `$delete` alias

```js
// DELETE /posts/1
const post = await Post.$find(1);
await post.$delete();
```

## Cancel requests

```js
import { Post } from './resources/post';
import { createSource, isCancel } from 'elodo';

const source = createSource();

Post.$source(source)
    .index()
    .then((posts) => {
        ...
    })
    .catch((error) => {
        if (isCancel(error)) {
            // Request was canceled
        }
    });

source.cancel();
```

Cancel any crud action

```js
import { Post } from './resources/post';
import { createSource, isCancel } from 'elodo';

const source = createSource();
const post = Post.$create();

post.$source(source)
    .store()
    .then((posts) => {
        // Render posts
    })
    .catch((error) => {
        if (isCancel(error)) {
            // Request was canceled
        }
    });

source.cancel();
```

## Cast attributes

[Cast nested properties](https://github.com/MaximVanhove/elodo#cast-nested-properties)

[Custom cast](https://github.com/MaximVanhove/elodo#custom-cast)

[Cast to relationship](https://github.com/MaximVanhove/elodo#cast-to-relationship)

The cast property allows you to convert attributes coming from the server.

Build in cast types are: `number`, `float`, `int`, `bigint`, `boolean`, `string`, `date`, `json`, and `json.parse`.

```js
import { Resource } from '../resource';

export class Post extends Resource {
    get _attributes () {
        return {
            id: null,
            title: null,
            published_at: null,
        };
    }

    get _casts () {
        return {
            id: 'int',
            published_at: 'date',
        };
    }

    get _route () {
        return 'posts';
    }
}
```

### Cast nested properties

```js
import { Resource } from '../resource';

export class Post extends Resource {
    get _attributes () {
        return {
            object: {
                prop: null,
            },
        };
    }

    get _casts () {
        return {
            'object.prop': 'boolean',
        };
    }

    get _route () {
        return 'posts';
    }
}
```

### Custom cast

Add a function to that returns the transformed value.

```js
import { Resource } from '../resource';

export class Post extends Resource {
    get _attributes () {
        return {
            id: null,
            title: null,
            published_at: null,
        };
    }

    get _casts () {
        return {
            published_at: (value) => new Date(value),
        };
    }

    get _route () {
        return 'posts';
    }
}
```

### Cast to relationship

```js
import { Resource } from '../resource';
import { Comment } from './comment';

export class Post extends Resource {
    get _attributes () {
        return {
            id: null,
            title: null,
            comments: null,
        };
    }

    get _casts () {
        return {
            comments: (value) => Comment.create(value),
        };
    }

    get _route () {
        return 'posts';
    }
}
```

## File uploads

Change the content type of the resource to `formdata`

`./api/resources/post.js`

```js
import { Resource } from '../resource';

export class Post extends Resource {
    get _attributes () {
        return {
            id: null,
            thumbnail: null,
        };
    }

    get _contentType () {
        return 'formdata';
    }

    get _route () {
        return 'posts';
    }
}
```

In `./app.js` or any other file

```js
import { Post } from './api/resources/post';

const fileInput = document.querySelector('#fileInput');
const file = fileInput.files[0];

const post = Post.$create({ file });

// POST request to "/posts" with file in formdata
await post.$store();
```
