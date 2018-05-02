# enable-codelimate
Ensure these env vars are set:
- `CODECLIMATE_ORGANIZATION`
- `CODECLIMATE_API_TOKEN`
Then for the repo you want to enable codeclimate on:
```shell
$ cd /my/repo
$ npm i -D enable-codeclimate
$ npx enable-codeclimate
```
