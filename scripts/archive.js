const fs = require("fs/promises");
const { Parcel } = require("@parcel/core");

const PAGE_DIR = `${process.cwd()}/src/pages`;
const DIST_DIR = `${process.cwd()}/dist`;
const PARCELRC_PATH = `${process.cwd()}/.parcelrc`;

async function archive() {
  const files = await fs.readdir(PAGE_DIR);
  const pages = [];
  for (const file of files) {
    const stat = await fs.stat(`${PAGE_DIR}/${file}`);
    if (stat.isDirectory()) {
      pages.push(file);
    }
  }

  if (!pages.length) {
    throw new Error("没有可以归档的页面");
  }

  const { default: inquirer } = await import("inquirer");
  const { page } = await inquirer.prompt([
    {
      name: "page",
      message: "选择归档的页面:",
      type: "list",
      choices: pages,
    },
  ]);

  // 清空 dist 目录
  await fs.rm(DIST_DIR, { recursive: true, force: true });

  // 临时移除 .parcelrc
  const parcelrc = await fs.readFile(PARCELRC_PATH);
  await fs.rm(PARCELRC_PATH);

  const bundler = new Parcel({
    entries: `${PAGE_DIR}/${page}/index.html`,
    defaultConfig: "@parcel/config-default",
    defaultTargetOptions: {
      publicUrl: "./",
      sourceMaps: false,
    },
  });
  await bundler.run();

  // 恢复 .parcelrc
  await fs.writeFile(PARCELRC_PATH, parcelrc);

  // 复制构建产物到 static
  await fs.cp(DIST_DIR, `${process.cwd()}/static/${page}`, { recursive: true });

  // 移除原始页面
  await fs.rm(`${PAGE_DIR}/${page}`, { recursive: true });
}

archive();
