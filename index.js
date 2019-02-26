const yaml = require("js-yaml");
const fs = require("fs");
const mapObj = require("map-obj");

const replaceVars = (str, vars) => {
  vars.forEach(([k, v]) => {
    str = str.replace(new RegExp(`{{${k}}}`, "gmi"), v);
  });

  return str;
};

module.exports = path => shipit => {
  const config = yaml.safeLoad(fs.readFileSync(path, "utf8"));
  const vars = Object.entries(config.vars);
  delete config.vars;

  const newObject = mapObj(
    config,
    (key, value) => {
      if (typeof value === "string") value = replaceVars(value, vars);
      if (value instanceof Array) value = value.map(v => replaceVars(v, vars));

      return [key, value];
    },
    { deep: true }
  );

  shipit.initConfig(newObject.config);

  Object.entries(newObject.tasks).forEach(([name, commands]) => {
    shipit.task(name, async () => {
      const all = commands.reduce(
        (chain, cmd) => chain.then(() => shipit.remote(cmd)),
        Promise.resolve()
      );

      await all;
    });
  });

  return shipit;
};
