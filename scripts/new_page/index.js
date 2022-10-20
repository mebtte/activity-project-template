const fs = require("fs/promises");

const PAGE_DIR = `${process.cwd()}/src/pages`;
const PAGE_TYPES = ["vanilla", "react", "vue"];

async function newPage() {
  const { default: inquirer } = await import("inquirer");
  const answer = await inquirer.prompt([
    {
      name: "name",
      message: "页面 ID, 字母/数字/分隔符的组合, 用于辨识页面和 url:",
      type: "input",
    },
    {
      name: "template",
      message: "选择模板:",
      type: "list",
      choices: Object.values(PAGE_TYPES),
    },
  ]);

  const { name, template } = answer;
  await fs.cp(`${__dirname}/${template}`, `${PAGE_DIR}/${name}`, {
    recursive: true,
  });
}

newPage();
