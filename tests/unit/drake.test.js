const Drake = require('../../lib/models/drake');
const {assert} = require('chai');
describe('Drake model', () => {
    it('validates with required fields', () =>{
        const drake = new Drake({
            name: 'Drogo',
            color: 'red',
            legs: 2,
            horde: [
                {name: 'gold', weight: 100000000},
                {name: 'artifacts', weight: 66}
            ]
        });
        return drake.validate();
    });
    it('fails validation when required fields are missing', () => {
        const drake = new Drake();
        
        return drake.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    //console.log('name errors => ',errors.name);
                    assert.ok(errors.name);
                    //console.log('color errors => ',errors.color);
                    assert.ok(errors.color);
                }
            );
    });

    it('color should be of enum type', () => {
        const drake = new Drake({
            name: 'foo',
            color: 'brown'
        });
        
        return drake.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    //console.log('color errors => ',errors.color.kind);
                    assert.equal(errors.color.kind, 'enum');
                }
            );
    });
});