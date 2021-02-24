const fs = require('fs');
const colors = require('colors/safe');
let Parser = require('rss-parser');
let parser = new Parser({
  timeout: 100000
});
const config = { // Configuration object defines the created file's path, name, and extension
  input: {
    url: 'http://www.kcc.edu/FacultyStaff/update/_layouts/listfeed.aspx?List=%7BC267947C%2D5D3A%2D41DF%2DBF8C%2D8C8142ECE9FC%7D&Source=http%3A%2F%2Fauthoring%2Ekcc%2Eedu%2FFacultyStaff%2Fupdate%2FLists%2FEvents%2FAllItems%2Easpx'
  },
  output: {
    path: './dist/test/', // Make sure the path already exists before running
    filenameProperty: 'title', // which JSON property to use for the generating the name of the file
    extension: '.md'
  }
}

colors.setTheme({
  info: 'brightCyan',
  warn: 'yellow',
  success: 'green',
  debug: 'cyan',
  error: 'red'
});

(async () => {
  let feed = await parser.parseURL(config.input.url);
  console.log(`This feed has ${colors.info(feed.items.length)} items!`);

  feed.items.forEach((item, i) => {
    //console.log(item.title + ':' + item.creator);
    let markdownFileArray = [
      "---",
      `\ntitle: ${item.title}`,
      `\nlink: ${item.link}`,
      `\npubDate: ${item.pubDate}`,
      `\ncreator: ${item.creator}`,
      "\n---",
      `\ncontent: ${item.content}`
    ];
    const fileContentString = markdownFileArray.join('');
    const filename = item[config.output.filenameProperty].replace(/\W/g, '');
    const file = config.output.path + filename + config.output.extension;
    
    fs.writeFile(file, fileContentString, (err) => {
        if (err) throw err;
        console.log(`The file ${colors.info(filename + '.md')} has been saved to ${colors.info(config.output.path)}! - File #: ${i}`);
      });
  });
})();