# shipit-yaml

Load your config and tasks for [Shipit](https://github.com/shipitjs/shipit) from a yaml.

**Features:**

- No js boilerplate
- Simple
- Declarative

## Install

```
npm install shipit-yaml
```

## Usage

Move your config and tasks to a yaml.

Old:

```js
module.exports = shipit => {
  const user = "test";

  shipit.initConfig({
    default: {
      branch: "dev"
    },
    staging: {
      servers: "staging.myproject.com",
      workspace: `/home/${user}/website`
    },
    production: {
      servers: [
        {
          host: "app1.myproject.com",
          user: "john"
        },
        {
          host: "app2.myproject.com",
          user: "rob"
        }
      ],
      branch: "production",
      workspace: "/var/www/website"
    }
  });

  shipit.task("pwd", function() {
    return shipit.remote("pwd");
  });

  shipit.task("foo", async function() {
    await shipit.remote(`echo "${user}"`);
    await shipit.remote("bar");
    await shipit.remote("baz");
  });
};
```

New:

config.yml

```yaml
---
vars:
  user: test
config:
  default:
    branch: dev
  staging:
    servers: staging.myproject.com
    workspace: /home/{{user}}/website
  production:
    servers:
      - host: "app1.myproject.com",
        user: "john"
      - host: "app2.myproject.com",
        user: "rob"
    branch: "production",
    workspace: "/var/www/website"
tasks:
  pwd:
    - pwd
  foo:
    - echo "{{user}}"
    - bar
    - baz
```

The plugin will replace `{{user}}` with `{{user}}` in `vars`.

```js
const yamlPlugin = require("shipit-yml");

module.exports = shipit => {
  yamlPlugin("./config.yml")(shipit);
};
```

## License

MIT
