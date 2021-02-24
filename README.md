# RSS to Markdown Files

-----

_Hack a massive SharePoint 2013 list of articles into individual Markdown files with appropriate YAML front-matter._

## Overview

This project was created to get a SharePoint list, of over 2,400 articles, out of the old CMS.

### The Old

Originally, I had to take the SharePoint RSS feed—created from a sharepoint list—and convert it into JSON. I used an online rss-to-json converter (<https://rsstojson.com>) and saved it in it's own exported module.

The `/feed.js` file is a CommonJS export of one of the JSON feeds—from the old way of doing things.

I imported, then iterated over, the object's properties to create each markdown file using the Nodejs built-in filesystem (`const fs = require('fs')`) to write/name the file:
```javascript
const fs = require('fs');

fs.writeFile(filename, fileString, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```

- The `filename` variable passed to `fs.writeFile()` and should include the extension - I use the article title to create unique filenames.
  - If you want to write the files to a specific folder, make sure the directory exists first.
- `fileString` becomes the contents of the file and must be a string
- The anonymous callback function that throws an error and logs the console message is required because it is unsafe to run `fs.writeFile()` multiple times without waiting for the callback.

> It is unsafe to use fs.writeFile() multiple times on the same file without waiting for the callback. 
> 
> \- Official Nodejs documentation: https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback

### The New

*Now the project uses the `rss-parser` module to grab the feed directly from the URL—as opposed to needing to convert the feed to JSON manually and then process the JSON.*

The files are still created using the same built-in Nodejs file system method as before: [`fs.writeFile(file, data[, options], callback)`](https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback){: target='_blank' rel='noopener noreferrer' }

This simplifies the code as `rss-parser` makes iterating over a feed really easy:

```javascript
(async () => {
  let feed = await parser.parseURL('https://www.myfeed.com/rss');

  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link)
  });
})();
```
- The resulting `feed` variable from the code above, is an object representing the feed. Simply iterate over `feed.items` to access each article's content.
- Each article in `feed.items` has the following available properties:
  - ```javascript
    item.title // article title
    item.link // article URL
    item.pubDate  // article publish-date
    item.creator = // article's author
    item.content // article's main content - body of the article
    item.contentSnippet // article-lead or snippet (stripped of HTML elements)
    item.guid // I never end up using the last ones but they're available
    item.categories
    item.isoDate
    ```

I also added the module `colors` to make the terminal output a little more aesthetically pleasing and interesting.

## Prerequisites

- Nodejs (I'm currently at v14 the Latest LTS)
- An RSS feed

## Installation

```bash
npm i
# OR
npm install
```

## Development

Copy the repository locally, go into the folder, and run the build command:

```bash
git clone git@github.com:wdzajicek/json-to-markdown-files.git
cd json-to-markdown-files
npm run build

# Or run without npm
node index.js
```

## Adjust the timeout limit

When processing large RSS feeds (Some of my RSS feeds contained 900+ and even 1,400+ articles) you will probably need to increase `rss-parser`'s timeout.

To change the default timeout-limit, you need to set the timeout option when initiating a `new Parser({/* options */})`, which must be after importing it with `require()`:

```javascript
let Parser = require('rss-parser');

let parser = new Parser({
  timeout: 600000 // In milliseconds - 60 seconds is the default value
});
```

**NOTE:** The default value of `60000` was too short for a 900+ article-feed.