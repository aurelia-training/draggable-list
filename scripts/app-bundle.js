define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
            this.listId = "people";
        }
        return App;
    }());
    exports.App = App;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('draggable-list',["require", "exports", "aurelia-framework", "./list-generator"], function (require, exports, aurelia_framework_1, list_generator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DraggableList = (function () {
        function DraggableList() {
            this.listGenerator = new list_generator_1.ListGenerator();
        }
        DraggableList.prototype.attached = function () {
            this.list = this.listGenerator.getList(this.listId).slice();
        };
        DraggableList.prototype.listIdChanged = function (newValue, oldValue) {
            if (!this.list)
                return;
            if (!list_generator_1.ListGenerator.compare(this.list, this.listGenerator.getList(oldValue))) {
                if (confirm("Do you want to save your changes?")) {
                    this.saveList(oldValue);
                }
            }
            this.attached();
        };
        DraggableList.mousemoveHandler = function (event) {
            var listElements = document.getElementsByClassName("list-element");
            var closestDistance = 1e5;
            var closestIndex = -1;
            for (var index = 0; index < listElements.length; index++) {
                if (Math.abs(event.clientY - listElements[index].getBoundingClientRect().top) < closestDistance) {
                    closestIndex = index;
                    closestDistance = Math.abs(event.clientY - listElements[index].getBoundingClientRect().top);
                }
            }
            var _this = document._this;
            if (closestIndex != _this.selectedElementIndex) {
                var thisList = _this.list;
                var thisElement = thisList.splice(_this.selectedElementIndex, 1);
                var resultList = thisList.slice(0, closestIndex).concat(thisElement);
                _this.list = resultList.concat(thisList.slice(closestIndex));
                _this.selectedElementIndex = closestIndex;
            }
        };
        DraggableList.mouseupHandler = function () {
            document.removeEventListener("mousemove", DraggableList.mousemoveHandler);
            document.removeEventListener("mouseup", DraggableList.mouseupHandler);
            document._this.selectedElementIndex = -1;
        };
        DraggableList.prototype.select = function (index) {
            document.addEventListener("mousemove", DraggableList.mousemoveHandler);
            document.addEventListener("mouseup", DraggableList.mouseupHandler);
            document._this = this;
            this.selectedElementIndex = index;
        };
        DraggableList.prototype.saveList = function (oldValue) {
            this.listGenerator.saveList(oldValue || this.listId, this.list);
        };
        DraggableList.prototype.resetList = function () {
            this.list = this.listGenerator.getList(this.listId).slice();
        };
        return DraggableList;
    }());
    __decorate([
        aurelia_framework_1.bindable,
        __metadata("design:type", String)
    ], DraggableList.prototype, "listId", void 0);
    exports.DraggableList = DraggableList;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

define('list-generator',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ListGenerator = (function () {
        function ListGenerator() {
            this.lists = {
                fibonacci: [],
                people: [],
                integers: []
            };
            this.lists.fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
            this.lists.integers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            this.lists.people = ["John Doe", "Jane Peterson", "Maggie Ewald", "Adam Johnson", "Bob Senford", "Carol Tanner"];
        }
        ListGenerator.prototype.getList = function (listId) {
            return this.lists[listId];
        };
        ListGenerator.prototype.saveList = function (listId, updatedList) {
            this.lists[listId] = updatedList.slice();
        };
        ListGenerator.compare = function (list1, list2) {
            return list1.length == list2.length && list1.every(function (element, index) {
                return element === list2[index];
            });
        };
        return ListGenerator;
    }());
    exports.ListGenerator = ListGenerator;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./draggable-list\"></require>\n  <require from=\"./style.css\"></require>\n  <select value.bind=\"listId\">\n    <option value=\"fibonacci\">fibonacci</option>\n    <option value=\"integers\">integers</option>\n    <option value=\"people\">people</option>\n  </select>\n  <draggable-list list-id.bind=\"listId\"></draggable-list>\n</template>\n"; });
define('text!draggable-list.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./draggable-list.css\"></require>\n  <div repeat.for=\"element of list\" class=\"list-element\">\n    <div class=\"element-handle\" mousedown.trigger=\"select($index)\">${$index == selectedElementIndex ? \"&#x2195;\" : \"&#x2630;\"}</div><!--\n --><div class=\"element-text\" id=\"element-${$index}\">${element}</div>\n  </div>\n  <button id=\"save-list\" click.trigger=\"saveList(null)\">Save List</button>\n  <button id=\"reset-list\" click.trigger=\"resetList()\">Reset List</button>\n</template>\n"; });
define('text!style.css', ['module'], function(module) { module.exports = "* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n"; });
define('text!draggable-list.css', ['module'], function(module) { module.exports = "draggable-list {\n  display: block;\n  width: 100%;\n}\n.list-element {\n  display: block;\n  width: 100%;\n  background-color: #888;\n}\n.element-handle {\n  display: inline-block;\n  width: 20px;\n  cursor: pointer;\n}\n.element-text {\n  display: inline-block;\n  width: calc(100% - 20px);\n}\n"; });
//# sourceMappingURL=app-bundle.js.map