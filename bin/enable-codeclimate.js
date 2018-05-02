#!/usr/bin/env node
const rp = require('request-promise');
const path = require('path');
const assert = require('assert');
const { URL } = require('url');

const token = process.env.CODECLIMATE_API_TOKEN;
assert(token, 'CODE_CLIMATE_API_TOKEN env var not set');

const orgId = process.env['CODECLIMATE_ORGANIZATION_ID'];
assert(orgId, 'CODECLIMATE_ORGANIZATION_ID env var not set');

const currentPath = process.cwd();
const repoUrl = new URL(require(path.join(currentPath, 'package.json')).repository.url);
repoUrl.pathname = repoUrl.pathname.replace(/.git$/, '');
repoUrl.href = repoUrl.href.replace(/^git:/, 'https:');
console.log('Enable code climate on repository:', repoUrl.href);

async function main () {
  await rp({
    method: 'get',
    uri: `https://api.codeclimate.com/v1/orgs/${orgId}/repos`,
    headers: {
      Authorization: `Token token=${token}`
    },
    json: true
  }).then((resp) => {
    const repos = (resp.data.map((r) => r.attributes.github_slug));
    const repoSlug = repoUrl.pathname.replace(/^\//, '');
    if (repos.includes(repoSlug)) {
      console.log('Repo already added, not adding.');
      process.exit(0);
    }
  });

  rp({
    method: 'post',
    uri: `https://api.codeclimate.com/v1/orgs/${orgId}/repos`,
    headers: {
      Authorization: `Token token=${token}`
    },
    body: {
      data: {
        type: 'repos',
        attributes: {
          url: repoUrl.href
        }
      }
    },
    json: true
  }).then((resp) => {
    console.log('done', resp);
  }).catch((err) => {
    if (err.statusCode && err.message) return console.error(err.message);
    console.error('error:', err);
  });
}

main();
