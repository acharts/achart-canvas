var  expect = require('expect.js'),
    sinon = require('sinon'),
    Util = require('../src/util'),
    $ = require('jquery');

describe('test util with raphael',function(){

    it('angle',function(){
        var angle = Util.angle(10,10,0,0);

        expect(angle).to.be(45);
    });

    it('test anim step',function(done){
        var spy = sinon.spy(),
            callback = sinon.spy();
        Util.animStep(500,function(factor){
            spy();
        },callback);

        setTimeout(function(){
            expect(callback.called).to.be(true);
            expect(spy.called).to.be(true);
            expect(spy.callCount > 1).to.be(true);
            done();
        },550);

    });

    it('stopStep',function(done){
        var spy = sinon.spy(),
            callback = sinon.spy();
        var handler = Util.animStep(500,function(factor){
            spy();
        },callback);

        setTimeout(function(){
            Util.stopStep(handler);
        },200);

        setTimeout(function(){
            expect(callback.called).to.be(false);
            expect(spy.called).to.be(true);
            expect(spy.callCount > 1).to.be(true);
            done();
        },500);
    });

    it('getPointAtLength',function(){
        var path = 'M 100 100 L 100 40 L 30 40';

        var point = Util.getPointAtLength(path,50);
        expect(point.x).to.be(100);
        expect(parseInt(point.y)).to.be(50);
    });

    it('isPointInsidePath',function(){
        var path = 'M 0 0 L 10 0 L 10 10 L 0 10 z';

        expect(Util.isPointInsidePath(path,5,5)).to.be(true);

        expect(Util.isPointInsidePath(path,10,11)).to.be(false);
    });

    it('getSubpath',function(){
        var path = 'M 0 0 L 10 0 L 10 10 L 0 10 z';
        var subPath = Util.getSubpath(path,1,2);
        expect(subPath).not.to.be(null);
    });

    it('parsePathString',function(){
        var path = 'M0 0 L10 0 L10 10 L0 10 z';
        var arr = Util.parsePathString(path);

        expect(arr.length).to.be(5);

    });

    it('parsePathArray',function(){
        var path = 'M0 0 L10 0 L10 10 L0 10 z';
        var arr = Util.parsePathString(path);
        expect(Util.parsePathArray(arr)).to.be(path);
    });

    it('transformPath',function(){

    });

    it('snapTo',function(){
        var arr = [1,5,10,12,15,18,20,25];

        var value = 13;

        expect(Util.snapTo(arr,value)).to.be(12);

        expect(Util.snapFloor(arr,value)).to.be(12);

        expect(Util.snapCeiling(arr,value)).to.be(15);
    });

    it('tryFixed',function(){
        var base = 0.25,
            value = 1.2344;
        expect(Util.tryFixed(value,base)).to.be(1.23);
    });

    it('try set',function(){

        var obj = {a : 123};
        expect(Util.trySet(obj,'a')).to.be(123);

        expect(obj.b).to.be(undefined);
        expect(Util.trySet(obj,'b','b')).to.be('b');

        expect(obj.b).to.be('b');

    });

    it('highlight',function(){
        var c = 'red';
        expect(Util.highlight(c,.15)).to.be('#ff2626');
    });

    it('dark',function(){
        var c = '#fff';
        expect(Util.dark(c,.15)).to.be('#d8d8d8');
    });
});

describe('dom',function(){

    it('create dom',function(){
        var str = '<div id="t1"></div>',
            dom = Util.createDom(str);
        document.body.appendChild(dom);
        expect(dom).not.to.be('undefined');
        expect(document.getElementById('t1')).to.be(dom);

        expect($(dom).width()).to.be(Util.getWidth(dom));
    });

    it('create tr',function(){
        var str = '<tr id="t2"></tr>',
            dom = Util.createDom(str);
        expect(dom).not.to.be('undefined');
        expect(Util.isString(dom)).not.to.be(true);
    });

    it('addevent,removeEvnet',function(){

    });

    it('getOffset',function(){
        
    });

    it('contains',function(){

    });
});