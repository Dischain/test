'use strict';

const express = require('express'),
      
      Articles = require('../models/article.js'),
      util = require('./rout_util.js'),

      router  = express.Router();


router.get(/article/, (req, res) => {
  console.log('ggg')
  const path = util.getPathToArticle(req.url);

  Articles.getArticle(path)
    .then((article) => {
      res.status(200);
      res.json({ article: article});
      res.end();
    })
});

// curl -H "Content-Type: application/json" -X POST -d '{"name": "test 1 article", "body": "some interesting body"}' 'localhost:3000/article/u2/Programming'
// curl 'localhost:3000/cat/u2/Programming'
router.post(/article/, (req, res) => {
  const body = req.body.body,
        name = util.sanitizeName(req.body.name),
        tags = req.body.tags || [],

        path = util.getPathToArticle(req.url);

  Articles.createByPath({name, body, path, tags})
    .then(() => {
      console.log('article posted')
      res.status(201);
      res.end();
    })
    .catch((err) => {
      res.status(409);
      res.json({ msg: error.message });
      res.end();
    });
});

router.delete(/article/, (req, res) => {
  const path = util.getPathToArticle(req.url);

  Articles.deleteArticle(path)
    .then(() => { res.status(200); res.end(); })
    .catch((error) => {
      res.status(404);
      res.json({ msg: error.message });
    });
});

router.put(/article/, (req, res) => {
  const path = util.getPathToArticle(req.url),
        newName = util.sanitizeName(req.body.newName),
        newBody = req.body.newBody;

  let updataArticleDataPromises = [];

  if (newName) {
    updataArticleDataPromises.push(Articles.rename(path, newName));
  }

  if (newBody) {
    updataArticleDataPromises.push(Articles.updateBody(path, newName));
  }

  Promise.all(updataArticleDataPromises)
    .then(() => { res.status(200); res.end(); })
    .catch((error) => {
      res.status(404);
      res.json({ msg: error.message });
    });
});

module.exports = router;