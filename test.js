QUnit.module('Create element', function(hooks) {

    hooks.beforeEach(function(assert) {

        hooks.tagsObj = { class: 'some-class', style: 'color: blue; display: block;' };

    });

    hooks.afterEach(function(assert) {

        tagsObj = {};

    });

    hooks.addClass = function(elem, className) {

        var newElem = elem.cloneNode(true);


        if (newElem.classList) {

            newElem.classList.add(className);

        } else {

            newElem.className = className;

        }


        return newElem;

    };


    QUnit.test('Create an element from the given tag name', function(assert) {

        var element = jc.create('div');


        assert.deepEqual(element[0], document.createElement('div'));

    });


    QUnit.test('Create an element from the given tag name and set the attrs with '

        + 'specified values from the given object literal', function(assert) {

    

        var element = jc.create('div', hooks.tagsObj);

    

        var elseElement = document.createElement('div');

        elseElement = hooks.addClass(elseElement, 'some-class');


        elseElement.style.color = 'blue';

        elseElement.style.display = 'block';

    

        console.log(element[0]); console.log(elseElement);

        assert.deepEqual(element[0], elseElement);

    });


    QUnit.test('Create an element from the given tag name, set the attrs with '

        + 'specified values from the given object literal and set innerHTML property '

        + 'to the given value', function(assert) {


        var innerHTML = 'some inner html';

        var element = jc.create('div', hooks.tagsObj, innerHTML);


        var elseElement = document.createElement('div');

        elseElement = hooks.addClass(elseElement, 'some-class');


        elseElement.style.color = 'blue';

        elseElement.style.display = 'block';

        elseElement.innerHTML = innerHTML;


        assert.deepEqual(element[0], elseElement);

    });

});


QUnit.module('Select elements');


QUnit.test('Select all elements by the given tag name', function(assert) {

    var selected = jc.select('div');

    var success = true;


    selected.forEach(function(element) { 

        if (element.tagName !== 'DIV') { success = false; }

    });


    assert.equal(success, true);

});


QUnit.test('Select all elements by the given class name', function(assert) {

    var elem1 = document.createElement('div');

    var success = true;


    elem1.className = 'test-class';

    document.body.appendChild(elem1);


    var selected = jc.select('.test-class');


    selected.forEach(function(element) { 

        if (element.className !== 'test-class') { success = false; }

    });


    assert.equal(success, true);

});


QUnit.test('Select all elements by the given id', function(assert) {

    var elem1 = document.createElement('div');


    elem1.setAttribute('id', 'test-id');

    document.body.appendChild(elem1);


    var selected = jc.select('#test-id');


    assert.deepEqual(selected[0], elem1);

});


QUnit.test('Select all elements by the given attribute and tag', function(assert) {

    var elem1 = document.createElement('input');

    var success = true;


    elem1.setAttribute('type', 'submit');

    elem1.style.display = 'none';

    document.body.appendChild(elem1);


    var selected = jc.select('input[type="submit"]');


    selected.forEach(function(element) {

        if (element.tagName !== 'INPUT'  || element.getAttribute('type') !== 'submit') {

            success = false; 

        }

    });


    assert.equal(success, true);

});


　

QUnit.module('Attributes', function(hooks) {

    hooks.beforeEach(function(assert) {

        hooks.elem1 = document.createElement('div');

        document.body.appendChild(hooks.elem1);

    });

    hooks.afterEach(function(assert) {

        document.body.removeChild(hooks.elem1);

        hooks.elem1 = null;

    });


    QUnit.test('Set the given attribute name of selected elements to the given value',  function(assert) {

        jc.select(hooks.elem1).attr('class', 'test-class');


        assert.equal(hooks.elem1.getAttribute('class'), 'test-class');

    });


    QUnit.test('Set the given attribute name of selected elements to the given values  from the '

        + 'object literal', function(assert) {

    

        jc.select(hooks.elem1).attr({ class: 'some-class', style: 'display: inline;' });


        assert.equal(hooks.elem1.getAttribute('class'), 'some-class');

        assert.equal(hooks.elem1.getAttribute('style'), 'display: inline;');

    });


    QUnit.test('Get the given attribute name of the first selected element', function (assert) {

        

        hooks.elem1.setAttribute('id', 'test-id');

    

        assert.equal(jc.select(hooks.elem1).attr('id'), 'test-id');

    });

});


QUnit.module('CSS', function(hooks) {

    hooks.beforeEach(function(assert) {

        hooks.elem1 = document.createElement('div');

        document.body.appendChild(hooks.elem1);

    });

    hooks.afterEach(function(assert) {

        document.body.removeChild(hooks.elem1);

        hooks.elem1 = null;

    });


    QUnit.test('Set the given css property of selected elements to the given value',  function(assert) {

        jc.select(hooks.elem1).css('background', 'blue');


        assert.equal(hooks.elem1.style.background, 'blue');

    });


    QUnit.test('Set the given css properties of selected elements to the given values  from the '

        + 'object literal', function(assert) {


        jc.select(hooks.elem1).css({ background: 'blue', width: '20px' });

    

        assert.equal(hooks.elem1.style.background, 'blue');

        assert.equal(hooks.elem1.style.width, '20px');

    });


    QUnit.test('Get the given css property of the first selected element', function (assert) {

        hooks.elem1.style.display = 'inline';


        assert.equal(jc.select(hooks.elem1).css('display'), 'inline');

    });

});


/*function addClass(element, class) {

    if (element.classList) {

        element.classList.add('some-class');

    } else {

        element.className = 'some-class';

    }

}*/

/*function before() {

    var elem1 = document.createElement('div');

    elem1.className = 'some-class another-class';

}*/
