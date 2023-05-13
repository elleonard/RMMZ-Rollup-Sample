import generateConfig from "./generateConfig";

(async () => {
  try {
    await generateConfig(process.argv[2]);
  } catch (e) {
    console.error(`[ERROR] ${process.argv[2]}`);
    console.error(e);
    console.error('');
  }
})();
