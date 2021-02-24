# JSON to Markdown Files

Hack a massive SharePoint 2013 list of articles into individual Markdown files with appropriate YAML front-matter.

## Overview

This project was created to get a SharePoint list, of over 2,400 articles, out of the old CMS. To get the RSS feed as JSON, I used an online rss-to-json converter (<https://rsstojson.com>.)

The JavaScript in `index.js` consumes a JavaScript object and outputs markdown files. The articles are represented as an array of objects where each object is an article—each object has keys and values that makeup the article content.

It uses a simple for-loop to iterate over each article, generate the YAML front-matter and content, and then use the Nodejs built-in filesystem (`const fs = require('fs')`) to write/name the file:

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

## Prerequisites

- Nodejs
- An RSS feed to convert into JSON

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

