const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app} = require('../server');
chai.use(chaiHttp);

describe('GET endpoint', function() {
    let res;
    it('should return hello world', function(){
        return chai.request(app)
            .get('/')
            .then(function(_res){
                res = _res;
                res.should.have.status(200);
            })
    })
});