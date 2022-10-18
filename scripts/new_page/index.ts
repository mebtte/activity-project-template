import fs from "fs";
import readline from "readline";

const PAGE_DIR = `${process.cwd()}/src/pages`;
enum PageType {
  REACT = "react",
  VUE = "vue",
}
const PAGE_TYPE_MAP: Record<
  PageType,
  {
    html: string;
    entry: string;
  }
> = {
  [PageType.REACT]: {
    html: `
  
  `,
    entry: ``,
  },
  [PageType.VUE]: { html: ``, entry: `` },
};

readline
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .question("页面名称: ", (input) => {
    const pageDir = `${PAGE_DIR}/${input}`;
    fs.mkdirSync(pageDir);
    fs.writeFileSync(`${pageDir}/index.html`, HTML_TEMPLATE);
    fs.writeFileSync(`${pageDir}/index.ts`, HTML_TEMPLATE);
  });
