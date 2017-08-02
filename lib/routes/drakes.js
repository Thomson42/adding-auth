const express = require('express');
const router = express.Router();
const Drake = require('../models/drake');
const jsonParser = require('body-parser').json();

router
    .get('/:id', (req, res, next) => {
        Drake.findById(req.params.id)
            .lean()
            .then(drake => {
                if(!drake) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(drake);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Drake.find()
            .lean()
            .select('name color __v')
            .then(drakes => res.send(drakes))
            .catch(next);

    })
    .use(jsonParser)
    
    .post('/', (req, res, next) =>{
        const drake = new Drake(req.body);
        drake
            .save()
            .then(drake => res.send(drake))
            .catch(next);
    })
    .put('/:id', (req,res,next) => {
        Drake.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(drake => res.send(drake))
            .catch(next);
    })
    .delete('/:id', (req,res,next) => {
        Drake.findByIdAndRemove(req.params.id)
            .then(actor => res.send( { removed: actor !== null }))
            .catch(next);
    });


module.exports = router;