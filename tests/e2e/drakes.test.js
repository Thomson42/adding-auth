const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

//process.env.MONGODB_URI = 'mongodb://localhost:27017/adding-auth-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('drakes REST api',()=>{
    before(() => connection.dropDatabase());

    const drogo = {
        name: 'Smaug',
        color: 'red',
        legs: 2,
        horde: [
            {name: 'gold', weight: 100000000},
            {name: 'artifacts', weight: 66}
        ]
    };
    const smaug = {
        name: 'Smogg',
        color: 'red',
        legs: 2
    };
    
    const scatha = {
        name: 'Scatha',
        color: 'white',
        legs: 2

    };
    const glaurung = {
        name: 'Glaurung',
        color: 'black',
        legs: 2,
    };
    function saveDrake(drake) {
        return request.post('/drakes')
            .send(drake)
            .then(({body}) => {
                drake._id = body._id;
                drake.__v = body.__v;
                return body;
            });

    }
    it('saves a drake', () => {
        return saveDrake(smaug)
            .then(savedDrake => {
                assert.isOk(savedDrake._id);
                assert.equal(savedDrake.name, smaug.name);
                assert.equal(savedDrake.color, smaug.color);
            });
    });

    it('GETs drake if it exists', () => {
        return request
            .get(`/drakes/${smaug._id}`)
            .then(res => res.body)
            .then(drake => {
                assert.equal(drake.name, smaug.name);
                assert.equal(drake.color, smaug.color);
            });
    });

    it('returns 404 if drake does not exist', () => {
        return request.get('/drakes/58ff9f496aafd447254c29b5').then(
            () => {
                //resolve
                throw new Error('successful status code not expected');
            },
            ({ response }) => {
                //reject
                assert.ok(response.notFound);
                assert.isOk(response.error);
            }
        );
    });

    it('GET all drakes', () => {
        return Promise.all([
            saveDrake(scatha),
            saveDrake(glaurung),
        ])
            .then(() => request.get('/drakes'))
            .then(res => {
                const drakes = res.body;
                assert.deepEqual(drakes, [smaug, scatha, glaurung]);
            });
    });
    it('rewrites drake data by id', ()=>{
        return request.put(`/drakes/${smaug._id}`)
            .send(drogo)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,drogo.name);
                assert.equal(res.body.color,drogo.color);
            });
    });
    it('deletes drake by id', () =>{
        return request.delete(`/drakes/${scatha._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
    it('fails to delete drake by id', () =>{
        return request.delete(`/drakes/${scatha._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: false });
            });
    });
            
});