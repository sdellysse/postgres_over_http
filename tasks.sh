#!/usr/bin/env bash
cd "$( dirname "$0" )"
export PATH="$PWD/node_modules/.bin:$PATH"

if [ "$#" -eq "0" ]; then
  exec "$0" help
fi

task="$1"
shift

case "$task" in
  ::envrc)
    echo 'layout node' || exit $?
    echo 'git config --local core.hooksPath $PWD/.githooks' || exit $?
    echo ''
    "$0" tsx:eval '
      const { envSchema } = await import("./env_schema.ts");

      // Extract the {keyname, description} pairs from the env schema. If the
      // schema is an enum, and theres no existing description, generate one
      // from the enum options
      const vars = Object
        .keys(envSchema.shape)
        .map(key => ({
          key,
          desc: envSchema.shape[key].description
            ?? (
              (envSchema.shape[key].options !== undefined)
              ? `enum[ ${envSchema.shape[key].options.join(" | ")} ]`
              : undefined
            ),
        }))
      ;

      // print the keys with descriptions first
      for (const {key, desc} of vars) {
        if (desc === undefined) {
          continue;
        }
        console.log(`# ${key}:: ${desc}`);
        console.log(`export ${key}=`);
        console.log("");
      }

      // and now print keys without descriptions
      for (const {key, desc} of vars) {
        if (desc !== undefined) {
          continue;
        }
        console.log(`export ${key}=`);
      }
    ' || exit $?
  ;;

  ::node_modules)
    bun install --no-summary || exit $?
  ;;

  create:envrc)
    if [ -f .envrc ]; then
      echo ".envrc already exists"
      exit 1
    fi

    "$0" ::envrc > .envrc || exit $?
  ;;

  format)
    "$0" ::node_modules || exit $?

    prettier --ignore-unknown --write . || exit $?
  ;;

  http:start)
    "$0" ::node_modules || exit $?

    tsx ./src/index.ts || exit $?
  ;;

  tsx:eval)
    "$0" ::node_modules || exit $?

    tsx --eval="(async () => { $1; })()" || exit $?
  ;;


  *)
    "$0" help || exit $?
  ;;
esac
