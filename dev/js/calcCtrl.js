function calcCtrl($scope){
  $scope.result = "0"; // DISPLAY VALUE
  $scope.newNumber = true; // is NEW NUMBER input?
  $scope.doubleNumber = false; // is DOUBLE NUMBER input?
  $scope.accumulator = ""; // ACCUMULATOR for all operations
  $scope.operation = null; // The LAST operation char
  $scope.countOfByte = 100; // Maximum count of char on display

  $scope.rad = true;
  $scope.deg = false;
  $scope.grad = false;

  $scope.hex = false;
  $scope.dec = true;
  $scope.oct = false;
  $scope.bin = false;
  $scope.curNotation = 10;

	$scope.init = function(){
    $scope.switchDec();
		$scope.calcRad();
	}


  // Switch the calculator to the 16TH operation mode
	$scope.switchHex = function(){
		let availableButtons = document.querySelectorAll("*[data-hex='true']");
		let disableButtons = document.querySelectorAll("*[data-hex='false'], *[data-dec='false'], *[data-oct='false'], *[data-bin='false']");

		disableButtons.forEach(function(button){
			button.disabled = true;
		});
		availableButtons.forEach(function(button){
			button.disabled = false;
		});

    $scope.curNotation = 16;
    switchNotation($scope.curNotation);
    $scope.byte(8);

    $(".radio-angle").addClass("hidden");
    $(".radio-byte").removeClass("hidden");
	}


  // Switch the calculator to the 10TH operation mode
	$scope.switchDec = function(){
		let availableButtons = document.querySelectorAll("*[data-dec='true']");
		let disableButtons = document.querySelectorAll("*[data-hex='false'], *[data-dec='false'], *[data-oct='false'], *[data-bin='false']");

		disableButtons.forEach(function(button){
			button.disabled = true;
		});
		availableButtons.forEach(function(button){
			button.disabled = false;
		});

    $scope.curNotation = 10;
    switchNotation($scope.curNotation);
    $scope.byte(100);

    $(".radio-byte").addClass("hidden");
    $(".radio-angle").removeClass("hidden");
	}


  // Switch the calculator to the 8TH operation mode
	$scope.switchOct = function(){
		let availableButtons = document.querySelectorAll("*[data-oct='true']");
		let disableButtons = document.querySelectorAll("*[data-hex='false'], *[data-dec='false'], *[data-oct='false'], *[data-bin='false']");

		disableButtons.forEach(function(button){
			button.disabled = true;
		});
		availableButtons.forEach(function(button){
			button.disabled = false;
		});

    $scope.curNotation = 8;
    switchNotation($scope.curNotation);
    $scope.byte(8);

    $(".radio-angle").addClass("hidden");
    $(".radio-byte").removeClass("hidden");
	}


  // Switch the calculator to the 2ND operation mode
	$scope.switchBin = function(){
		let availableButtons = document.querySelectorAll("*[data-bin='true']");
		let disableButtons = document.querySelectorAll("*[data-hex='false'], *[data-dec='false'], *[data-oct='false'], *[data-bin='false']");

		console.log('bin:'+disableButtons.length);
		disableButtons.forEach(function(button){
			button.disabled = true;
		});
		availableButtons.forEach(function(button){
			button.disabled = false;
		});

    $scope.curNotation = 2;
    switchNotation($scope.curNotation);
    $scope.byte(8);

    $(".radio-angle").addClass("hidden");
    $(".radio-byte").removeClass("hidden");
	}


  $scope.byte = function(countOfByte){
    if($scope.hex){
      $scope.countOfByte = countOfByte * 2;
    }
    else if($scope.oct){
      $scope.countOfByte = countOfByte * 3;
    }
    else if($scope.bin){
      $scope.countOfByte = countOfByte * 8;
    }
    else{
      $scope.countOfByte = 100;
    }
  }


  // Switch the calculator to the mode of operation with DEGREES
  $scope.calcDeg = function(val){
    $scope.rad = false;
    $scope.deg = true;
    $scope.grad = false;
  }


  // Switch the calculator to the mode of operation with RADIANS
  $scope.calcRad = function(){
    $scope.rad = true;
    $scope.deg = false;
    $scope.grad = false;
  }


  // Switch the calculator to the mode of operation with GRADS
  $scope.calcGrad = function(){
    $scope.rad = false;
    $scope.deg = false;
    $scope.grad = true;
  }


  // Function for UPDATE DISPLAY of the calculator
  $scope.updateResult = function(num) {
    if($scope.countOfByte > $scope.result.length){
      if($scope.operation){
        $scope.accumulator += String($scope.operation);
        $scope.operation = null;
      }

      // Handle DECIMAL POINT
      if(num == "."){
        if($scope.doubleNumber){
          return ;
        }
        else{
          $scope.doubleNumber = true;
        }

        if($scope.newNumber){
          num = "0.";
          $scope.result = "0.";
          $scope.accumulator += String(num);
          $scope.newNumber = false;
          return ;
        }
        else{
          $scope.result += String(num);
          $scope.accumulator += String(num);
          return ;
        }
      }

      if($scope.result == "0" && num == "0"){
        return ;
      }

      if($scope.result == "0" || $scope.newNumber) {
        $scope.result = String(num);
        $scope.newNumber = false;
      }
      else {
        $scope.result += String(num);
      }

      $scope.accumulator += String(num);
    }
  };


  // Function handle EQUALLY button
  $scope.equally = function() {
    $scope.operation = null;

    let tmpCalc = calcEval($scope.accumulator);
    $scope.result = (tmpCalc === null) ? $scope.result : tmpCalc;

    // Write operations in localStorage
    let curCalc = String(localStorage.length);
    localStorage.setItem(curCalc, $scope.accumulator + "=" + $scope.result);

    newResult();
  };


  // Function handle UNARY operations
  $scope.addUnOperation = function(operator){
    $scope.accumulator += operator;

    let tmpCalc = calcEval($scope.accumulator);
    $scope.result = (tmpCalc === null) ? $scope.result : tmpCalc;

    newResult();
  }


  // Function handle BINARY operations
  $scope.addBinOperation = function(operator){
    $scope.operation = operator;

    let tmpCalc = calcEval($scope.accumulator);
    $scope.result = (tmpCalc === null) ? $scope.result : tmpCalc;

    newResult();
  }


  // Function handle TRIGONOMETRY operations
  $scope.addTrigOperation = function(operator){
    $scope.operation = operator;

    resetAccumulator();
    if($scope.deg){
      $scope.result = new trigUnits($scope.result).deg();
      $scope.accumulator += String("Math." + operator + "(" + $scope.result + ")");
    }
    else if($scope.rad){
      $scope.result = new trigUnits($scope.result).rad();
      $scope.accumulator += String("Math." + operator + "(" + $scope.result + ")");
    }
    else if($scope.grad){
      $scope.result = new trigUnits($scope.result).grad();
      $scope.accumulator += String("Math." + operator + "(" + $scope.result + ")");
    }

    let tmpCalc = calcEval($scope.accumulator);
    $scope.result = (tmpCalc === null) ? $scope.result : tmpCalc;

    newResult();
  }


  // Function handle EMBEDDED JAVASCRIPT MATH operations
  $scope.addEmbeddedOperation = function(operator){
    $scope.operation = operator;

    resetAccumulator();
    $scope.accumulator += String("Math." + operator + "(" + $scope.result + ")");

    let tmpCalc = calcEval($scope.accumulator);
    $scope.result = (tmpCalc === null) ? $scope.result : tmpCalc;

    newResult();
  }


  // Function handle FACTORIAL
  $scope.factorialOperator = function(){
    $scope.operation = "";

    resetAccumulator();

    let tmpResult = 1;
    for (var i = 2; i <= $scope.result; i++){
      tmpResult = tmpResult * i;
    }

    $scope.result = tmpResult;
    $scope.accumulator += $scope.result;
  }


  // Function handle 1/X button
  $scope.fractionOperator = function(){
    $scope.operation = "";

    resetAccumulator();

    $scope.result = 1/$scope.result;
    $scope.accumulator += $scope.result;
  }


  // Function input PI
  $scope.pi = function(){
    $scope.result = Math.PI;

    if($scope.operation){
      $scope.accumulator += String($scope.operation);
      $scope.operation = null;
    }

    $scope.accumulator += $scope.result;
  }


  // Function transform number to DEGREE MINUTES SECONDS format
  $scope.dms = function(){
    resetAccumulator();

    let tmpResult = Number($scope.result);
    tmpResult = (Math.floor(tmpResult) + ((tmpResult - Math.floor(tmpResult)) * 0.6)).toFixed(2);

    $scope.result = String(tmpResult);

    $scope.accumulator += $scope.result;
  }


  // Function transform number to SCIENTIFIC FORMAT and back
  $scope.exponential = function(){
    resetAccumulator();

    let tmpResult = $scope.result.split(/^([+-]?\d+)\.?(\d*)[eE]([+-]?\d+)$/).clean("");
    if(~$scope.result.search(/[eE]+/)){
      if(tmpResult.length == 3){
        $scope.result = String(((tmpResult[0] + "." + tmpResult[1]) * Math.pow(10,tmpResult[2])).toFixed(tmpResult[1].length - Math.abs(tmpResult[2])));
      }
      else if(tmpResult.length == 2){
        $scope.result = String(tmpResult[0] * Math.pow(10,tmpResult[1]));
      }
      else{
        $scope.result = String(tmpResult[0]);
      }
    }
    else{
      $scope.result = String($scope.result.split(/^(\(?)([+-]?\d+\.?\d*)(\)?)$/)[2]);
      $scope.result = String(Number($scope.result).toExponential());
    }

    $scope.accumulator += $scope.result;
  }


  // Function handle +/- button
  $scope.switchSign = function(){
    let resultEval = String(eval($scope.result));
    if(resultEval != "0"){
      resetAccumulator();
      $scope.result = resultEval;

      if(Number($scope.result) > 0){
        $scope.result = "(-" + Number($scope.result) + ")";
      }
      else if(Number($scope.result) < 0){
        $scope.result = String(Math.abs(Number($scope.result)));
      }

      $scope.accumulator += $scope.result;
    }
  }


  // Function handle NOT operator
  $scope.not = function(){
    resetAccumulator();
    $scope.accumulator += "~" + $scope.result;

    let tmpCalc = calcEval($scope.accumulator);
    $scope.result = (tmpCalc === null) ? $scope.result : tmpCalc;

    newResult();
  }


  // Function transfrom number to INTEGER FORMAT
  $scope.int = function(){
    resetAccumulator();
    $scope.result = String(Math.floor(Number($scope.result)));
    $scope.accumulator += $scope.result;
  }


  // Function handle OPEN/CLOSE BRACKETS
  $scope.brackets = function(char){
    $scope.accumulator += char;
  }


  // Function for clear CURRENT DISPLAY VALUE
  $scope.clearResult = function() {
    $scope.result = "0";
    $scope.accumulator = "";
    $scope.operation = null;
    newResult();
  };


  // Function for clear CURRENT ACCUMULATOR VALUE
  $scope.clear = function() {
    if($scope.result.length > 0){
      resetAccumulator();
      $scope.result = "0";
      $scope.operation = null;
    }
    newResult();
  };


  // Function for delete ONE CHAR for display
  $scope.backspace = function() {
    if($scope.result[$scope.result.length-1] == "."){
      $scope.doubleNumber = false;
    }
    if($scope.result.length > 0){
      $scope.result = ($scope.result.length === 1) ? "0" : $scope.result.slice(0, -1);
      $scope.accumulator = $scope.accumulator.slice(0, -1);
    }
  };


  // Function for prepare for new input
  function newResult(){
    $scope.newNumber = true;
    $scope.doubleNumber = false;
  }


  function resetAccumulator(){
    $scope.accumulator = $scope.accumulator.slice(0, -$scope.result.length);
  }


  // Function for CALCULATE input string (accumulator's string)
  function calcEval(strResult){
    let result = null;

    try{
      result = String(eval(strResult));
    }
    catch(err){
      console.log("Строка не может быть посчитана: " + strResult);
    }

    return result;
  }


  function transformNotation(notation){
    if($scope.hex){
      $scope.result = parseInt($scope.result, 16);
      $scope.result = Number($scope.result).toString(notation);
    }
    else if($scope.dec){
      $scope.result = parseInt($scope.result, 10);
      $scope.result = Number($scope.result).toString(notation);
    }
    else if($scope.oct){
      $scope.result = parseInt($scope.result, 8);
      $scope.result = Number($scope.result).toString(notation);
    }
    else if($scope.bin){
      $scope.result = parseInt($scope.result, 2);
      $scope.result = Number($scope.result).toString(notation);
    }
  }


  function transformNotationForEval(str){
    let result = "";
    if($scope.hex){
      return result = "0x" + str;
    }
    else if($scope.dec){
      return result = str;
    }
    else if($scope.oct){
      return result = "0o" + str;
    }
    else if($scope.bin){
      return result = "0b" + str;
    }
  }

  function switchNotation(notation){
    switch (notation){
      case 16:
        transformNotation(16);
        $scope.hex = true;
        $scope.dec = false;
        $scope.oct = false;
        $scope.bin = false;
        break;
      case 8:
        transformNotation(8);
        $scope.hex = false;
        $scope.dec = false;
        $scope.oct = true;
        $scope.bin = false;
        break;
      case 2:
        transformNotation(2);
        $scope.hex = false;
        $scope.dec = false;
        $scope.oct = false;
        $scope.bin = true;
        break;
      case 10:
      default:
        transformNotation(10);
        $scope.hex = false;
        $scope.dec = true;
        $scope.oct = false;
        $scope.bin = false;
        break;
    }
  }

}

export {calcCtrl};
