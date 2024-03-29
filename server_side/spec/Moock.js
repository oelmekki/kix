(function(){
/*
---
description: A Class Mutator for mocking classes

license: MIT-style

authors:
- Arieh Glazer

requires:
- core/1.3: [Class]

provides: [Class.Mutators.Mock]

...
*/
/*!
Copyright (c) 2010 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/

var global_scope = this;

/**
 * creates a stub function
 * @param {Mixed} value if passed, the stub will return this value once it runs.
 * @return {Function} a stub function
 */
Class.Mutators.Mock = function(methods){
    for (var name in methods){
        if (!(methods.hasOwnProperty(name))) continue;
        
        this.prototype[name] = new Moock.Stub(methods[name]);
    }
};

/* Helper Functions */

/**
 * Creates a mock object that is an instance of a given class
 * @param {String} classname the name of that Class to be mocked.
 * @param {Object} methods a list of method names and their returned values
 * 
 * @return {Class} a new Mocked Class
 */
var getMock = this.getMock = function(classname,methods){
    if (global_scope[classname]){
        return new Class({
            Extends : global_scope[classname]
            , Mock : methods
        });
        
    }
    
    return global_scope[classname] = new Class({Mock:methods});
}


/*
---
description: Main Moock API, including and Assertion Decorator for cross-lib and a Stubbing mechanism

license: MIT-style

authors:
- Arieh Glazer

provides: [Moock,Moock.Stub,Moock.Assert,isStub]

...
*/
/*!
Copyright (c) 2010 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/


/**
 * Main Namespace 
 * 
 * Contains Version Number, Assertion Helpers, and Moock.Stub 
 */
var Moock = this.Moock = {
	version : "0.8.2"
	/**
	 * @var {Function} pointer used to tell the stub to return "this"
	 */
	, return_self : function(){}
	/**
     * Library Assertion Helpers for cross-lib compatibility.
     * Currently Supported:
     *   - YUI test
     *   - QUnit
     *   - Jasmine
     *   - JsTestRunner
     */
    , Libraries : { }
	/**
	 * Cross-Lib Assertion Decorators
	 */
	, Assert : {
		/**
		 * Asserts that an expression is true (===).  
		 * @param {Object} expr 
		 * @param {Object} msg
		 */
		isTrue : function(expr,msg){
		  var libs = Moock.Libraries;
		  for (var name in libs){
		  	if (libs[name].check) libs[name].isTrue(expr,msg);
		  }	
		}
		/**
		 * Asserts that two values are equal
		 * @param {Object} expect
		 * @param {Object} actual
		 * @param {Object} msg
		 */
		, areEqual : function(expect,actual,msg){
          var libs = Moock.Libraries;
          for (var name in libs){
            if (libs[name].check) libs[name].areEqual(expect,actual,msg);
          } 			
		}
	}
	/**
	 * Stubbing Factory. Returns the Stub function. 
	 * 
	 * The returned stub comes with a set of syntax helpers methods that can create readable expectations.
	 * These can only work for supported libs. You can extend the Moock.Assert to support other test libs.
	 *  
	 * @param {Object} value a value to be returned by the function
	 * 
	 * @return {Function} a stub function
	 */
	, Stub : function Stub(value){
	    function stb(){
	        var value = stb.returned;
	        
	        stb.used++;
			 
			if (stb.tests.args) Moock.Assert.areEqual(
			   stb.tests.args
			   , arguments
			   , "Passed parameters do not meet expectations"
			);
			
	        stb.args = arguments;
	        if (value === Moock.return_self) return this;
	        if (typeof value == 'function') return value.apply(stb,arguments);
	        return value;
	    }
	    
	    stb.used = 0;
	    stb.args = [];
	    
	    stb.returned = value;
	    
	    stb.tests = {
	        used : false
	      , args : false
	    };
	    
		/* Syntax Helpers */
		
		/**
		 * How many times the function should run 
		 * @param {Boolean|Number} num if set to true, will expect the function to run at least once. 
		 *    If a number is supplied, should run the exact amount of times.
		 *    
		 * @return {Function} the stub object
		 */
	    stb.called = function shouldBeCalled(num){
	       if (!num && num !==0){
	           stb.tests.used = true;
	       }else if (num || num===0){
	           stb.tests.used = num;
	       }
	       return stb;
	    };
	    
		/**
		 * What argument should the function receive 
		 * @param {Array} args
         *    
         * @return {Function} the stub object
		 */
	    stb.receive = function(args){
	       stb.tests.args = args;
	       return stb;
	    };  
	    
		/**
		 * what value whould the stub retrun (can function as a replacement for the value argument)
		 * 
		 * @param {Mixed} value
         *    
         * @return {Function} the stub object
		 */
	    stb.returnedValue = function(value){
	       stb.returned = value;
	       return stb;
	    };
	    
		/**
		 * tests that the expectation defined were met.
         *    
         * @return {Function} the stub object
		 */
	    stb.test = function(){
		   var msg = "Number of calls did not meet expectation";
		   
		   if (typeof this.tests.used === 'number'){
	           Moock.Assert.areEqual(this.tests.used,this.used,msg);
	       }else if (this.tests.used) Moock.Assert.isTrue(!!this.called,msg);
		   
		   return stb;
	    };
	    
	    return stb;
	}
};

/* Helper Functions */

/**
 * checks if a passed variable is a stub
 * @param {Object} stub
 * @return {bool}
 */
var isStub = this.isStub = function(stub){
    return ("args" in stub && "called" in stub);
};


/*
---
description: Adds Extra Library support for Moock.Assert

license: MIT-style

authors:
- Arieh Glazer

provides: [Moock.Libraries.YUI,Moock.Libraries.QUnit,Moock.Libraries.jasmine]

...
*/
/*!
Copyright (c) 2010 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/

		
Moock.Libraries.jasmine = {
            check : true
            , isTrue : function(expr,msg){
                expect(expr).toEqual(true);
            }
            , areEqual : function(expect,actual,msg){
                expect(actual).toEqual(expect);
            }
        };
		


}).apply( typeof exports == 'undefined' ? this : global );
