angular.module("calculator")
       .component("calcBody", {
         template:
         `<div id="calc-body">
            <p id="message">{{$ctrl.message}}</p>
           <div id="display">{{$ctrl.displayValue}}</div>

           <section id="num-pad">
             <button ng-repeat="oneNum in $ctrl.numpad" ng-click="$ctrl.num(oneNum)" id="num{{oneNum}}">
               {{oneNum}}
             </button>
           </section>

           <section id="operations">
             <button ng-repeat="oneOperation in $ctrl.operations" ng-click="$ctrl.operation(oneOperation)" id="operation{{oneOperation}}">
               {{oneOperation}}
             </button>
           </section>

         </div>`,
         //providing services' names in an array with inline annotation will make sure
         //names stay the same after minification
         controller: ['$http', function CalcController($http) {

           const scope = this;
           scope.displayValue = "0";
           scope.message = "Hello World";
           scope.numpad = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.'];
           scope.operations = ['mr', 'x', '÷', 'mc', '-', '+', 'm+',  '%', '=', 'm-', 'AC'];
           scope.memoryOperations = ["mr", "mc", "m+", "m-"];
           scope.operators = ["x", "÷", "-", "+", "."];
           scope.num = value => {
                 if(scope.displayValue === "0") {
                   scope.displayValue = "";
                 }
                 scope.displayValue += value.toString();
             };


           scope.operation = value => {
             if (value === "AC") {
               scope.displayValue = "0";
               return;
             }
              const len = scope.displayValue.length;
              //non memory operations
             if(scope.memoryOperations.indexOf(value) === -1 && scope.operators.indexOf(scope.displayValue.charAt(len-1)) === -1 ) {
               if (value === "=") {
                 scope.displayValue = scope.displayValue.replace(/x/g, "*").replace(/÷/g, "/");
                 scope.displayValue = eval(scope.displayValue).toString();
               } else {
               scope.displayValue += value;
             }
             }

             else {
             //memory operations
             switch (value) {

               case "mc":
               $http({
               method: 'DELETE',
               url: 'http://localhost:3000/mc'
             }).then(res => {
               scope.message = res.data;
               scope.displayValue = "0";
             }, res => {
               scope.message = res.data;
               });
               break;

               case "mr":
               $http({
               method: 'GET',
               url: 'http://localhost:3000/memory'
             }).then(res => {
               scope.displayValue = res.data;
              //  console.log(typeof res.data);
             }, res => {
               scope.message = res.data;
               });
               break;

               case "m+":

               $http({
               method: 'POST',
               url: 'http://localhost:3000/mplus',
               data: { data: scope.displayValue },
               withCredentials: true
             }).then(res => {
                 scope.message = res.data;
               }, res => {
                scope.message = res.data;
               });
               break;

               case "m-":
               $http({
               method: 'PATCH',
               url: 'http://localhost:3000/mminus',
               data: { data: scope.displayValue },
               withCredentials: true
             }).then(res => {
                 scope.message = res.data;
               }, res => {
                scope.message = res.data;
               });
               break;
             }
           }
           };
         }
]
});
